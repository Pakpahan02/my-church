<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /**
     * Relasi ke Keluarga di Wilayah ini
     */
    public function keluargas(): HasMany
    {
        return $this->hasMany(Keluarga::class);
    }
}
