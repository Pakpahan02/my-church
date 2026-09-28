<?php

namespace App\Enum;

enum RoleEnums: string
{
    case SUPER_ADMIN = "super-admin";
    case PENDETA = "pendeta";
    case SEKRETARIS = "sekretaris";
    case BENDAHARA = "bendahara";
    case MARTURIA = "marturia";
    case KOINONIA = "koinonia";
    case DIAKONIA = "diakonia";
    case ADMIN = "admin";

    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::PENDETA => 'Pendeta',
            self::SEKRETARIS => 'Sekretaris',
            self::BENDAHARA => 'Bendahara',
            self::MARTURIA => 'Marturia',
            self::KOINONIA => 'Koinonia',
            self::DIAKONIA => 'Diakonia',
            self::ADMIN => 'Admin',
        };
    }

    public function badge(): string
    {
        return match($this) {
            self::SUPER_ADMIN => <<<HTML
                <span class="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:ring-indigo-800/50">
                    Super Admin
                </span>
            HTML,
            self::PENDETA => <<<HTML
                <span class="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-800/50">
                    Pendeta
                </span>
            HTML,
            self::SEKRETARIS => <<<HTML
                <span class="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:ring-orange-800/50">
                    Sekretaris
                </span>
            HTML,
            self::BENDAHARA => <<<HTML
                <span class="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:ring-orange-800/50">
                    Bendahara
                </span>
            HTML,
            self::MARTURIA => <<<HTML
                <span class="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:ring-teal-800/50">
                    Marturia
                </span>
            HTML,
            self::KOINONIA => <<<HTML
                <span class="inline-flex items-center rounded-full bg-lime-100 px-2.5 py-1 text-xs font-semibold text-lime-700 ring-1 ring-lime-200 dark:bg-lime-950/50 dark:text-lime-300 dark:ring-lime-800/50">
                    Koinonia
                </span>
            HTML,
            self::DIAKONIA => <<<HTML
                <span class="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:ring-purple-800/50">
                    Diakonia
                </span>
            HTML,
            self::ADMIN => <<<HTML
                <span class="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-1 text-xs font-semibold text-pink-700 ring-1 ring-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:ring-pink-800/50">
                    Admin
                </span>
            HTML,
        };
    }
}
