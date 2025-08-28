<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TraderController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubcriptionController;
use App\Http\Controllers\LocationMoneyChangerPriceController;
use App\Http\Controllers\DolarRateController;
use App\Models\Plan;

 Route::get('/scrape/dolar-bolivia-hoy', DolarRateController::class);

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
    $plans = Plan::all()->map(function ($plan) {
        return [
            'id' => $plan->id,
            'name' => $plan->name,
            'conditions' => $plan->condicion ? json_decode($plan->condicion) : [],
        ];
    });

    return Inertia::render('work', [
        'plans' => $plans,
    ]);
})->name('work');

Route::get('/news', function () {
    return Inertia::render('news');
})->name('news');

Route::get('/economicVariables', function () {
    return Inertia::render('economicVariables');
})->name('economicVariables');

Route::get('/infoSpeculation', function () {
    return Inertia::render('infoSpeculation');
})->name('infoSpeculation');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
    
   
    Route::get('/traders', [TraderController::class, 'index'])->name('traders.index');
    Route::post('/traders', [TraderController::class, 'store'])->name('traders.store');
    Route::put('/traders/{id}', [TraderController::class, 'update'])->name('traders.update');
    Route::delete('/traders/{id}', [TraderController::class, 'destroy'])->name('traders.destroy');


    Route::prefix('location-money-changer-price')->group(function () {
                // Obtener todos los precios para un location_money_changer específico
                Route::get('/{id_location_money_changer}', [LocationMoneyChangerPriceController::class, 'index']);

                // Crear un nuevo precio
                Route::post('/', [LocationMoneyChangerPriceController::class, 'store']);

                // Actualizar un precio
                Route::put('/{id}', [LocationMoneyChangerPriceController::class, 'update']);

                // Eliminar un precio
                Route::delete('/{id}', [LocationMoneyChangerPriceController::class, 'destroy']);
       
                Route::get('/info/{id_location_money_changer}', [LocationMoneyChangerPriceController::class, 'getPricesInfo']);

            });

   
      // Rutas para administradores
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/services', [ServiceController::class, 'index'])->name('services.index');

        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);
        Route::get('/pagos', function() {
            return Inertia::render('Pagos');
        })->name('pagos.index');
        Route::resource('plans', PlanController::class)->except(['show']);
        Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);
        //Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.admin');
        
        
        Route::get('/subscriptions', [SubcriptionController::class, 'index'])->name('subscriptions.index');
       
        Route::post('/subscriptions', [SubcriptionController::class, 'creator'])->name('subscriptions.creator'); 
        Route::put('/subscriptions/{id}', [SubcriptionController::class, 'show'])->name('subscriptions.show');
        Route::delete('/subscriptions/{id}', [SubcriptionController::class, 'destroy'])->name('subscriptions.destroy');
        
        Route::post('/subscriptions/{id}/pay', [SubcriptionController::class, 'pay'])->name('subscriptions.pay');
        Route::get('/subscriptions/{id}/cancel', [SubcriptionController::class, 'cancel'])->name('subscriptions.cancel');
    });

    // Rutas para clientes
    Route::middleware(['role:customer'])->group(function () {
        Route::get('/services', fn () => Inertia::render('Services/Index'))->name('services.customer');
        Route::get('/my-subscriptions', fn () => Inertia::render('Subscriptions/MySubscriptions'))->name('my-subs
        criptions');
        Route::get('/money-changers', [LocationMoneyChangerPriceController::class, 'indexWithLatestPrices']);
        Route::get('/money-changers/best-usd-sale', [LocationMoneyChangerPriceController::class, 'getBestUsdSale']);
        Route::get('/money-changers/all-best-usd-sales', [LocationMoneyChangerPriceController::class, 'getAllBestUsdSales']);  
    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
