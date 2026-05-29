<?php

use App\Features\Admin\Controllers\DashboardController;
use App\Features\Admin\Controllers\ProductController;
use App\Features\Admin\Controllers\OrderController;
use App\Features\Admin\Controllers\CustomerController;
use App\Features\Admin\Controllers\CategoryController;
use App\Features\Admin\Controllers\CouponController;
use App\Features\Admin\Controllers\ProfileController;
use App\Features\Admin\Controllers\ReportController;
use App\Features\Admin\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

Route::get('/test-defer', function () {
    defer(function () {
        \Log::info('Test defer callback STARTED at ' . now());
        sleep(5);
        \Log::info('Test defer callback FINISHED at ' . now());
        file_put_contents(storage_path('logs/defer_test.txt'), 'Defer worked at ' . now());
    });
    \Log::info('Test defer route CALLED at ' . now());
    return 'Defer test queued. Check logs and storage/logs/defer_test.txt';
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    
    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::post('/products/{product}/toggle-active', [ProductController::class, 'toggleActive'])->name('products.toggle-active');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    
    // Settings Routes
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    
    // Banners Routes
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Coupons
    Route::get('/coupons', [CouponController::class, 'index'])->name('coupons.index');
    Route::post('/coupons', [CouponController::class, 'store'])->name('coupons.store');
    Route::put('/coupons/{coupon}', [CouponController::class, 'update'])->name('coupons.update');
    Route::delete('/coupons/{coupon}', [CouponController::class, 'destroy'])->name('coupons.destroy');



    // Contact Requests
    Route::get('/contact-requests', [\App\Features\Admin\Controllers\ContactController::class, 'index'])->name('contact-requests.index');
    Route::put('/contact-requests/{contactMessage}', [\App\Features\Admin\Controllers\ContactController::class, 'update'])->name('contact-requests.update');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::get('/orders/{order}/receipt', [\App\Features\Staff\Controllers\PosController::class, 'receipt'])->name('orders.receipt');
    
    // Customers
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::put('/customers/{user}/toggle-ban', [CustomerController::class, 'toggleBan'])->name('customers.toggleBan');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
});
