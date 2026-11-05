<?php

use App\Http\Controllers\Marturia\AnggotaMarturiaController;
use App\Http\Controllers\Master\JemaatController;
use App\Http\Controllers\Master\PenggunaController;
use App\Http\Controllers\Master\WilayahController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('master')->name('master.')->group(function () {
        Route::get('wilayah/index', [WilayahController::class, 'index'])->name('wilayah.index.alias');
        Route::resource('wilayah', WilayahController::class)->where(['wilayah' => '[0-9]+']);

        Route::get('pengguna/index', [PenggunaController::class, 'index'])->name('pengguna.index.alias');
        Route::resource('pengguna', PenggunaController::class)->where(['pengguna' => '[0-9]+']);

        Route::get('jemaat/index', [JemaatController::class, 'index'])->name('jemaat.index.alias');
        Route::get('jemaat', [JemaatController::class, 'index'])->name('jemaat.index');
        Route::post('jemaat/keluarga', [JemaatController::class, 'storeKeluarga'])->name('jemaat.keluarga.store');
        Route::put('jemaat/keluarga/{keluarga}', [JemaatController::class, 'updateKeluarga'])->name('jemaat.keluarga.update');
        Route::delete('jemaat/keluarga/{keluarga}', [JemaatController::class, 'destroyKeluarga'])->name('jemaat.keluarga.destroy');
        Route::post('jemaat/keluarga/{keluarga}/anggota', [JemaatController::class, 'storeAnggota'])->name('jemaat.anggota.store');
        Route::post('jemaat/anggota/{jemaat}', [JemaatController::class, 'updateAnggota'])->name('jemaat.anggota.update');
        Route::delete('jemaat/anggota/{jemaat}', [JemaatController::class, 'destroyAnggota'])->name('jemaat.anggota.destroy');
    });

    Route::prefix('marturia')->name('marturia.')->group(function () {
        Route::get('anggota/index', [AnggotaMarturiaController::class, 'index'])->name('anggota.index.alias');
        Route::resource('anggota', AnggotaMarturiaController::class)
            ->parameters(['anggota' => 'anggota'])
            ->where(['anggota' => '[0-9]+']);
    });
});

require __DIR__.'/settings.php';
