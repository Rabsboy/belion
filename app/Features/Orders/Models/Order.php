<?php

namespace App\Features\Orders\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Order extends Model
{
    use HasFactory;

    const FULFILLMENT_DELIVERY = 'delivery';
    const FULFILLMENT_PICKUP = 'pickup';

    const STATUSES_DELIVERY = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'completed'];
    const STATUSES_PICKUP = ['pending', 'preparing', 'completed'];

    const STATUSES_DELIVERY_UPDATE = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'completed', 'cancelled'];
    const STATUSES_PICKUP_UPDATE = ['pending', 'preparing', 'completed', 'cancelled'];

    protected $fillable = [
        'user_id',
        'client_name',
        'client_email',
        'client_phone',
        'subtotal',
        'discount_amount',
        'total',
        'coupon_id',
        'address',
        'order_note',
        'order_type',
        'fulfillment_type',
        'status',
        'payment_status',
        'payment_method',
        'delivery_tracking_url',
        'delivery_fee',
        'delivery_address',
        'delivery_lat',
        'delivery_lng',
        'delivery_distance_km',
        'cancel_reason',
        'cancelled_by',
        'order_source',
    ];

    public static function allowedStatusesForUpdate(?string $fulfillmentType): array
    {
        return $fulfillmentType === self::FULFILLMENT_PICKUP
            ? self::STATUSES_PICKUP_UPDATE
            : self::STATUSES_DELIVERY_UPDATE;
    }

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'delivery_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'delivery_lat' => 'decimal:7',
            'delivery_lng' => 'decimal:7',
            'delivery_distance_km' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
