<?php

use App\Http\Controllers\TraderController;
use Illuminate\Support\Facades\Route;

Route::post('/traders', [TraderController::class, 'store']); 