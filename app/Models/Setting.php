<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'company_name',
        'company_address',
        'company_logo',
        'company_leader',
        'primary_color',
        'company_address_pusat',
        'company_address_lokasi',
        'company_phone',
        'company_wa',
        'company_city',
        'theme_color',
        'bank_name',
        'bank_account',
        'bank_holder',
    ];
}
