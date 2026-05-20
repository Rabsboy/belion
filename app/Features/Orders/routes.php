<?php

use App\Features\Orders\Controllers\CheckoutController;
use App\Features\Orders\Controllers\CouponValidationController;
use App\Features\Orders\Controllers\SslCommerzPaymentController;
use App\Features\Orders\Controllers\MidtransPaymentController;
use Illuminate\Support\Facades\Route;


// SSLCommerz Callbacks (legacy) — public (called by payment gateway)
Route::post('/payment/success', [SslCommerzPaymentController::class, 'success'])->name('payment.success');
Route::post('/payment/fail', [SslCommerzPaymentController::class, 'fail'])->name('payment.fail');
Route::post('/payment/cancel', [SslCommerzPaymentController::class, 'cancel'])->name('payment.cancel');
Route::post('/payment/ipn', [SslCommerzPaymentController::class, 'ipn'])->name('payment.ipn');

// Midtrans Callbacks — public (called by payment gateway OR frontend AJAX)
// Support GET (Midtrans redirect) dan POST (Snap onSuccess AJAX / IPN)
Route::match(['GET', 'POST'], '/payment/midtrans/success', [MidtransPaymentController::class, 'success'])->name('payment.midtrans.success');
Route::match(['GET', 'POST'], '/payment/midtrans/fail', [MidtransPaymentController::class, 'fail'])->name('payment.midtrans.fail');
Route::match(['GET', 'POST'], '/payment/midtrans/cancel', [MidtransPaymentController::class, 'cancel'])->name('payment.midtrans.cancel');
Route::post('/payment/midtrans/ipn', [MidtransPaymentController::class, 'ipn'])->name('payment.midtrans.ipn');

// Route helper for Snap token page — public (Midtrans redirects here)
Route::get('/payment/midtrans/snap/{token}', function (string $token) {
    return response()->view('midtrans-snap', ['token' => $token]);
})->name('payment.midtrans.snap');

// Customer checkout — hanya customer yang sudah login
Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::post('/checkout/search-address', [CheckoutController::class, 'searchAddress'])->name('checkout.search-address');
    Route::post('/checkout/calculate-delivery-fee-from-coordinates', [CheckoutController::class, 'calculateFeeFromCoordinates'])->name('checkout.calculate-fee-coordinates');
    Route::post('/checkout/validate-coupon', [CouponValidationController::class, 'validateCoupon'])->name('checkout.validate-coupon');
    Route::get('/checkout/success/{order}', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/cancel/{order?}', [CheckoutController::class, 'cancel'])->name('checkout.cancel');
    Route::get('/checkout/status/{order}', [CheckoutController::class, 'status'])->name('checkout.status');
    Route::post('/order/repay/{order}', [CheckoutController::class, 'repay'])->name('order.repay');
});


