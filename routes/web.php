<?php

use Illuminate\Support\Facades\Route;

// Semua role termasuk customer (cukup login)
Route::middleware('auth')->group(function () {
    Route::get('/profile', function () {
        return inertia('Profile/Index');
    })->name('profile');
});

// Multi parameter: boleh salah satu
Route::middleware(['auth', 'role:admin,staff'])->get('/management', function () {
    return inertia('Management/Index');
})->name('management');

// TEST: Midtrans callback debug — tanpa auth, tanpa CSRF
Route::post('/_midtrans-test', function (\Illuminate\Http\Request $request) {
    \Illuminate\Support\Facades\Log::info('=== MIDTRANS TEST CALLBACK ===', [
        'all' => $request->all(),
        'headers' => $request->headers->all(),
        'method' => $request->method(),
        'ip' => $request->ip(),
    ]);
    return response()->json(['ok' => true, 'received' => $request->all()]);
});
