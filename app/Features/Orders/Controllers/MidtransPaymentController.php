<?php

namespace App\Features\Orders\Controllers;

use App\Features\Orders\Models\Order;
use App\Features\Orders\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\GenericMail;
use App\Http\Controllers\Controller;

class MidtransPaymentController extends Controller
{
    // Mapping Midtrans transaction_status ke payment_status kita
    const STATUS_MAP = [
        'capture'    => 'paid',
        'settlement' => 'paid',
        'pending'    => 'pending',
        'authorize'  => 'pending',
        'deny'       => 'failed',
        'cancel'     => 'failed',
        'expire'     => 'failed',
        'failure'    => 'failed',
        'refund'     => 'refunded',
        'partial_refund' => 'partial_refund',
    ];

    /**
     * Snap callback — pembayaran berhasil
     * Dipanggil via AJAX dari frontend (POST) atau redirect Midtrans (GET)
     */
    public function success(Request $request)
    {
        $payload = $this->extractPayload($request);
        Log::info('[Midtrans] success() called', [
            'method' => $request->method(),
            'is_ajax' => $request->ajax(),
            'payload' => $payload,
            'headers' => $request->headers->get('content-type'),
        ]);

        $orderId = $payload['order_id'] ?? null;
        if (!$orderId) {
            Log::error('[Midtrans] success: order_id missing from payload');
            return $this->respond($request, null, 'order_id missing', false);
        }

        // === LANGKAH 1: Cari order & payment berdasar transaction_id ===
        $payment = Payment::where('transaction_id', $orderId)->first();
        if (!$payment) {
            Log::error('[Midtrans] success: Payment not found', ['transaction_id' => $orderId]);
            return $this->respond($request, null, 'Payment not found for transaction_id: ' . $orderId, false);
        }

        $order = Order::find($payment->order_id);
        if (!$order) {
            Log::error('[Midtrans] success: Order not found', ['order_id' => $payment->order_id]);
            return $this->respond($request, null, 'Order not found', false);
        }

        // === LANGKAH 2: Validasi payload ===
        // NOTE: Snap onSuccess callback TIDAK mengirim signature_key,
        // jadi kita tidak bisa verifikasi signature di sini.
        // Validasi dilakukan via: order_id → payment → order cocok + status masih pending.
        $hasSignature = !empty($payload['signature_key']);
        if ($hasSignature) {
            if (!$this->verifySignature($payload)) {
                Log::error('[Midtrans] success: SIGNATURE VERIFICATION FAILED', [
                    'transaction_id' => $orderId,
                    'order_id' => $order->id,
                    'payload_signature' => $payload['signature_key'] ?? null,
                ]);
                return $this->respond($request, null, 'Signature mismatch', false);
            }
            Log::info('[Midtrans] success: Signature verified OK', ['transaction_id' => $orderId]);
        } else {
            Log::info('[Midtrans] success: No signature_key in payload (normal untuk Snap onSuccess), skipping verification', [
                'transaction_id' => $orderId,
                'transaction_status' => $payload['transaction_status'] ?? null,
            ]);
        }

        // Cegah overwrite status yang sudah final
        if (!in_array($order->payment_status, ['pending'])) {
            Log::warning('[Midtrans] success: Order payment_status already final, skipping', [
                'order_id' => $order->id,
                'current_status' => $order->payment_status,
            ]);
            return $this->respond($request, $order, 'already ' . $order->payment_status, true);
        }

        // === LANGKAH 3: Update database ===
        $transactionStatus = $payload['transaction_status'] ?? 'settlement';
        $fraudStatus = $payload['fraud_status'] ?? 'accept';

        $this->updatePaymentStatus($order, $payment, $transactionStatus, $fraudStatus);

        Log::info('[Midtrans] success: Payment updated successfully', [
            'order_id' => $order->id,
            'payment_status' => $order->fresh()->payment_status,
            'order_status' => $order->fresh()->status,
            'payment_status_db' => $payment->fresh()->status,
        ]);

        return $this->respond($request, $order, 'success', true);
    }

    /**
     * Snap callback — pembayaran gagal
     */
    public function fail(Request $request)
    {
        $payload = $this->extractPayload($request);
        Log::info('[Midtrans] fail() called', [
            'method' => $request->method(),
            'payload' => $payload,
        ]);

        $orderId = $payload['order_id'] ?? null;
        if (!$orderId) {
            return $this->respond($request, null, 'order_id missing', false);
        }

        $payment = Payment::where('transaction_id', $orderId)->first();
        $order = $payment ? Order::find($payment->order_id) : null;

        if ($order && $payment) {
            if (!in_array($order->payment_status, ['pending'])) {
                Log::warning('[Midtrans] fail: Order already in final status, skipping', [
                    'order_id' => $order->id,
                    'current_status' => $order->payment_status,
                ]);
                return $this->respond($request, $order, 'already ' . $order->payment_status, false);
            }
            $order->update(['payment_status' => 'failed']);
            $payment->update(['status' => 'failed']);
            Log::info('[Midtrans] fail: Order marked as failed', ['order_id' => $order->id]);
        } else {
            Log::warning('[Midtrans] fail: Order/payment not found for update', [
                'transaction_id' => $orderId,
                'payment_found' => $payment ? true : false,
            ]);
        }

        return $this->respond($request, $order, 'payment failed', false);
    }

    /**
     * Snap callback — user membatalkan pembayaran
     */
    public function cancel(Request $request)
    {
        $payload = $this->extractPayload($request);
        Log::info('[Midtrans] cancel() called', ['payload' => $payload]);

        $orderId = $payload['order_id'] ?? null;
        if (!$orderId) {
            return redirect()->route('home')->with('info', 'Payment cancelled.');
        }

        $payment = Payment::where('transaction_id', $orderId)->first();
        $order = $payment?->order;

        if ($order) {
            $order->update(['payment_status' => 'cancelled']);
            $payment->update(['status' => 'cancelled']);
            Log::info('[Midtrans] cancel: Order cancelled', ['order_id' => $order->id]);
        }

        return redirect()->route('checkout.cancel', ['order' => $order?->id])->with('info', 'Payment cancelled.');
    }

    /**
     * IPN (Instant Payment Notification) — dipanggil Midtrans server ke server
     * Hanya bekerja di production/dev server yg bisa diakses internet
     */
    public function ipn(Request $request)
    {
        $payload = $request->all();
        Log::info('[Midtrans] IPN received', [
            'payload' => $payload,
            'headers_content_type' => $request->headers->get('content-type'),
        ]);

        $orderId = $payload['order_id'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? '';
        $fraudStatus = $payload['fraud_status'] ?? '';

        if (!$orderId) {
            Log::error('[Midtrans] IPN: order_id missing');
            return response()->json(['status' => 'error', 'message' => 'order_id missing'], 400);
        }

        // === LANGKAH 1: Verifikasi signature ===
        if (!$this->verifySignature($payload)) {
            Log::error('[Midtrans] IPN: SIGNATURE VERIFICATION FAILED', [
                'transaction_id' => $orderId,
                'payload_order_id' => $payload['order_id'] ?? null,
                'payload_status_code' => $payload['status_code'] ?? null,
                'payload_gross_amount' => $payload['gross_amount'] ?? null,
                'payload_signature' => $payload['signature_key'] ?? null,
            ]);
            return response()->json(['status' => 'error', 'message' => 'signature mismatch'], 403);
        }
        Log::info('[Midtrans] IPN: Signature verified OK', ['order_id' => $orderId]);

        // === LANGKAH 2: Cari payment & order ===
        $payment = Payment::where('transaction_id', $orderId)->first();
        if (!$payment) {
            Log::error('[Midtrans] IPN: Payment not found', ['transaction_id' => $orderId]);
            return response()->json(['status' => 'error', 'message' => 'payment not found'], 404);
        }

        $order = Order::find($payment->order_id);
        if (!$order) {
            Log::error('[Midtrans] IPN: Order not found', ['order_id' => $payment->order_id]);
            return response()->json(['status' => 'error', 'message' => 'order not found'], 404);
        }

        Log::info('[Midtrans] IPN: Order found', [
            'order_id' => $order->id,
            'current_payment_status' => $order->payment_status,
            'current_order_status' => $order->status,
        ]);

        // === LANGKAH 3: Proses status ===
        $this->updatePaymentStatus($order, $payment, $transactionStatus, $fraudStatus);

        Log::info('[Midtrans] IPN: Update complete', [
            'order_id' => $order->id,
            'payment_status' => $order->fresh()->payment_status,
            'order_status' => $order->fresh()->status,
            'payment_status_db' => $payment->fresh()->status,
        ]);

        return response()->json(['status' => 'ok']);
    }

    /**
     * Core: Update payment & order status berdasarkan Midtrans transaction_status
     */
    private function updatePaymentStatus(Order $order, $payment, string $transactionStatus, string $fraudStatus): void
    {
        $transactionStatus = strtolower(trim($transactionStatus));
        $fraudStatus = strtolower(trim($fraudStatus));

        Log::info('[Midtrans] updatePaymentStatus', [
            'order_id' => $order->id,
            'transaction_status' => $transactionStatus,
            'fraud_status' => $fraudStatus,
            'current_payment_status' => $order->payment_status,
        ]);

        // Handle fraud_status untuk capture/settlement
        if (in_array($transactionStatus, ['capture', 'settlement'])) {
            if ($fraudStatus === 'accept') {
                $this->markAsPaid($order, $payment);
            } elseif ($fraudStatus === 'challenge') {
                $order->update(['payment_status' => 'pending']);
                $payment->update(['status' => 'pending']);
                Log::info('[Midtrans] Payment challenged, set to pending', ['order_id' => $order->id]);
            } else {
                // fraud_status = deny
                $order->update(['payment_status' => 'failed']);
                $payment->update(['status' => 'failed']);
                Log::info('[Midtrans] Payment denied by fraud check', ['order_id' => $order->id]);
            }
            return;
        }

        // Handle other statuses
        $newPaymentStatus = self::STATUS_MAP[$transactionStatus] ?? null;

        if (!$newPaymentStatus) {
            Log::warning('[Midtrans] Unknown transaction_status', [
                'transaction_status' => $transactionStatus,
                'order_id' => $order->id,
            ]);
            return;
        }

        if ($newPaymentStatus === 'paid') {
            $this->markAsPaid($order, $payment);
        } elseif ($newPaymentStatus === 'failed') {
            $order->update(['payment_status' => 'failed']);
            $payment->update(['status' => 'failed']);
            Log::info('[Midtrans] Payment failed', ['order_id' => $order->id, 'status' => $transactionStatus]);
        } elseif ($newPaymentStatus === 'pending') {
            $order->update(['payment_status' => 'pending']);
            $payment->update(['status' => 'pending']);
            Log::info('[Midtrans] Payment pending', ['order_id' => $order->id]);
        } else {
            $order->update(['payment_status' => $newPaymentStatus]);
            $payment->update(['status' => $newPaymentStatus]);
            Log::info('[Midtrans] Payment status updated', [
                'order_id' => $order->id,
                'new_status' => $newPaymentStatus,
            ]);
        }
    }

    /**
     * Tandai order & payment sebagai LUNAS
     */
    private function markAsPaid(Order $order, $payment): void
    {
        if ($order->payment_status === 'paid') {
            Log::info('[Midtrans] Order already paid, skipping', ['order_id' => $order->id]);
            return;
        }

        $order->update([
            'payment_status' => 'paid',
            'payment_method' => 'midtrans',
            'status' => 'preparing',
        ]);
        $payment->update(['status' => 'success']);

        Log::info('[Midtrans] Order marked as PAID', [
            'order_id' => $order->id,
            'total' => $order->total,
        ]);

        // Kirim email invoice
        if ($order->client_email) {
            try {
                Mail::to($order->client_email)->send(new GenericMail(
                    subject: 'Order Invoice - #' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                    view: 'emails.orders.order_invoice',
                    data: ['order' => $order->load(['items.product', 'coupon', 'payment'])],
                ));

                $adminEmail = env('ADMIN_EMAIL');
                if ($adminEmail) {
                    Mail::to($adminEmail)->send(new GenericMail(
                        subject: 'New Order Alert - #' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                        view: 'emails.orders.admin_invoice',
                        data: ['order' => $order->load(['items.product', 'coupon', 'payment'])],
                    ));
                }
            } catch (\Exception $e) {
                Log::error('[Midtrans] Email failed: ' . $e->getMessage());
            }
        }
    }

    /**
     * Verifikasi signature Midtrans
     * Midtrans signature = SHA512(order_id + status_code + gross_amount + server_key)
     */
    private function verifySignature(array $payload): bool
    {
        $orderId = $payload['order_id'] ?? '';
        $statusCode = $payload['status_code'] ?? '';
        $grossAmount = $payload['gross_amount'] ?? '';
        $serverKey = env('MIDTRANS_SERVER_KEY');
        $signature = $payload['signature_key'] ?? '';

        Log::info('[Midtrans] verifySignature inputs', [
            'order_id' => $orderId,
            'status_code_raw' => $statusCode,
            'status_code_type' => gettype($statusCode),
            'gross_amount_raw' => $grossAmount,
            'gross_amount_type' => gettype($grossAmount),
            'server_key_prefix' => substr($serverKey ?? '', 0, 10) . '...',
            'signature_provided' => $signature ? substr($signature, 0, 10) . '...' : '(empty)',
        ]);

        if (!$serverKey) {
            Log::error('[Midtrans] SERVER_KEY is empty! Check .env');
            return false;
        }

        if (!$signature) {
            Log::error('[Midtrans] signature_key is empty in payload');
            return false;
        }

        // Normalize status_code to string (might come as integer from JSON)
        $statusCode = (string) $statusCode;

        // Normalize gross_amount — Midtrans computes signature with the EXACT string
        // from the notification (e.g. "10000.00" with 2 decimals)
        // It might come as int (10000), float (10000.0), or string ("10000.00")
        // Try the raw value first, then formatted variants
        $variants = $this->normalizeGrossAmount($grossAmount);

        foreach ($variants as $variant) {
            $expected = hash('sha512', $orderId . $statusCode . $variant . $serverKey);
            Log::info('[Midtrans] verifySignature attempt', [
                'variant' => $variant,
                'hash_input' => $orderId . '|' . $statusCode . '|' . $variant . '|' . substr($serverKey, 0, 5) . '...',
                'hash_result' => substr($expected, 0, 16) . '...',
                'expected_full' => $expected,
                'provided_full' => $signature,
            ]);

            if (hash_equals($expected, $signature)) {
                Log::info('[Midtrans] verifySignature: MATCH', ['used_variant' => $variant]);
                return true;
            }
        }

        Log::error('[Midtrans] verifySignature: ALL VARIANTS FAILED', [
            'order_id' => $orderId,
            'status_code' => $statusCode,
            'gross_amount_raw' => $grossAmount,
            'gross_amount_type' => gettype($grossAmount),
            'variants_tried' => $variants,
        ]);
        return false;
    }

    /**
     * Hasilkan varian gross_amount untuk signature verification
     * Midtrans bisa kirim format berbeda tergantung sumber callback
     */
    private function normalizeGrossAmount(mixed $grossAmount): array
    {
        $variants = [];

        // Raw value as string
        $raw = (string) $grossAmount;
        $variants[] = $raw;

        // If it's a clean integer like "10000", also try with .00
        if (ctype_digit($raw)) {
            $variants[] = $raw . '.00';
        }

        // If it has .00, also try without
        if (str_ends_with($raw, '.00')) {
            $variants[] = substr($raw, 0, -3);
        }

        // If it has decimal like "10000.50", also try without trailing zero
        if (preg_match('/^\d+\.(\d)0$/', $raw, $m)) {
            $variants[] = number_format((float) $raw, 1, '.', '');
        }

        // If it's a number with commas or other formatting, try number_format
        if (is_numeric($raw)) {
            $variants[] = number_format((float) $raw, 0, '.', '');
            $variants[] = number_format((float) $raw, 2, '.', '');
        }

        // Remove duplicates
        return array_unique($variants);
    }

    /**
     * Extract payload dari request — support GET (query params) dan POST (body)
     */
    private function extractPayload(Request $request): array
    {
        if ($request->isMethod('GET')) {
            return $request->query->all();
        }
        return $request->all();
    }

    /**
     * Respond sesuai konteks: JSON untuk AJAX, redirect untuk browser
     */
    private function respond(Request $request, ?Order $order, string $message, bool $isSuccess)
    {
        if ($request->ajax() || $request->wantsJson() || $request->isMethod('POST')) {
            return response()->json([
                'status' => $isSuccess ? 'success' : 'error',
                'message' => $message,
                'order_id' => $order?->id,
            ], $isSuccess ? 200 : 422);
        }

        // Browser redirect (GET from Midtrans return_url)
        if ($isSuccess && $order) {
            return redirect()->route('checkout.success', $order->id)
                ->with('success', 'Payment successful! Your order is being prepared.');
        }

        if ($order) {
            return redirect()->route('checkout.cancel', ['order' => $order->id])
                ->with('error', $message);
        }

        return redirect()->route('checkout.cancel')
            ->with('error', $message);
    }
}
