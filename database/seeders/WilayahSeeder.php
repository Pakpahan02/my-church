<?php

namespace Database\Seeders;

use App\Models\Wilayah;
use Illuminate\Database\Seeder;

class WilayahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wilayahs = [
            [
                'nomor_wilayah' => '01',
                'name' => 'Wijk 1 - Bukit Menteng & Palem',
                'keterangan' => 'Mencakup klaster Bukit Menteng, Bukit Palem, dan sekitarnya.',
            ],
            [
                'nomor_wilayah' => '02',
                'name' => 'Wijk 2 - Bukit Rasamala & Cendana',
                'keterangan' => 'Mencakup klaster Bukit Rasamala, Bukit Cendana, dan sekitarnya.',
            ],
            [
                'nomor_wilayah' => '03',
                'name' => 'Wijk 3 - Bukit Mahoni & Damar',
                'keterangan' => 'Mencakup klaster Bukit Mahoni, Bukit Damar, dan sekitarnya.',
            ],
            [
                'nomor_wilayah' => '04',
                'name' => 'Wijk 4 - Bukit Edelweiss & Rosemary',
                'keterangan' => 'Mencakup klaster Bukit Edelweiss, Bukit Rosemary, dan sekitarnya.',
            ],
            [
                'nomor_wilayah' => '05',
                'name' => 'Wijk 5 - Bukit Heliconia & Jasmine',
                'keterangan' => 'Mencakup klaster Bukit Heliconia, Bukit Jasmine, dan sekitarnya.',
            ],
            [
                'nomor_wilayah' => '06',
                'name' => 'Wijk 6 - Bukit Magnolia & Tulip',
                'keterangan' => 'Mencakup klaster Bukit Magnolia, Bukit Tulip, dan sekitarnya.',
            ],
            [
                'nomor_wilayah' => '07',
                'name' => 'Wijk 7 - Bukit Sakura & Salvia',
                'keterangan' => 'Mencakup klaster Bukit Sakura, Bukit Salvia, dan sekitarnya.',
            ],
            [
                'nomor_wilayah' => '08',
                'name' => 'Wijk 8 - Bukit Angsana & Ravenia',
                'keterangan' => 'Mencakup klaster Bukit Angsana, Bukit Ravenia, dan sekitarnya.',
            ],
        ];

        foreach ($wilayahs as $item) {
            Wilayah::updateOrCreate(
                ['nomor_wilayah' => $item['nomor_wilayah']],
                [
                    'name' => $item['name'],
                    'keterangan' => $item['keterangan'],
                ]
            );
        }
    }
}
