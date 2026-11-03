<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $keluarga_id
 * @property string $nama
 * @property string $jenis_kelamin
 * @property string $tanggal_lahir
 * @property string $status
 * @property string|null $hubungan_keluarga
 * @property string|null $tanggal_baptis
 * @property string|null $file_baptis
 * @property string|null $tanggal_sidi
 * @property string|null $file_sidi
 * @property string|null $tanggal_menikah
 * @property string|null $file_menikah
 * @property string|null $telepon
 * @property string|null $keterangan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Jemaat extends Model
{
    use HasFactory;

    protected $fillable = [
        'keluarga_id',
        'nama',
        'jenis_kelamin',
        'tanggal_lahir',
        'status',
        'hubungan_keluarga',
        'tanggal_baptis',
        'file_baptis',
        'tanggal_sidi',
        'file_sidi',
        'tanggal_menikah',
        'file_menikah',
        'telepon',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date:Y-m-d',
        'tanggal_baptis' => 'date:Y-m-d',
        'tanggal_sidi' => 'date:Y-m-d',
        'tanggal_menikah' => 'date:Y-m-d',
    ];

    protected $appends = [
        'kategori',
        'kategori_label',
        'status_label',
        'file_baptis_url',
        'file_sidi_url',
        'file_menikah_url',
    ];

    /**
     * Relasi ke Keluarga
     */
    public function keluarga(): BelongsTo
    {
        return $this->belongsTo(Keluarga::class);
    }

    /**
     * Menghitung kategori jemaat secara dinamis berdasarkan aturan gereja HKBP:
     * 1. Status Cerai / Cerai Mati => Duda (L) / Janda (P)
     * 2. Ada tanggal SIDI & menikah (atau status menikah) => Ama (L) / Ina (P)
     * 3. Ada tanggal SIDI (belum menikah) => Naposo
     * 4. Belum ada tanggal SIDI => Anak (Laki-laki / Perempuan)
     */
    public function getKategoriAttribute(): string
    {
        // 1. Cerai / Cerai Mati => Duda / Janda
        if (in_array($this->status, ['cerai', 'cerai_mati'])) {
            return $this->jenis_kelamin === 'L' ? 'duda' : 'janda';
        }

        // 2. Ada tanggal SIDI & tanggal menikah ATAU status menikah => Ama / Ina
        if ($this->tanggal_menikah || $this->status === 'menikah') {
            return $this->jenis_kelamin === 'L' ? 'ama' : 'ina';
        }

        // 3. Ada tanggal SIDI (belum menikah) => Naposo
        if ($this->tanggal_sidi) {
            return 'naposo';
        }

        // 4. Belum ada tanggal SIDI => Anak menyesuaikan kelamin
        return $this->jenis_kelamin === 'L' ? 'anak_laki' : 'anak_perempuan';
    }

    /**
     * Label representasi kategori dinamis
     */
    public function getKategoriLabelAttribute(): string
    {
        return match ($this->kategori) {
            'duda' => 'Duda',
            'janda' => 'Janda',
            'ama' => 'Ama',
            'ina' => 'Ina',
            'naposo' => 'Naposo',
            'anak_laki' => 'Anak (Laki-laki)',
            'anak_perempuan' => 'Anak (Perempuan)',
            default => 'Anak',
        };
    }

    /**
     * Label status pernikahan
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'single' => 'Single',
            'menikah' => 'Menikah',
            'cerai' => 'Cerai',
            'cerai_mati' => 'Cerai Mati',
            default => 'Single',
        };
    }

    /**
     * URL file baptis
     */
    public function getFileBaptisUrlAttribute(): ?string
    {
        return $this->file_baptis ? Storage::url($this->file_baptis) : null;
    }

    /**
     * URL file malua/sidi
     */
    public function getFileSidiUrlAttribute(): ?string
    {
        return $this->file_sidi ? Storage::url($this->file_sidi) : null;
    }

    /**
     * URL file menikah
     */
    public function getFileMenikahUrlAttribute(): ?string
    {
        return $this->file_menikah ? Storage::url($this->file_menikah) : null;
    }
}

