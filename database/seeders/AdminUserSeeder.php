<?php

namespace Database\Seeders;

use App\Enum\RoleEnums;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Administrator',
                'email' => 'superadmin@test.com',
                'role' => RoleEnums::SUPER_ADMIN->value,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Pdt. R. Lumbantobing, S.Th',
                'email' => 'pendeta@test.com',
                'role' => RoleEnums::PENDETA->value,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'St. H. Simanjuntak',
                'email' => 'sekretaris@test.com',
                'role' => RoleEnums::SEKRETARIS->value,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'St. D. br. Siregar',
                'email' => 'bendahara@test.com',
                'role' => RoleEnums::BENDAHARA->value,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'St. M. Hutapea',
                'email' => 'marturia@test.com',
                'role' => RoleEnums::MARTURIA->value,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'St. J. Nababan',
                'email' => 'koinonia@test.com',
                'role' => RoleEnums::KOINONIA->value,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'St. E. br. Pangaribuan',
                'email' => 'diakonia@test.com',
                'role' => RoleEnums::DIAKONIA->value,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Administrator',
                'email' => 'admin@test.com',
                'role' => RoleEnums::ADMIN->value,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}

