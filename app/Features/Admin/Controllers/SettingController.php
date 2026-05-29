<?php

namespace App\Features\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Admin\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings', [
            'settings' => Setting::all()
        ]);
    }

    public function update(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Settings Update Request:', $request->all());

        if ($request->has('store_open')) {
            Setting::updateOrCreate(
                ['key' => 'store_open'],
                ['value' => $request->boolean('store_open') ? '1' : '0']
            );
        }

        if ($request->has('delivery_fee')) {
            $validated = $request->validate([
                'delivery_fee' => 'required|numeric|min:0',
            ]);

            Setting::updateOrCreate(
                ['key' => 'delivery_fee'],
                ['value' => $validated['delivery_fee']]
            );
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
