<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(){
    if (!Schema::hasTable('location_money_changer_price')) {
        Schema::create('location_money_changer_price', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_location_money_changer');
            $table->foreign('id_location_money_changer')->references('id')->on('location_money_changer')->onDelete('cascade');
            $table->decimal('price_sale', 8, 2);
            $table->decimal('price_buy', 8, 2);
            $table->timestamps();
        });
    }
}



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('location_money_changer');
    }
};
