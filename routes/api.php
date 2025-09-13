<?php

use App\Http\Controllers\TraderController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DolarRateController;

Route::post('/traders', [TraderController::class, 'store']); 

Route::get('/scrape/dolar-bolivia-hoy', DolarRateController::class);