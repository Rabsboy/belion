<?php

namespace App\Features\Orders\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Coupon;
use App\Features\Orders\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class CouponValidationController extends Controller
{
    public function validateCoupon(Request $request)
    {
        try {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric',
            'phone' => 'nullable|string'
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid coupon code.'
            ], 422);
        }

        $user = auth()->user();

        // If guest, try to find user by phone
        if (!$user && $request->phone) {
             $user = User::where('phone', $request->phone)->first();
        }

        if (!$coupon->isValidFor($request->subtotal, $user)) {
             $message = 'This coupon is not valid for your order.';
            
            if ($request->subtotal < $coupon->min_order) {
                $message = "Minimum order amount for this coupon is " . formatRupiah($coupon->min_order) . ".";
            } elseif (!$coupon->is_active) {
                $message = 'This coupon is no longer active.';
            } elseif ($coupon->end_at && $coupon->end_at->isPast()) {
                $message = 'This coupon has expired.';
            } elseif ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
                $message = 'This coupon has reached its usage limit.';
            } elseif ($coupon->per_user_limit !== null && $user) {
                $message = 'You have already reached the usage limit for this coupon.';
            }

            return response()->json([
                'valid' => false,
                'message' => $message
            ], 422);
        }

        $discount = $coupon->calculateDiscount($request->subtotal);

        return response()->json([
            'valid' => true,
            'coupon' => $coupon,
            'discount' => round($discount, 2),
            'message' => 'Coupon applied successfully!'
        ]);
        } catch (\Exception $e) {
            \Log::error('Coupon validation failed: ' . $e->getMessage());
            return response()->json([
                'valid' => false,
                'message' => 'Something went wrong while validating the coupon.'
            ], 500);
        }
    }
}
