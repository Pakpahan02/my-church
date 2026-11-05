<?php

namespace Database\Seeders;

use App\Models\Jemaat;
use App\Models\Keluarga;
use App\Models\Wilayah;
use Illuminate\Database\Seeder;

class JemaatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wijk1 = Wilayah::where('nomor_wilayah', '01')->first();
        $wijk2 = Wilayah::where('nomor_wilayah', '02')->first();
        $wijk3 = Wilayah::where('nomor_wilayah', '03')->first();
        $wijk4 = Wilayah::where('nomor_wilayah', '04')->first();

        // Fallbacks in case wilayah has different IDs
        $wijk1Id = $wijk1?->id ?? 1;
        $wijk2Id = $wijk2?->id ?? 2;
        $wijk3Id = $wijk3?->id ?? 3;
        $wijk4Id = $wijk4?->id ?? 4;

        $keluargas = [
            // Keluarga 1: Wijk 1 - Ama, Ina, 2 Naposo (L & P), 1 Anak (L)
            [
                'data' => [
                    'nrj' => 'NRJ-01-001',
                    'nama_keluarga' => 'Kel. St. B. Pakpahan / br. Sitompul',
                    'wilayah_id' => $wijk1Id,
                    'alamat' => 'Perumahan Citra Indah, Klaster Bukit Menteng Blok A1 No. 12',
                    'tanggal_terdaftar' => '2018-02-10',
                    'telepon' => '081234567890',
                    'keterangan' => 'Sintua Wijk 1',
                ],
                'anggota' => [
                    [
                        'nama' => 'St. B. Pakpahan',
                        'jenis_kelamin' => 'L',
                        'tanggal_lahir' => '1974-06-15',
                        'status' => 'menikah',
                        'hubungan_keluarga' => 'kepala_keluarga',
                        'tanggal_baptis' => '1974-08-20',
                        'tanggal_sidi' => '1991-05-10',
                        'tanggal_menikah' => '2001-07-20',
                        'telepon' => '081234567890',
                        'keterangan' => 'Sintua',
                    ],
                    [
                        'nama' => 'R. br. Sitompul',
                        'jenis_kelamin' => 'P',
                        'tanggal_lahir' => '1977-08-20',
                        'status' => 'menikah',
                        'hubungan_keluarga' => 'istri',
                        'tanggal_baptis' => '1977-10-25',
                        'tanggal_sidi' => '1994-05-15',
                        'tanggal_menikah' => '2001-07-20',
                        'telepon' => '081234567891',
                        'keterangan' => 'Pengurus Seksi Ina',
                    ],
                    [
                        'nama' => 'Daniel Pakpahan',
                        'jenis_kelamin' => 'L',
                        'tanggal_lahir' => '2003-04-12',
                        'status' => 'single',
                        'hubungan_keluarga' => 'anak',
                        'tanggal_baptis' => '2003-06-15',
                        'tanggal_sidi' => '2020-04-12',
                        'tanggal_menikah' => null,
                        'telepon' => '081234567892',
                        'keterangan' => 'Pemusik Gereja / Naposobulung',
                    ],
                    [
                        'nama' => 'Maria br. Pakpahan',
                        'jenis_kelamin' => 'P',
                        'tanggal_lahir' => '2006-09-18',
                        'status' => 'single',
                        'hubungan_keluarga' => 'anak',
                        'tanggal_baptis' => '2006-11-26',
                        'tanggal_sidi' => '2023-04-09',
                        'tanggal_menikah' => null,
                        'telepon' => '081234567893',
                        'keterangan' => 'Song Leader / Naposobulung',
                    ],
                    [
                        'nama' => 'Samuel Pakpahan',
                        'jenis_kelamin' => 'L',
                        'tanggal_lahir' => '2015-12-05',
                        'status' => 'single',
                        'hubungan_keluarga' => 'anak',
                        'tanggal_baptis' => '2016-02-14',
                        'tanggal_sidi' => null,
                        'tanggal_menikah' => null,
                        'telepon' => null,
                        'keterangan' => 'Sekolah Minggu',
                    ],
                ],
            ],

            // Keluarga 2: Wijk 2 - Janda & Naposo
            [
                'data' => [
                    'nrj' => 'NRJ-02-001',
                    'nama_keluarga' => 'Kel. Ny. Hutabarat br. Simanjuntak',
                    'wilayah_id' => $wijk2Id,
                    'alamat' => 'Perumahan Citra Indah, Klaster Bukit Rasamala Blok B3 No. 05',
                    'tanggal_terdaftar' => '2019-05-12',
                    'telepon' => '081345678901',
                    'keterangan' => 'Keluarga Pensiunan',
                ],
                'anggota' => [
                    [
                        'nama' => 'M. br. Simanjuntak',
                        'jenis_kelamin' => 'P',
                        'tanggal_lahir' => '1968-03-22',
                        'status' => 'cerai_mati',
                        'hubungan_keluarga' => 'kepala_keluarga',
                        'tanggal_baptis' => '1968-05-10',
                        'tanggal_sidi' => '1985-05-12',
                        'tanggal_menikah' => '1992-06-14',
                        'telepon' => '081345678901',
                        'keterangan' => 'Anggota Koor Ina Hanna',
                    ],
                    [
                        'nama' => 'Kevin Hutabarat',
                        'jenis_kelamin' => 'L',
                        'tanggal_lahir' => '2001-08-14',
                        'status' => 'single',
                        'hubungan_keluarga' => 'anak',
                        'tanggal_baptis' => '2001-10-20',
                        'tanggal_sidi' => '2018-04-01',
                        'tanggal_menikah' => null,
                        'telepon' => '081345678902',
                        'keterangan' => 'Pengurus Naposobulung',
                    ],
                ],
            ],

            // Keluarga 3: Wijk 3 - Duda & Anak Perempuan
            [
                'data' => [
                    'nrj' => 'NRJ-03-001',
                    'nama_keluarga' => 'Kel. P. Marpaung',
                    'wilayah_id' => $wijk3Id,
                    'alamat' => 'Perumahan Citra Indah, Klaster Bukit Mahoni Blok C2 No. 08',
                    'tanggal_terdaftar' => '2020-08-17',
                    'telepon' => '081456789012',
                    'keterangan' => null,
                ],
                'anggota' => [
                    [
                        'nama' => 'P. Marpaung',
                        'jenis_kelamin' => 'L',
                        'tanggal_lahir' => '1970-11-10',
                        'status' => 'cerai',
                        'hubungan_keluarga' => 'kepala_keluarga',
                        'tanggal_baptis' => '1971-01-15',
                        'tanggal_sidi' => '1987-05-20',
                        'tanggal_menikah' => '1998-09-12',
                        'telepon' => '081456789012',
                        'keterangan' => 'Anggota Koor Ama',
                    ],
                    [
                        'nama' => 'Putri br. Marpaung',
                        'jenis_kelamin' => 'P',
                        'tanggal_lahir' => '2014-06-25',
                        'status' => 'single',
                        'hubungan_keluarga' => 'anak',
                        'tanggal_baptis' => '2014-08-30',
                        'tanggal_sidi' => null,
                        'tanggal_menikah' => null,
                        'telepon' => null,
                        'keterangan' => 'Sekolah Minggu Horas',
                    ],
                ],
            ],

            // Keluarga 4: Wijk 4 - Ama, Ina, Anak L & Anak P
            [
                'data' => [
                    'nrj' => 'NRJ-04-001',
                    'nama_keluarga' => 'Kel. T. Sihombing / br. Tambunan',
                    'wilayah_id' => $wijk4Id,
                    'alamat' => 'Perumahan Citra Indah, Klaster Bukit Edelweiss Blok D5 No. 21',
                    'tanggal_terdaftar' => '2021-01-20',
                    'telepon' => '081567890123',
                    'keterangan' => null,
                ],
                'anggota' => [
                    [
                        'nama' => 'T. Sihombing',
                        'jenis_kelamin' => 'L',
                        'tanggal_lahir' => '1985-07-19',
                        'status' => 'menikah',
                        'hubungan_keluarga' => 'kepala_keluarga',
                        'tanggal_baptis' => '1985-09-22',
                        'tanggal_sidi' => '2002-05-19',
                        'tanggal_menikah' => '2012-10-06',
                        'telepon' => '081567890123',
                        'keterangan' => 'Seksi Diakonia Sosial',
                    ],
                    [
                        'nama' => 'E. br. Tambunan',
                        'jenis_kelamin' => 'P',
                        'tanggal_lahir' => '1988-02-14',
                        'status' => 'menikah',
                        'hubungan_keluarga' => 'istri',
                        'tanggal_baptis' => '1988-04-17',
                        'tanggal_sidi' => '2005-05-15',
                        'tanggal_menikah' => '2012-10-06',
                        'telepon' => '081567890124',
                        'keterangan' => 'Guru Sekolah Minggu',
                    ],
                    [
                        'nama' => 'Gabriel Sihombing',
                        'jenis_kelamin' => 'L',
                        'tanggal_lahir' => '2018-05-02',
                        'status' => 'single',
                        'hubungan_keluarga' => 'anak',
                        'tanggal_baptis' => '2018-07-15',
                        'tanggal_sidi' => null,
                        'tanggal_menikah' => null,
                        'telepon' => null,
                        'keterangan' => 'Sekolah Minggu',
                    ],
                    [
                        'nama' => 'Ester br. Sihombing',
                        'jenis_kelamin' => 'P',
                        'tanggal_lahir' => '2021-09-10',
                        'status' => 'single',
                        'hubungan_keluarga' => 'anak',
                        'tanggal_baptis' => '2021-11-28',
                        'tanggal_sidi' => null,
                        'tanggal_menikah' => null,
                        'telepon' => null,
                        'keterangan' => 'Sekolah Minggu Balita',
                    ],
                ],
            ],
        ];

        foreach ($keluargas as $item) {
            $keluarga = Keluarga::updateOrCreate(
                ['nrj' => $item['data']['nrj']],
                $item['data']
            );

            foreach ($item['anggota'] as $anggota) {
                Jemaat::updateOrCreate(
                    [
                        'keluarga_id' => $keluarga->id,
                        'nama' => $anggota['nama'],
                    ],
                    $anggota
                );
            }
        }
    }
}

