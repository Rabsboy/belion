<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->nullable()->index('orders_user_id_foreign');
            $table->string('client_name')->nullable();
            $table->string('client_email')->nullable();
            $table->string('client_phone')->nullable();
            $table->decimal('subtotal', 10);
            $table->decimal('delivery_fee', 10)->default(50);
            $table->decimal('discount_amount', 10)->default(0);
            $table->decimal('total', 10);
            $table->unsignedBigInteger('coupon_id')->nullable()->index('orders_coupon_id_foreign');
            $table->text('address');
            $table->text('order_note')->nullable();
            $table->string('order_type')->default('home-delivery');
            $table->enum('status', ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->string('delivery_tracking_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
