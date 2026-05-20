<?php

namespace App\Features\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

use App\Mail\GenericMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetLinkController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Check if user exists first
        $user = User::where('email', $email)->first();

        if (!$user) {
            return back()->withInput($request->only('email'))
                ->withErrors(['email' => __('passwords.user')]);
        }

        // Generate Token
        $token = Password::createToken($user);
        $url = url(route('password.reset', [
            'token' => $token,
            'email' => $email,
        ], false));

        // Use defer to send email background
        defer(function () use ($user, $url) {
            Mail::to($user->email)->send(new GenericMail(
                subject: 'Reset Your Password',
                view: 'emails.auth.reset_password',
                data: ['user' => $user, 'url' => $url]
            ));
        });

        return back()->with('status', 'We have emailed your password reset link.');
    }
}
