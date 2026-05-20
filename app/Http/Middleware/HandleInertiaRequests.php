<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'delivery_fee' => (float) (\App\Features\Admin\Models\Setting::where('key', 'delivery_fee')->value('value') ?? 50),
            'store_lat' => (float) config('services.osm.store_lat', -6.2800),
            'store_lng' => (float) config('services.osm.store_lng', 106.8700),
            'osm_tile_url' => config('services.osm.tile_url', 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
            'translations' => [
                'auth' => __('auth'),
                'messages' => __('messages'),
                'admin' => __('admin'),
                'staff' => __('staff'),
            ],
        ];
    }
}
