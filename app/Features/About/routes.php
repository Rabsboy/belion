<?php

use App\Features\About\Controllers\AboutController;
use Illuminate\Support\Facades\Route;


Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/privacy-policy', [AboutController::class, 'privacy'])->name('privacy');
Route::get('/cookie-policy', [AboutController::class, 'cookie'])->name('cookie');
Route::get('/terms-and-conditions', [AboutController::class, 'terms'])->name('terms');
