<?php

use App\Features\Menu\Controllers\MenuController;
use Illuminate\Support\Facades\Route;

Route::get('/menu', [MenuController::class, 'index'])->name('menu');
