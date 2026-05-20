<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Load web routes
        foreach (glob(app_path('Features/*/routes.php')) as $routeFile) {
            Route::middleware('web')->group($routeFile);
        }

        // Load API routes
        foreach (glob(app_path('Features/*/api.php')) as $routeFile) {
            Route::prefix('api')->middleware('api')->group($routeFile);
        }

        Route::fallback(function () {
            return redirect('/');
        });
    }
}
