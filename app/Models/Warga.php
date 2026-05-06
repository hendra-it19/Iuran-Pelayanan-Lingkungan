<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warga extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'no_hp',
        'no_rumah',
        'blok',
        'alamat',
        'nominal_ipl_tetap',
    ];

    public function tagihans(): HasMany
    {
        return $this->hasMany(Tagihan::class);
    }
}
