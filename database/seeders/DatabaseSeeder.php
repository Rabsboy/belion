<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed base data (test drive ordering)
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            CouponSeeder::class,
            SettingSeeder::class,
        ]);

        // Admin (idempotent)
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'phone' => '01701234567',
                'role' => 'admin',
                'password' => bcrypt('password'),
                'is_banned' => false,
            ]
        );

        // Customer (idempotent)
        User::updateOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Customer',
                'phone' => '01801234567',
                'role' => 'customer',
                'password' => bcrypt('password'),
                'is_banned' => false,
            ]
        );
    }
}
