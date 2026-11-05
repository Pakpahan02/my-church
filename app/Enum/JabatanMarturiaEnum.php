<?php

namespace App\Enum;

enum JabatanMarturiaEnum: string
{
    case DEWAN_MARTURIA = 'dewan_marturia';
    case ANGGOTA_MARTURIA = 'anggota_marturia';
    case KETUA_MULTIMEDIA = 'ketua_multimedia';
    case ANGGOTA_MULTIMEDIA = 'anggota_multimedia';
    case KETUA_SEKSI_MUSIK = 'ketua_seksi_musik';
    case SONG_LEADER = 'song_leader';
    case ORGANIS = 'organis';
    case TAGADING = 'tagading';
    case PEMUSIK_BAND = 'pemusik_band';

    public function label(): string
    {
        return match ($this) {
            self::DEWAN_MARTURIA => 'Dewan Marturia',
            self::ANGGOTA_MARTURIA => 'Anggota Marturia',
            self::KETUA_MULTIMEDIA => 'Ketua Multimedia',
            self::ANGGOTA_MULTIMEDIA => 'Anggota Multimedia',
            self::KETUA_SEKSI_MUSIK => 'Ketua Seksi Musik',
            self::SONG_LEADER => 'Song Leader',
            self::ORGANIS => 'Organis',
            self::TAGADING => 'Tagading',
            self::PEMUSIK_BAND => 'Pemusik Band',
        };
    }

    public function badgeClass(): string
    {
        return match ($this) {
            self::DEWAN_MARTURIA => 'bg-indigo-100 text-indigo-700 ring-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300',
            self::ANGGOTA_MARTURIA => 'bg-blue-100 text-blue-700 ring-blue-200 dark:bg-blue-950/50 dark:text-blue-300',
            self::KETUA_MULTIMEDIA => 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-300',
            self::ANGGOTA_MULTIMEDIA => 'bg-cyan-100 text-cyan-700 ring-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300',
            self::KETUA_SEKSI_MUSIK => 'bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300',
            self::SONG_LEADER => 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300',
            self::ORGANIS => 'bg-purple-100 text-purple-700 ring-purple-200 dark:bg-purple-950/50 dark:text-purple-300',
            self::TAGADING => 'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300',
            self::PEMUSIK_BAND => 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300',
        };
    }

    public function kelompok(): string
    {
        return match ($this) {
            self::DEWAN_MARTURIA, self::ANGGOTA_MARTURIA => 'Dewan & Pengurus',
            self::KETUA_MULTIMEDIA, self::ANGGOTA_MULTIMEDIA => 'Multimedia & IT',
            self::KETUA_SEKSI_MUSIK, self::ORGANIS, self::TAGADING, self::PEMUSIK_BAND => 'Pemusik & Iringan',
            self::SONG_LEADER => 'Song Leader / Pemandu Lagu',
        };
    }
}

