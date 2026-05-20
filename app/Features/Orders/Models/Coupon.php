<?php

namespace App\Features\Orders\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order',
        'start_at',
        'end_at',
        'usage_limit',
        'used_count',
        'per_user_limit',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order' => 'decimal:2',
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function isValidFor($amount, $user = null)
    {
        if (!$this->is_active) return false;
        
        $now = now();
        if ($this->start_at && $this->start_at->isFuture()) return false;
        if ($this->end_at && $this->end_at->isPast()) return false;
        
        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) return false;
        
        if ($amount < $this->min_order) return false;

        if ($this->per_user_limit !== null && $user) {
            $usedCount = Order::where('user_id', $user->id)
                ->where('coupon_id', $this->id)
                ->count();
            
            if ($usedCount >= $this->per_user_limit) return false;
        }
        
        return true;
    }

    public function calculateDiscount($subtotal)
    {
        if ($this->type === 'percentage') {
            return ($subtotal * $this->value) / 100;
        }
        
        return min($this->value, $subtotal);
    }
}
