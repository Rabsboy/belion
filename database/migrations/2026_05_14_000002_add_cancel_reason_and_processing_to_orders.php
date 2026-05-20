<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'processing', 'preparing', 'out_for_delivery', 'delivered', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'");

        Schema::table('orders', function ($table) {
            $table->text('cancel_reason')->nullable()->after('delivery_tracking_url');
            $table->string('cancelled_by')->nullable()->after('cancel_reason');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function ($table) {
            $table->dropColumn(['cancel_reason', 'cancelled_by']);
        });

        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'preparing', 'out_for_delivery', 'delivered', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'");
    }
};
