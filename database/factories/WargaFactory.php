<?php

namespace Database\Factories;

use App\Models\Warga;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Warga>
 */
class WargaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'no_hp' => fake()->phoneNumber(),
            'no_rumah' => fake()->buildingNumber(),
            'blok' => fake()->randomElement(['A', 'B', 'C', 'D', 'E']),
            'alamat' => fake()->address(),
            'nominal_ipl_tetap' => fake()->randomElement([100000, 150000, 200000, 250000]),
        ];
    }
}
