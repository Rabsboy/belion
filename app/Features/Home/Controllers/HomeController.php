<?php

namespace App\Features\Home\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Menu\Models\Product;
use App\Features\Menu\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $products = Product::with('category')->get();

        return Inertia::render('Home/Home', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}
