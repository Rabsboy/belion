<?php

namespace Database\Seeders;

use App\Features\Admin\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::updateOrCreate(
            ['key' => 'delivery_fee'],
            ['value' => 50]
        );

        Setting::updateOrCreate(
            ['key' => 'store_name'],
            ['value' => 'Bellion Bake & Brew']
        );

        Setting::updateOrCreate(
            ['key' => 'contact_number'],
            ['value' => '01701234567']
        );
    }
}

