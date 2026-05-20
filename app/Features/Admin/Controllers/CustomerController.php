<?php

namespace App\Features\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('role', 'customer')
            ->withCount('orders')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Customers', [
            'customers' => $customers,
        ]);
    }

    public function toggleBan(User $user)
    {
        $user->update([
            'is_banned' => !$user->is_banned
        ]);

        return back()->with('success', $user->is_banned ? 'User banned successfully!' : 'User unbanned successfully!');
    }
}
