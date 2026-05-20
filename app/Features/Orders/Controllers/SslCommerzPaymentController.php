<?php

namespace App\Features\Orders\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Order;
use App\Features\Orders\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\GenericMail;
use Inertia\Inertia;

class SslCommerzPaymentController extends Controller
{
    public function success(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $amount = $request->input('amount');
        $currency = $request->input('currency');

        \Log::info("SSL Success Callback: Transaction ID: $tran_id");

        // Verify the transaction
        if ($this->verifyPayment($tran_id, $amount, $currency)) {
            $payment = Payment::where('transaction_id', $tran_id)->first();
            $order = Order::findOrFail($payment->order_id);
            
            if ($order) {
                if ($order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'status' => 'preparing',
                    ]);

                    $payment->update([
                        'status' => 'success',
                    ]);

                    // Send Invoice Email
                    if ($order->client_email) {
                        try {
                            $orderId = $order->id;
                            defer(static function () use ($orderId) {
                                $order = Order::find($orderId);
                                if ($order) {
                                    try {
                                        \Log::info("Sending SSL invoice email to: " . $order->client_email);
                                        Mail::to($order->client_email)
                                            ->send(new GenericMail(
                                            subject: 'Order Invoice - #' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                                            view: 'emails.orders.order_invoice',
                                            data: ['order' => $order->load(['items.product', 'coupon', 'payment'])]
                                        ));

                                        // Send Notification to Admin
                                        $adminEmail = env('ADMIN_EMAIL');
                                        if ($adminEmail) {
                                            \Log::info("Sending SSL admin notification to: " . $adminEmail);
                                            Mail::to($adminEmail)
                                                ->send(new GenericMail(
                                                    subject: 'New Order Alert - #' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                                                    view: 'emails.orders.admin_invoice',
                                                    data: ['order' => $order->load(['items.product', 'coupon', 'payment'])]
                                                ));
                                        }
                                    } catch (\Exception $e) {
                                        \Log::error("SSL Invoice email failed: " . $e->getMessage());
                                    }
                                }
                            });
                        } catch (\Exception $e) {
                            \Log::error('Mail failed in SSL success: ' . $e->getMessage());
                        }
                    }
                }

                return redirect()->route('checkout.success', $order->id)->with('success', 'Payment successful! Your order is being prepared.');
            }
        }

        \Log::error("SSL Verification Failed or Order Not Found for Tran ID: $tran_id");
        return redirect()->route('checkout.cancel', $order?->id ?? null)->with('error', 'Payment verification failed.');
    }

    public function fail(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $payment = Payment::where('transaction_id', $tran_id)->first();
        $order = Order::findOrFail($payment->order_id);

        if ($order) {
            $order->update(['payment_status' => 'failed']);
            $payment->update(['status' => 'failed']);
            
            // Send Payment Failed Email
            if ($order->client_email) {
                try {
                    $orderId = $order->id;
                    defer(static function () use ($orderId) {
                        $order = Order::find($orderId);
                        if ($order) {
                            try {
                                Mail::to($order->client_email)->send(new GenericMail(
                                    subject: 'Payment Failed - Order #' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                                    view: 'emails.orders.payment_failed',
                                    data: ['order' => $order]
                                ));
                            } catch (\Exception $e) {
                                \Log::error("Payment Failed email failed: " . $e->getMessage());
                            }
                        }
                    });
                } catch (\Exception $e) {
                    \Log::error('Mail failed in payment failure: ' . $e->getMessage());
                }
            }
            
            return redirect()->route('checkout.cancel', $order?->id ?? null)->with('error', 'Payment failed. Please try again.');
        }

        return redirect()->route('home')->with('error', 'Payment failed. Order not found.');
    }

    public function cancel(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $payment = Payment::where('transaction_id', $tran_id)->first();
        $order = Order::findOrFail($payment->order_id);

        if ($order) {
            $order->update(['payment_status' => 'cancelled']);
            $payment->update(['status' => 'cancelled']);
            return redirect()->route('checkout.cancel', $order?->id ?? null)->with('info', 'Payment cancelled.');
        }

        return redirect()->route('home')->with('info', 'Payment cancelled. Order not found.');
    }

    public function ipn(Request $request)
    {
        // IPN logic for async verification
        $tran_id = $request->input('tran_id');
        $amount = $request->input('amount');
        $currency = $request->input('currency');

        if ($this->verifyPayment($tran_id, $amount, $currency)) {
            $payment = Payment::where('transaction_id', $tran_id)->first();
            $order = $payment ? $payment->order : null;

            if ($order && $order->payment_status !== 'paid') {
                $order->update(['payment_status' => 'paid', 'status' => 'preparing']);
                $payment->update([
                    'status' => 'success',
                    'val_id' => $request->input('val_id')
                ]);
            }
        }
        return response()->json(['status' => 'success']);
    }

    private function verifyPayment($tran_id, $amount, $currency)
    {
        $is_sandbox = env('SSL_IS_SANDBOX', true);
        $url = $is_sandbox 
            ? "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php" 
            : "https://securepay.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";
            
        $store_id = urlencode(env('SSL_STORE_ID'));
        $store_passwd = urlencode(env('SSL_STORE_PASS'));
        $encoded_tran_id = urlencode($tran_id);
        
        $requested_url = "$url?tran_id=$encoded_tran_id&store_id=$store_id&store_passwd=$store_passwd&format=json";

        file_put_contents(public_path('ssl_debug.log'), "Verifying: $requested_url\n", FILE_APPEND);

        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $requested_url);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false); // For local dev
        curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
        
        $response = curl_exec($handle);
        $error = curl_error($handle);
        curl_close($handle);

        file_put_contents(public_path('ssl_debug.log'), "Response: $response | Error: $error\n", FILE_APPEND);

        if ($error || !$response) {
            return false;
        }

        $data = json_decode($response, true);
        
        // Check for direct status or status within element array (common in merchantTransIDvalidationAPI)
        if (isset($data['status']) && ($data['status'] === 'VALID' || $data['status'] === 'AUTHENTICATED')) {
            return true;
        }

        if (isset($data['element'][0]['status']) && ($data['element'][0]['status'] === 'VALID' || $data['element'][0]['status'] === 'AUTHENTICATED')) {
            return true;
        }

        return false;
    }
}
