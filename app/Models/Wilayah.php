<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string|null $nomor_wilayah
 * @property string $name
 * @property string|null $keterangan
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Wilayah extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_wilayah',
        'name',
        'keterangan',
    ];
}
