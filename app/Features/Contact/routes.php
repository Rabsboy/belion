<?php

use App\Features\Contact\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
