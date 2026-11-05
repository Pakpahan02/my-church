<?php

namespace Database\Seeders;

use App\Enum\JabatanMarturiaEnum;
use App\Models\AnggotaMarturia;
use App\Models\Jemaat;
use Illuminate\Database\Seeder;

class MarturiaAnggotaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Link to existing jemaat if available
        $daniel = Jemaat::where('nama', 'like', '%Daniel Pakpahan%')->first();
        $maria = Jemaat::where('nama', 'like', '%Maria br. Pakpahan%')->first();
        $kevin = Jemaat::where('nama', 'like', '%Kevin Hutabarat%')->first();

        $pelayanList = [
            [
                'jemaat_id' => null,
                'nama' => 'St. M. Hutapea',
                'jabatan' => JabatanMarturiaEnum::DEWAN_MARTURIA->value,
                'telepon' => '081211112222',
                'email' => 'marturia@test.com',
                'instrumen' => null,
                'tanggal_bergabung' => '2020-01-10',
                'is_active' => true,
                'keterangan' => 'Ketua Dewan Marturia HKBP Citra Indah',
            ],
            [
                'jemaat_id' => null,
                'nama' => 'St. P. Situmorang',
                'jabatan' => JabatanMarturiaEnum::ANGGOTA_MARTURIA->value,
                'telepon' => '081222223333',
                'email' => null,
                'instrumen' => null,
                'tanggal_bergabung' => '2021-02-15',
                'is_active' => true,
                'keterangan' => 'Anggota Dewan Marturia Urusan Ibadah',
            ],
            [
                'jemaat_id' => $kevin?->id,
                'nama' => $kevin?->nama ?? 'Kevin Hutabarat',
                'jabatan' => JabatanMarturiaEnum::KETUA_MULTIMEDIA->value,
                'telepon' => '081345678902',
                'email' => 'kevin.multimedia@test.com',
                'instrumen' => 'Video Switcher & OBS Live Streaming',
                'tanggal_bergabung' => '2021-06-01',
                'is_active' => true,
                'keterangan' => 'Koordinator Tim Live Streaming & Sound System',
            ],
            [
                'jemaat_id' => null,
                'nama' => 'Jonathan Sitorus',
                'jabatan' => JabatanMarturiaEnum::ANGGOTA_MULTIMEDIA->value,
                'telepon' => '081388889999',
                'email' => null,
                'instrumen' => 'Slide Proyektor & Kamera',
                'tanggal_bergabung' => '2022-03-10',
                'is_active' => true,
                'keterangan' => 'Operator Slide Ibadah Pagi & Siang',
            ],
            [
                'jemaat_id' => null,
                'nama' => 'C. Simanjuntak',
                'jabatan' => JabatanMarturiaEnum::KETUA_SEKSI_MUSIK->value,
                'telepon' => '081255556666',
                'email' => null,
                'instrumen' => 'Konduktor / Aransemen Koor',
                'tanggal_bergabung' => '2019-08-17',
                'is_active' => true,
                'keterangan' => 'Koordinator Jadwal dan Pelatihan Musik Gereja',
            ],
            [
                'jemaat_id' => $maria?->id,
                'nama' => $maria?->nama ?? 'Maria br. Pakpahan',
                'jabatan' => JabatanMarturiaEnum::SONG_LEADER->value,
                'telepon' => '081234567893',
                'email' => null,
                'instrumen' => 'Vokal Sopran / Alto',
                'tanggal_bergabung' => '2023-01-15',
                'is_active' => true,
                'keterangan' => 'Pemandu Lagu Ibadah Minggu & Partangiangan',
            ],
            [
                'jemaat_id' => null,
                'nama' => 'Ruth br. Manurung',
                'jabatan' => JabatanMarturiaEnum::ORGANIS->value,
                'telepon' => '081277778888',
                'email' => null,
                'instrumen' => 'Pipa Organ & Keyboard Yamaha Electone',
                'tanggal_bergabung' => '2020-05-10',
                'is_active' => true,
                'keterangan' => 'Organis Ibadah Minggu Bahasa Batak & Indonesia',
            ],
            [
                'jemaat_id' => null,
                'nama' => 'Poltak Nainggolan',
                'jabatan' => JabatanMarturiaEnum::TAGADING->value,
                'telepon' => '081299990000',
                'email' => null,
                'instrumen' => 'Tagading & Gondang Batak',
                'tanggal_bergabung' => '2019-11-20',
                'is_active' => true,
                'keterangan' => 'Pemusik Gondang Tradisional HKBP',
            ],
            [
                'jemaat_id' => $daniel?->id,
                'nama' => $daniel?->nama ?? 'Daniel Pakpahan',
                'jabatan' => JabatanMarturiaEnum::PEMUSIK_BAND->value,
                'telepon' => '081234567892',
                'email' => null,
                'instrumen' => 'Gitar Elektrik / Akustik',
                'tanggal_bergabung' => '2021-04-12',
                'is_active' => true,
                'keterangan' => 'Pemusik Ibadah Remaja & Pemuda (Naposo)',
            ],
        ];

        foreach ($pelayanList as $item) {
            AnggotaMarturia::updateOrCreate(
                ['nama' => $item['nama'], 'jabatan' => $item['jabatan']],
                $item
            );
        }
    }
}

