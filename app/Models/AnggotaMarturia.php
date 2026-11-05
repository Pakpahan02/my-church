<?php

namespace App\Models;

use App\Enum\JabatanMarturiaEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $jemaat_id
 * @property string $nama
 * @property string $jabatan
 * @property string|null $telepon
 * @property string|null $email
 * @property string|null $instrumen
 * @property string|null $tanggal_bergabung
 * @property bool $is_active
 * @property string|null $keterangan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class AnggotaMarturia extends Model
{
    use HasFactory;

    protected $fillable = [
        'jemaat_id',
        'nama',
        'jabatan',
        'telepon',
        'email',
        'instrumen',
        'tanggal_bergabung',
        'is_active',
        'keterangan',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'tanggal_bergabung' => 'date:Y-m-d',
    ];

    protected $appends = [
        'jabatan_label',
        'jabatan_badge',
        'kelompok',
    ];

    /**
     * Relasi ke data Jemaat (jika terhubung)
     */
    public function jemaat(): BelongsTo
    {
        return $this->belongsTo(Jemaat::class);
    }

    /**
     * Enum Jabatan Marturia
     */
    public function getJabatanEnumAttribute(): ?JabatanMarturiaEnum
    {
        return $this->jabatan ? JabatanMarturiaEnum::tryFrom($this->jabatan) : null;
    }

    /**
     * Label representasi jabatan
     */
    public function getJabatanLabelAttribute(): string
    {
        return $this->jabatan_enum?->label() ?? ($this->jabatan ?? '-');
    }

    /**
     * Badge CSS class
     */
    public function getJabatanBadgeAttribute(): string
    {
        return $this->jabatan_enum?->badgeClass() ?? 'bg-slate-100 text-slate-700 ring-slate-200';
    }

    /**
     * Kelompok bidang kerja
     */
    public function getKelompokAttribute(): string
    {
        return $this->jabatan_enum?->kelompok() ?? 'Lainnya';
    }
}

