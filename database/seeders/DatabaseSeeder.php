<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\User;
use App\Models\Warga;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        User::factory()->create([
            'username' => 'admin',
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123'),
            'is_admin' => true,
        ]);
        User::factory()->create([
            'username' => 'pegawai',
            'name' => 'Pegawai',
            'email' => 'pegawai@gmail.com',
            'password' => Hash::make('123'),
            'is_admin' => false,
        ]);

        // 2. Create Default Settings
        Setting::create([
            'company_name' => 'PT. KEMANG PRATAMA',
            'company_address_pusat' => 'Jl. Kemang Pratama Raya, Blok A, No.1',
            'company_address_lokasi' => 'Kemang Pratama Golf, Ruko, Magnolia',
            'company_phone' => '8240-6129',
            'company_wa' => '0813-9970-098',
            'company_city' => 'Bekasi',
            'company_leader' => 'H. Mulyadi, SE',
            'bank_name' => 'Bank BNI',
            'bank_account' => '16492971',
            'bank_holder' => 'PT. KEMANG PRATAMA',
        ]);

        // 3. Create Random Warga (50 people)
        Warga::factory(20)->create();
    }
}
