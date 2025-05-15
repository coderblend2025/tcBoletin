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
    if (!Schema::hasTable('location_money_changer')) {
        Schema::create('location_money_changer', function (Blueprint $table) {
            $table->id();
            $table->string('lan');
            $table->string('log');
            $table->string('name');
            $table->string('code');
            $table->string('ubication_name');
            $table->boolean('status')->default(true);
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
