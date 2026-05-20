<?php

namespace App\Features\Staff\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        $orders = Order::with(['user', 'items', 'payment'])
            ->whereIn('status', $tabGroups[$activeTab])
            ->latest()
            ->paginate(10);

        return Inertia::render('Staff/Orders', [
            'orders' => $orders,
            'activeTab' => $activeTab,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items', 'payment']);

        return Inertia::render('Staff/OrderDetail', [
            'order' => $order,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $allowed = Order::allowedStatusesForUpdate($order->fulfillment_type);
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', $allowed),
            'cancel_reason' => 'required_if:status,cancelled|nullable|string|max:500',
        ]);

        if ($validated['status'] === 'cancelled') {
            $order->update([
                'status' => 'cancelled',
                'cancel_reason' => $validated['cancel_reason'],
                'cancelled_by' => 'staff',
            ]);
        } else {
            $order->update([
                'status' => $validated['status'],
            ]);
        }

        return back()->with('success', 'Order status updated successfully.');
    }
}
