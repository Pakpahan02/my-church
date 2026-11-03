<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $nrj
 * @property string $nama_keluarga
 * @property int $wilayah_id
 * @property string $alamat
 * @property string $tanggal_terdaftar
 * @property string|null $telepon
 * @property string|null $keterangan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Keluarga extends Model
{
    use HasFactory;

    protected $fillable = [
        'nrj',
        'nama_keluarga',
        'wilayah_id',
        'alamat',
        'tanggal_terdaftar',
        'telepon',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_terdaftar' => 'date:Y-m-d',
    ];

    /**
     * Relasi ke Wilayah
     */
    public function wilayah(): BelongsTo
    {
        return $this->belongsTo(Wilayah::class);
    }

    /**
     * Relasi ke Anggota Jemaat
     */
    public function anggota(): HasMany
    {
        return $this->hasMany(Jemaat::class)->orderByRaw("
            CASE 
                WHEN hubungan_keluarga = 'kepala_keluarga' THEN 1
                WHEN hubungan_keluarga = 'istri' THEN 2
                WHEN hubungan_keluarga = 'anak' THEN 3
                ELSE 4
            END, tanggal_lahir ASC
        ");
    }
}

