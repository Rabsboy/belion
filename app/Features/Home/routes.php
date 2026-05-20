<?php

use Illuminate\Support\Facades\Route;
use App\Features\Home\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');
