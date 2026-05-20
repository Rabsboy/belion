<?php

namespace Database\Seeders;

use App\Features\Orders\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $coupons = [
            [
                'code' => 'SAVE10',
                'type' => 'percentage',
                'value' => 10,
                'min_order' => 300,
                'start_at' => $now->copy()->subDay(),
                'end_at' => $now->copy()->addYear(),
                'usage_limit' => null,
                'used_count' => 0,
                'per_user_limit' => 5,
                'is_active' => true,
            ],
            [
                'code' => 'TAKE50',
                'type' => 'fixed',
                'value' => 50,
                'min_order' => 500,
                'start_at' => $now->copy()->subDay(),
                'end_at' => $now->copy()->addYear(),
                'usage_limit' => null,
                'used_count' => 0,
                'per_user_limit' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($coupons as $c) {
            Coupon::updateOrCreate(
                ['code' => $c['code']],
                [
                    'type' => $c['type'],
                    'value' => $c['value'],
                    'min_order' => $c['min_order'],
                    'start_at' => $c['start_at'],
                    'end_at' => $c['end_at'],
                    'usage_limit' => $c['usage_limit'],
                    'used_count' => 0,
                    'per_user_limit' => $c['per_user_limit'],
                    'is_active' => $c['is_active'],
                ]
            );
        }
    }
}

