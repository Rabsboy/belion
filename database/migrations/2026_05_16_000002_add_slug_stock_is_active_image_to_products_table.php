<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
            $table->integer('stock')->default(0)->after('description');
            $table->string('image')->nullable()->after('images_name');
            $table->boolean('is_active')->default(true)->after('options');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['slug', 'stock', 'image', 'is_active']);
        });
    }
};
