<?php

namespace Database\Seeders;

use App\Features\Menu\Models\Category;
use App\Features\Menu\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $riceCat = Category::where('name', 'Rice & Biriyani')->first();
        $chickenCat = Category::where('name', 'Chicken Specials')->first();
        $drinkCat = Category::where('name', 'Drinks')->first();
        $rotiManis = Category::where('name', 'Roti Manis')->first();
        $rotiTawar = Category::where('name', 'Roti Tawar')->first();
        $rotiIsi = Category::where('name', 'Roti Isi')->first();
        $rotiPanggang = Category::where('name', 'Roti Panggang')->first();

        if (!$riceCat || !$chickenCat || !$drinkCat || !$rotiManis || !$rotiTawar || !$rotiIsi || !$rotiPanggang) {
            return;
        }

        $products = [
            // Existing products
            [
                'category_id' => $riceCat->id,
                'name' => 'Beef Biriyani',
                'price' => 350,
                'images_name' => 'beef-biriyani.jpg',
                'description' => 'Classic beef biriyani with aromatic spices.',
                'variations' => [
                    ['name' => 'Regular', 'price' => 350],
                    ['name' => 'Large', 'price' => 450],
                ],
                'options' => [
                    ['name' => 'Extra Sauce', 'price' => 30],
                    ['name' => 'Less Spicy', 'price' => 0],
                ],
            ],
            [
                'category_id' => $riceCat->id,
                'name' => 'Chicken Biriyani',
                'price' => 300,
                'images_name' => 'chicken-biriyani.jpg',
                'description' => 'Tender chicken biriyani with signature flavor.',
                'variations' => [
                    ['name' => 'Regular', 'price' => 300],
                    ['name' => 'Large', 'price' => 380],
                ],
                'options' => [
                    ['name' => 'Extra Sauce', 'price' => 25],
                    ['name' => 'No Chili', 'price' => 0],
                ],
            ],
            [
                'category_id' => $chickenCat->id,
                'name' => 'Tandoori Chicken',
                'price' => 420,
                'images_name' => 'tandoori-chicken.jpg',
                'description' => 'Char-grilled tandoori chicken, smoky and juicy.',
                'variations' => [
                    ['name' => '1 Pc', 'price' => 420],
                    ['name' => '2 Pcs', 'price' => 780],
                ],
                'options' => [
                    ['name' => 'Mint Sauce', 'price' => 20],
                    ['name' => 'Extra Lemon', 'price' => 10],
                ],
            ],
            [
                'category_id' => $chickenCat->id,
                'name' => 'Fried Chicken Basket',
                'price' => 280,
                'images_name' => 'fried-chicken.jpg',
                'description' => 'Crispy fried chicken with house seasoning.',
                'variations' => [
                    ['name' => 'Regular', 'price' => 280],
                    ['name' => 'Family', 'price' => 520],
                ],
                'options' => [
                    ['name' => 'BBQ Sauce', 'price' => 15],
                    ['name' => 'Spicy', 'price' => 0],
                ],
            ],
            [
                'category_id' => $drinkCat->id,
                'name' => '7 Up 250ml',
                'price' => 60,
                'images_name' => '7up-250ml.jpg',
                'description' => 'Chilled lemon-lime soda.',
                'variations' => null,
                'options' => [
                    ['name' => 'Ice', 'price' => 0],
                ],
            ],
            [
                'category_id' => $drinkCat->id,
                'name' => 'Sprite 400ml',
                'price' => 80,
                'images_name' => 'sprite-400ml.jpg',
                'description' => 'Refreshing citrus soda.',
                'variations' => null,
                'options' => [
                    ['name' => 'Ice', 'price' => 0],
                    ['name' => 'Extra Cold', 'price' => 10],
                ],
            ],
            // New bread products - Roti Manis
            [
                'category_id' => $rotiManis->id,
                'name' => 'Roti Manis Coklat',
                'price' => 12000,
                'stock' => 30,
                'images_name' => 'roti-manis-coklat.jpg',
                'description' => 'Sweet bread with chocolate filling.',
                'variations' => [
                    ['name' => 'Small', 'price' => 12000],
                    ['name' => 'Large', 'price' => 18000],
                ],
                'options' => [
                    ['name' => 'Extra Choco', 'price' => 3000],
                    ['name' => 'Less Sugar', 'price' => 0],
                ],
            ],
            [
                'category_id' => $rotiManis->id,
                'name' => 'Roti Manis Keju',
                'price' => 13000,
                'stock' => 25,
                'images_name' => 'roti-manis-keju.jpg',
                'description' => 'Sweet bread topped with melted cheese.',
                'variations' => [
                    ['name' => 'Small', 'price' => 13000],
                    ['name' => 'Large', 'price' => 19000],
                ],
                'options' => [
                    ['name' => 'Extra Cheese', 'price' => 4000],
                ],
            ],
            // Roti Tawar
            [
                'category_id' => $rotiTawar->id,
                'name' => 'Roti Tawar Putih',
                'price' => 25000,
                'stock' => 15,
                'images_name' => 'roti-tawar-putih.jpg',
                'description' => 'Classic white bread loaf, soft and fluffy.',
                'variations' => null,
                'options' => [
                    ['name' => 'Sliced', 'price' => 0],
                    ['name' => 'Uncuted', 'price' => 0],
                ],
            ],
            [
                'category_id' => $rotiTawar->id,
                'name' => 'Roti Tawar Gandum',
                'price' => 28000,
                'stock' => 12,
                'images_name' => 'roti-tawar-gandum.jpg',
                'description' => 'Healthy whole wheat bread loaf.',
                'variations' => null,
                'options' => [
                    ['name' => 'Sliced', 'price' => 0],
                    ['name' => 'Uncuted', 'price' => 0],
                ],
            ],
            // Roti Isi
            [
                'category_id' => $rotiIsi->id,
                'name' => 'Roti Isi Daging',
                'price' => 18000,
                'stock' => 20,
                'images_name' => 'roti-isi-daging.jpg',
                'description' => 'Bread filled with seasoned minced meat.',
                'variations' => [
                    ['name' => 'Regular', 'price' => 18000],
                    ['name' => 'Double Meat', 'price' => 25000],
                ],
                'options' => [
                    ['name' => 'Extra Mayo', 'price' => 3000],
                    ['name' => 'Extra Chili', 'price' => 2000],
                ],
            ],
            [
                'category_id' => $rotiIsi->id,
                'name' => 'Roti Isi Ayam',
                'price' => 16000,
                'stock' => 20,
                'images_name' => 'roti-isi-ayam.jpg',
                'description' => 'Bread filled with spiced shredded chicken.',
                'variations' => [
                    ['name' => 'Regular', 'price' => 16000],
                    ['name' => 'Double Chicken', 'price' => 22000],
                ],
                'options' => [
                    ['name' => 'Extra Mayo', 'price' => 3000],
                ],
            ],
            // Roti Panggang
            [
                'category_id' => $rotiPanggang->id,
                'name' => 'Roti Panggang Mentega',
                'price' => 8000,
                'stock' => 40,
                'images_name' => 'roti-panggang-mentega.jpg',
                'description' => 'Toasted bread with butter, crispy and savory.',
                'variations' => [
                    ['name' => '1 Slice', 'price' => 8000],
                    ['name' => '2 Slices', 'price' => 14000],
                ],
                'options' => [
                    ['name' => 'Extra Butter', 'price' => 3000],
                    ['name' => 'Garlic', 'price' => 2000],
                ],
            ],
            [
                'category_id' => $rotiPanggang->id,
                'name' => 'Roti Panggang Coklat',
                'price' => 10000,
                'stock' => 35,
                'images_name' => 'roti-panggang-coklat.jpg',
                'description' => 'Toasted bread with chocolate spread.',
                'variations' => [
                    ['name' => '1 Slice', 'price' => 10000],
                    ['name' => '2 Slices', 'price' => 17000],
                ],
                'options' => [
                    ['name' => 'Extra Chocolate', 'price' => 4000],
                    ['name' => 'Add Banana', 'price' => 3000],
                ],
            ],
        ];

        foreach ($products as $p) {
            $product = Product::updateOrCreate(
                ['name' => $p['name']],
                [
                    'category_id' => $p['category_id'],
                    'price' => $p['price'],
                    'images_name' => $p['images_name'],
                    'description' => $p['description'],
                    'variations' => $p['variations'] ?? null,
                    'options' => $p['options'],
                    'slug' => Str::slug($p['name']),
                    'stock' => $p['stock'] ?? 0,
                    'is_active' => true,
                ]
            );

            $product->refresh();
        }
    }
}
