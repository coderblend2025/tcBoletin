<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePageViewsTable extends Migration
{
    public function up()
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('ip', 45);
            $table->text('user_agent')->nullable();
            $table->string('path');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('page_views');
    }
}
