<?php

namespace App\Features\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Menu\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::withCount('products');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Admin/Categories', [
            'categories' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:categories',
                'description' => 'nullable|string',
            ]);

            Category::create($validated);

            return back()->with('success', 'Category created successfully!');
        } catch (\Exception $e) {
            \Log::error('Category creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to create category. Please try again.']);
        }
    }

    public function update(Request $request, Category $category)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
                'description' => 'nullable|string',
            ]);

            $category->update($validated);

            return back()->with('success', 'Category updated successfully!');
        } catch (\Exception $e) {
            \Log::error('Category update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update category. Please try again.']);
        }
    }

    public function destroy(Category $category)
    {
        try {
            if ($category->products()->count() > 0) {
                return back()->withErrors(['error' => 'Cannot delete category with associated products.']);
            }

            $category->delete();

            return back()->with('success', 'Category deleted successfully!');
        } catch (\Exception $e) {
            \Log::error('Category deletion failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to delete category. Please try again.']);
        }
    }
}
