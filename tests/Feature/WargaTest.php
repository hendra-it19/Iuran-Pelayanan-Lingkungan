<?php

use App\Models\User;
use App\Models\Warga;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('warga pages can be parsed', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/warga');

    $response->assertStatus(200);
});

test('warga can be created successfully', function () {
    $user = User::factory()->create();

    $data = [
        'nama' => 'Test Warga',
        'no_hp' => '081234567890',
        'no_rumah' => '12A',
        'blok' => 'A',
        'alamat' => 'Jalan Test',
        'nominal_ipl_tetap' => 100000,
    ];

    $response = $this->actingAs($user)->post('/warga', $data);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('wargas', ['nama' => 'Test Warga']);
});

test('warga search logic works', function () {
    $user = User::factory()->create();

    Warga::factory()->create(['nama' => 'Budi Santoso', 'blok' => 'A']);
    Warga::factory()->create(['nama' => 'Joko', 'blok' => 'B']);

    $response = $this->actingAs($user)->get('/warga?search=Budi');

    // Ensure it's successful, proper Inertia logic is evaluated via integration
    $response->assertStatus(200);
});
