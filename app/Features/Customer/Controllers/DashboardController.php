<?php

namespace App\Features\Customer\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['items.product'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'orders' => $orders,
        ]);
    }
}
