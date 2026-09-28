<?php

use App\Http\Controllers\Master\WilayahController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('master')->name('master.')->group(function () {
        Route::get('wilayah/index', [WilayahController::class, 'index'])->name('wilayah.index.alias');
        Route::resource('wilayah', WilayahController::class)->where(['wilayah' => '[0-9]+']);
    });
});

require __DIR__.'/settings.php';
