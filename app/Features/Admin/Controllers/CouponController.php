<?php

namespace App\Features\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::latest()->paginate(10);
        return Inertia::render('Admin/Coupons', [
            'coupons' => $coupons
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'type' => 'required|in:fixed,percentage',
            'value' => [
                'required',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->type === 'percentage' && $value > 100) {
                        $fail('Percentage discount cannot exceed 100%.');
                    }
                },
            ],
            'min_order' => 'required|numeric|min:0',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'usage_limit' => 'nullable|integer|min:1',
            'per_user_limit' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        Coupon::create($validated);

        return back()->with('success', 'Coupon created successfully!');
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:fixed,percentage',
            'value' => [
                'required',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->type === 'percentage' && $value > 100) {
                        $fail('Percentage discount cannot exceed 100%.');
                    }
                },
            ],
            'min_order' => 'required|numeric|min:0',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'usage_limit' => 'nullable|integer',
            'per_user_limit' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $coupon->update($validated);

        return back()->with('success', 'Coupon updated successfully!');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return back()->with('success', 'Coupon deleted successfully!');
    }
}
