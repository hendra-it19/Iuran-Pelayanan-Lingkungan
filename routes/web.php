<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TagihanController;
use App\Http\Controllers\TunggakanController;
use App\Http\Controllers\WargaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::resource('warga', WargaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::post('warga/bulk-update-ipl', [WargaController::class, 'bulkUpdateIpl'])->name('warga.bulkUpdateIpl');

    Route::get('tagihan', [TagihanController::class, 'index'])->name('tagihan.index');
    Route::post('tagihan/generate', [TagihanController::class, 'generate'])->name('tagihan.generate');
    Route::post('tagihan/bulk-pay', [TagihanController::class, 'bulkPay'])->name('tagihan.bulkPay');
    Route::get('tagihan/bulk-print', [TagihanController::class, 'bulkPrint'])->name('tagihan.bulkPrint');
    Route::post('tagihan/{tagihan}/pay', [TagihanController::class, 'pay'])->name('tagihan.pay');
    Route::get('tagihan/export/excel', [TagihanController::class, 'exportExcel'])->name('tagihan.exportExcel');
    Route::get('tagihan/export/pdf', [TagihanController::class, 'exportPdf'])->name('tagihan.exportPdf');

    Route::get('tagihan/print-blank/{format}', [TagihanController::class, 'printBlank'])->name('tagihan.printBlank');
    Route::get('tagihan/{tagihan}/print/{format}', [TagihanController::class, 'print'])->name('tagihan.print');

    Route::get('tunggakan', [TunggakanController::class, 'index'])->name('tunggakan.index');
    Route::get('tunggakan/export/excel', [TunggakanController::class, 'exportExcel'])->name('tunggakan.exportExcel');
    Route::get('tunggakan/export/pdf', [TunggakanController::class, 'exportPdf'])->name('tunggakan.exportPdf');

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);
    });
});

require __DIR__.'/settings.php';
