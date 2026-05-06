<?php

use App\Models\Tagihan;
use App\Models\User;
use App\Models\Warga;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('tagihan can be generated for the month', function () {
    $user = User::factory()->create();

    // Create 3 residents
    $wargas = Warga::factory(3)->create([
        'nominal_ipl_tetap' => 150000,
    ]);

    $bulan = 5;
    $tahun = 2026;

    $response = $this->actingAs($user)->post('/tagihan/generate', [
        'bulan' => $bulan,
        'tahun' => $tahun,
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseCount('tagihans', 3);
    $this->assertDatabaseHas('tagihans', [
        'warga_id' => $wargas->first()->id,
        'bulan' => $bulan,
        'tahun' => $tahun,
        'nominal' => 150000,
        'status' => 'Belum Lunas',
    ]);
});

test('duplicates are not generated for the same month and year', function () {
    $user = User::factory()->create();
    Warga::factory(2)->create();

    $payload = ['bulan' => 6, 'tahun' => 2026];

    // First generation
    $this->actingAs($user)->post('/tagihan/generate', $payload);
    $this->assertDatabaseCount('tagihans', 2);

    // Second generation attempts
    $response = $this->actingAs($user)->post('/tagihan/generate', $payload);

    $response->assertSessionHas('message');
    // Still 2
    $this->assertDatabaseCount('tagihans', 2);
});

test('tagihan can be paid', function () {
    $user = User::factory()->create();
    $warga = Warga::factory()->create();
    $tagihan = Tagihan::create([
        'warga_id' => $warga->id,
        'bulan' => 7,
        'tahun' => 2026,
        'nominal' => 100000,
        'status' => 'Belum Lunas',
    ]);

    $response = $this->actingAs($user)->post("/tagihan/{$tagihan->id}/pay");

    $response->assertSessionHas('success');

    $tagihan->refresh();
    expect($tagihan->status)->toBe('Lunas');
    expect($tagihan->tanggal_bayar)->not->toBeNull();
});
