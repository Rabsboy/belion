<?php

namespace Database\Seeders;

use App\Features\Menu\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Rice & Biriyani',
                'description' => 'Signature rice dishes and biriyani.',
            ],
            [
                'name' => 'Chicken Specials',
                'description' => 'Hot and spicy chicken favorites.',
            ],
            [
                'name' => 'Drinks',
                'description' => 'Refreshing drinks for your meal.',
            ],
            [
                'name' => 'Roti Manis',
                'description' => 'Sweet bread with various toppings and fillings.',
            ],
            [
                'name' => 'Roti Tawar',
                'description' => 'Classic white bread, soft and fluffy.',
            ],
            [
                'name' => 'Roti Isi',
                'description' => 'Filled bread with savory or sweet fillings.',
            ],
            [
                'name' => 'Roti Panggang',
                'description' => 'Toasted bread with crispy exterior.',
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['name' => $cat['name']],
                [
                    'description' => $cat['description'],
                    'slug' => Str::slug($cat['name']),
                    'is_active' => true,
                ]
            );
        }
    }
}
