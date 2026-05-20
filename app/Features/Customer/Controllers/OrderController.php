<?php

namespace App\Features\Customer\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $orders = Order::where('user_id', Auth::id())
            ->whereIn('status', $tabGroups[$activeTab])
            ->with(['items', 'payment'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/MyOrders', [
            'orders' => $orders,
            'activeTab' => $activeTab,
        ]);
    }

    public function show(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Akses ditolak');
        }

        $order->load(['items', 'payment']);

        return Inertia::render('Customer/OrderDetail', [
            'order' => $order,
        ]);
    }
}
