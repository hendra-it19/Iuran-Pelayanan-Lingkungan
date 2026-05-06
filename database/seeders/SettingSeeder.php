<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First retrieve to avoid duplication if running seed multiple times
        $setting = Setting::first() ?? new Setting;

        $setting->fill([
            'company_name' => 'PT Kemang Pratama',
            'primary_color' => '#FFFFFF',
            'company_address_pusat' => 'Jl. Pemuda No. 296, Jakarta 13220',
            'company_address_lokasi' => 'Jl. Kemang Pratama Raya Blok A No. 1, Bekasi',
            'company_phone' => 'Telp. 4756789 (6 lines) Fax. 4759603',
            'company_city' => 'Jakarta',
            'company_leader' => 'Indra Wahyudi',
        ]);

        $setting->save();
    }
}
