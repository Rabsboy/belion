<?php

namespace App\Features\Auth\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function create()
    {
        $intended = session('url.intended');
        $fromCheckout = $intended && str_contains($intended, 'checkout');

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'fromCheckout' => $fromCheckout,
        ]);
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        $user = Auth::user();

        if ($user->is_banned) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'email' => 'Your account has been suspended. Please contact support.',
            ]);
        }

        $request->session()->regenerate();

        $user = $request->user();
        
        return match ($user->role) {
            'admin' => redirect()->intended(route('admin.dashboard')),
            'staff' => redirect()->intended(route('staff.dashboard')),
            'customer' => redirect()->intended(route('customer.dashboard')),
            default => redirect()->intended(route('home')),
        };
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
