<?php

namespace App\Features\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Order;
use App\Features\Menu\Models\Product;
use App\Features\Menu\Models\Category;
use App\Models\User;
use App\Features\Orders\Models\Payment;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'total_products' => Product::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'recent_orders' => Order::with('user')->latest()->take(10)->get(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
