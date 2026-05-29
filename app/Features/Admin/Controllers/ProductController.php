<?php

namespace App\Features\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Menu\Models\Product;
use App\Features\Menu\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhereHas('category', function($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        $products = $query->latest()->paginate(10)->withQueryString();
        $categories = Category::all();

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Decode JSON fields from FormData
            if (is_string($request->variations)) {
                $request->merge(['variations' => json_decode($request->variations, true)]);
            }
            if (is_string($request->options)) {
                $request->merge(['options' => json_decode($request->options, true)]);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'price' => 'required|numeric|min:0',
                'stock' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
                'description' => 'nullable|string',
                'image' => 'nullable|image|max:2048',
                'variations' => 'nullable|array',
                'options' => 'nullable|array',
            ]);

            $validated['slug'] = Str::slug($validated['name']);

            $validated['price'] = (float) preg_replace('/[^0-9.]/', '', $validated['price']);

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '-' . time() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('upload/product'), $filename);
                $validated['images_name'] = 'upload/product/' . $filename;
            } else {
                $validated['images_name'] = '';
            }

            Product::create($validated);

            return back()->with('success', 'Product created successfully!');
        } catch (\Exception $e) {
            \Log::error('Product creation failed: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return back()->withErrors(['error' => 'Failed to create product. Please try again.']);
        }
    }

    public function update(Request $request, Product $product)
    {
        try {
            // Decode JSON fields from FormData
            if (is_string($request->variations)) {
                $request->merge(['variations' => json_decode($request->variations, true)]);
            }
            if (is_string($request->options)) {
                $request->merge(['options' => json_decode($request->options, true)]);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'price' => 'required|numeric|min:0',
                'stock' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
                'description' => 'nullable|string',
                'image' => 'nullable|image|max:2048',
                'variations' => 'nullable|array',
                'options' => 'nullable|array',
            ]);

            $validated['slug'] = Str::slug($validated['name']);

            $validated['price'] = (float) preg_replace('/[^0-9.]/', '', $validated['price']);

            if ($request->hasFile('image')) {
                if ($product->images_name && File::exists(public_path($product->images_name))) {
                    try {
                        File::delete(public_path($product->images_name));
                    } catch (\Exception $e) {
                         \Log::warning('Failed to delete old product image: ' . $e->getMessage());
                    }
                }
                
                $file = $request->file('image');
                $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '-' . time() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('upload/product'), $filename);
                $validated['images_name'] = 'upload/product/' . $filename;
            }

            $product->update($validated);

            return back()->with('success', 'Product updated successfully!');
        } catch (\Exception $e) {
            \Log::error('Product update failed: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return back()->withErrors(['error' => 'Failed to update product. Please try again.']);
        }
    }

    public function toggleActive(Product $product)
    {
        $product->update(['is_active' => !$product->is_active]);
        $status = $product->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Product {$status} successfully!");
    }

    public function destroy(Product $product)
    {
        try {
            // Products can be safely deleted - names stored in order history
            
            if ($product->images_name && File::exists(public_path($product->images_name))) {
                try {
                    File::delete(public_path($product->images_name));
                } catch (\Exception $e) {
                     \Log::warning('Failed to delete product image: ' . $e->getMessage());
                }
            }

            $product->delete();

            return back()->with('success', 'Product deleted successfully!');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                \Log::error('Product deletion failed due to foreign key constraint: ' . $e->getMessage());
                return back()->withErrors([
                    'error' => 'Cannot delete this product due to database constraints. Please contact technical support.'
                ]);
            }
            
            \Log::error('Product deletion failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to delete product. Please try again.']);
        } catch (\Exception $e) {
            \Log::error('Product deletion failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to delete product. Please try again.']);
        }
    }
}
