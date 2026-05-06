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
        Schema::table('settings', function (Blueprint $table) {
            $table->text('company_address_pusat')->nullable();
            $table->text('company_address_lokasi')->nullable();
            $table->string('company_phone')->nullable();
            $table->string('company_city')->default('Bekasi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'company_address_pusat',
                'company_address_lokasi',
                'company_phone',
                'company_city',
            ]);
        });
    }
};
