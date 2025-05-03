<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
    
    // Rutas para administradores
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/services', fn () => Inertia::render('Services/Index'))->name('services.index');
        Route::get('/subscriptions', fn () => Inertia::render('Subscriptions/Index'))->name('subscriptions.index');
        Route::get('/users', fn () => Inertia::render('Users/Index'))->name('users.index');
        Route::get('/traders', fn () => Inertia::render('Traders/Index'))->name('traders.index');
    });

    // Rutas para clientes
    Route::middleware(['role:customer'])->group(function () {
        Route::get('/services', fn () => Inertia::render('Services/Index'))->name('services.customer');
        Route::get('/my-subscriptions', fn () => Inertia::render('Subscriptions/MySubscriptions'))->name('my-subscriptions');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
