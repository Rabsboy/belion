<?php

namespace App\Features\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Concurrency;
use App\Mail\GenericMail;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $tabGroups = [
            'semua' => ['pending', 'preparing', 'out_for_delivery', 'delivered', 'completed', 'cancelled'],
            'baru' => ['pending'],
            'diantar' => ['preparing', 'out_for_delivery'],
            'selesai' => ['delivered', 'completed'],
            'dibatalkan' => ['cancelled'],
        ];

        $activeTab = $request->query('tab', 'semua');
        if (!array_key_exists($activeTab, $tabGroups)) {
            $activeTab = 'semua';
        }

        $orders = Order::with(['user', 'items.product', 'payment', 'coupon'])
            ->whereIn('status', $tabGroups[$activeTab])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
            'activeTab' => $activeTab,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        try {
            $allowed = \App\Features\Orders\Models\Order::allowedStatusesForUpdate($order->fulfillment_type);
            $validated = $request->validate([
                'status' => 'required|in:' . implode(',', $allowed),
                'payment_status' => 'nullable|in:pending,paid,failed',
                'delivery_tracking_url' => 'nullable|url',
            ]);

            $statusChanged = $order->status !== $validated['status'];

            $order->update($validated);

            \Log::info("Order #{$order->id} status update - Changed: " . ($statusChanged ? 'YES' : 'NO') . ", Email: {$order->client_email}, Old: {$order->getOriginal('status')}, New: {$validated['status']}");

            if ($statusChanged && $order->client_email) {
                \Log::info("Attempting to send status update email for Order #{$order->id} via defer()");
                try {
                    $status = $validated['status'];
                    $orderId = $order->id;
                    
                    defer(static function () use ($orderId, $status) {
                        $order = Order::with(['user', 'items.product', 'payment', 'coupon'])->find($orderId);
                        if (!$order) return;

                        \Log::info("Deferred email task STARTED for Order #{$order->id} (Status: {$status})");
                        try {
                            // Determine Customer Template
                            $customerView = "emails.orders.status_{$status}";
                            if (!view()->exists($customerView)) {
                                $customerView = 'emails.orders.order_status_updated';
                            }

                            // To Customer
                            Mail::to($order->client_email)->send(new GenericMail(
                                subject: 'Order Status Updated - ' . strtoupper(str_replace('_', ' ', $status)) . ' - #' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                                view: $customerView,
                                data: ['order' => $order]
                            ));

                            \Log::info("Customer status email SENT for Order #{$order->id}");
                        } catch (\Exception $e) {
                            \Log::error("Mail sending failed in defer() for Order #{$order->id}: " . $e->getMessage());
                        }
                    });
                    \Log::info("Email tasks DEFERRED for Order #{$order->id}");
                } catch (\Exception $e) {
                    \Log::error('Order Status Update Mail deferring failed: ' . $e->getMessage());
                }
            } else {
                \Log::info("Email NOT sent - StatusChanged: " . ($statusChanged ? 'YES' : 'NO') . ", Email exists: " . ($order->client_email ? 'YES' : 'NO'));
            }

            return back()->with('success', 'Order updated successfully!');
        } catch (\Exception $e) {
            \Log::error('Order update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update order. Please try again.']);
        }
    }
}
