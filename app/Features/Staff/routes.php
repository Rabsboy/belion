<?php

use App\Features\Staff\Controllers\DashboardController;
use App\Features\Staff\Controllers\OrderController;
use App\Features\Staff\Controllers\PosController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:staff'])->prefix('staff')->name('staff.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');

    Route::get('/pos', [PosController::class, 'create'])->name('pos.create');
    Route::post('/pos', [PosController::class, 'store'])->name('pos.store');
    Route::get('/pos/{order}/receipt', [PosController::class, 'receipt'])->name('pos.receipt');
});
