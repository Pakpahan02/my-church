import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Database,
    MapPin,
    UserCog,
    Users,
    ClipboardList,
    CalendarDays,
    Wallet,
    Receipt,
    Music,
    ListMusic,
    UserCheck,
    HeartHandshake,
    BookOpenCheck,
    HandHeart,
    Heart,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Master',
        href: '#',
        icon: Database,
        items: [
            {
                title: 'Wilayah',
                href: '/master/wilayah',
                icon: MapPin,
            },
            {
                title: 'Pengguna',
                href: '/master/pengguna',
                icon: UserCog,
            },
            {
                title: 'Jemaat',
                href: '/master/jemaat',
                icon: Users,
            },
        ],
    },
    {
        title: 'Sekretaris',
        href: '#',
        icon: ClipboardList,
        items: [
            {
                title: 'Agenda',
                href: '/sekretaris/agenda',
                icon: CalendarDays,
            },
        ],
    },
    {
        title: 'Bendahara',
        href: '#',
        icon: Wallet,
        items: [
            {
                title: 'Catatan Keuangan',
                href: '/bendahara/catatan-keuangan',
                icon: Receipt,
            },
        ],
    },
    {
        title: 'Marturia',
        href: '#',
        icon: Music,
        items: [
            {
                title: 'Jadwal Pemusik',
                href: '/marturia/jadwal-pemusik',
                icon: ListMusic,
            },
            {
                title: 'Anggota',
                href: '/marturia/anggota',
                icon: UserCheck,
            },
        ],
    },
    {
        title: 'Koinonia',
        href: '#',
        icon: HeartHandshake,
        items: [
            {
                title: 'Catatan Koinonia',
                href: '/koinonia/catatan-koinonia',
                icon: BookOpenCheck,
            },
        ],
    },
    {
        title: 'Diakonia',
        href: '#',
        icon: HandHeart,
        items: [
            {
                title: 'Catatan Diakonia',
                href: '/diakonia/catatan-diakonia',
                icon: Heart,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-slate-100 bg-white">
            <SidebarHeader className="border-b border-slate-100/80 px-3 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-blue-50/50 transition-colors">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain items={mainNavItems} label="Menu Pelayanan" />
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-100 p-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
