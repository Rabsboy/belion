<?php

namespace App\Features\Menu\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'price',
        'images_name',
        'image',
        'description',
        'stock',
        'variations',
        'options',
        'is_active',
    ];

    protected $casts = [
        'variations' => 'array',
        'options' => 'array',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'stock' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
