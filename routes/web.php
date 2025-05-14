<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TraderController;
use App\Http\Controllers\PlanController;
//use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('aboutus');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::get('/work', function () {
    return Inertia::render('work');
})->name('work');

Route::get('/news', function () {
    return Inertia::render('news');
})->name('news');

Route::get('/economicVariables', function () {
    return Inertia::render('economicVariables');
})->name('economicVariables');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
    
    // Rutas para administradores
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
        Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/traders', [TraderController::class, 'index'])->name('traders.index');
        Route::resource('plans', PlanController::class)->except(['show']);

      //  Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.admin');
    });

    // Rutas para clientes
    Route::middleware(['role:customer'])->group(function () {
        Route::get('/services', fn () => Inertia::render('Services/Index'))->name('services.customer');
        Route::get('/my-subscriptions', fn () => Inertia::render('Subscriptions/MySubscriptions'))->name('my-subscriptions');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
