<?php

namespace App\Features\Menu\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Menu\Models\Product;
use App\Features\Menu\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::all();
        
        $query = Product::with('category');

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhereHas('category', function($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        $products = $query->orderByRaw('(is_active = 1 AND stock > 0) DESC')->orderBy('name')->paginate(9)->withQueryString();

        return Inertia::render('Menu/Menu', [
            'categories' => $categories,
            'products' => $products,
            'filters' => $request->only(['category', 'search']),
        ]);
    }
}
