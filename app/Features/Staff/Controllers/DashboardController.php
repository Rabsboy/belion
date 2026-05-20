<?php

namespace App\Features\Staff\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Order;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->startOfDay();

        $todayPosOrders = Order::where('order_source', 'pos')
            ->where('created_at', '>=', $today)
            ->count();

        $todayRevenue = Order::where('order_source', 'pos')
            ->where('created_at', '>=', $today)
            ->where('payment_status', 'paid')
            ->sum('total');

        $totalOrders = Order::where('order_source', 'pos')->count();

        $recentOrders = Order::where('order_source', 'pos')
            ->with(['items'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($o) => [
                'id' => $o->id,
                'client_name' => $o->client_name,
                'client_phone' => $o->client_phone,
                'total' => (float) $o->total,
                'status' => $o->status,
                'payment_status' => $o->payment_status,
                'item_count' => $o->items->sum('quantity'),
                'created_at' => $o->created_at,
            ]);

        $revenueByDay = Order::where('order_source', 'pos')
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(7))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as revenue'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date')
            ->map(fn ($r) => (float) $r->revenue);

        $chartLabels = collect(range(6, 0))->map(fn ($d) => now()->subDays($d)->format('Y-m-d'));
        $chartData = $chartLabels->map(fn ($date) => $revenueByDay[$date] ?? 0);

        return Inertia::render('Staff/Dashboard', [
            'stats' => [
                'todayPosOrders' => $todayPosOrders,
                'todayRevenue' => $todayRevenue,
                'totalPosOrders' => $totalOrders,
            ],
            'recentOrders' => $recentOrders,
            'chartLabels' => $chartLabels,
            'chartData' => $chartData,
        ]);
    }
}
