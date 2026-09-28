import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    Users,
    MapPin,
    Wallet,
    CalendarDays,
    Music,
    Sun,
    Clock,
    BookOpen,
    HeartHandshake,
    HandHeart,
    TrendingUp,
    ArrowUpRight,
    Sparkles,
    UserCheck,
    CheckCircle2,
    Calendar,
} from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;

    const stats = [
        {
            title: 'Total Jemaat',
            value: '1,245',
            unit: 'Jiwa',
            subtext: 'Terdaftar di 8 Sektor / Wijk',
            change: '+12 jiwa bulan ini',
            icon: Users,
            color: 'from-blue-600 to-blue-700',
            iconBg: 'bg-blue-50 text-blue-700',
        },
        {
            title: 'Keuangan Kas',
            value: 'Rp 84,5 Jt',
            unit: 'Saldo',
            subtext: 'Penerimaan & Pengeluaran Kas',
            change: 'Laporan per September 2026',
            icon: Wallet,
            color: 'from-emerald-600 to-teal-700',
            iconBg: 'bg-emerald-50 text-emerald-700',
        },
        {
            title: 'Agenda Pelayanan',
            value: '4 Sesi',
            unit: 'Minggu Ini',
            subtext: 'Ibadah Raya & Persekutuan',
            change: 'Ibadah Minggu & Kategorial',
            icon: CalendarDays,
            color: 'from-indigo-600 to-indigo-700',
            iconBg: 'bg-indigo-50 text-indigo-700',
        },
        {
            title: 'Pelayan & Pemusik',
            value: '42',
            unit: 'Orang',
            subtext: 'Sintua, Pemusik & Songleader',
            change: 'Siap melayani ibadah',
            icon: Music,
            color: 'from-purple-600 to-indigo-800',
            iconBg: 'bg-purple-50 text-purple-700',
        },
    ];

    const demographics = [
        { label: 'Wanita', count: 510, percent: 41, color: 'bg-pink-500', barColor: 'bg-pink-500' },
        { label: 'Pria', count: 480, percent: 38.5, color: 'bg-blue-600', barColor: 'bg-blue-600' },
        { label: 'Anak-anak', count: 120, percent: 9.6, color: 'bg-amber-500', barColor: 'bg-amber-500' },
        { label: 'Remaja / Naposo', count: 85, percent: 6.8, color: 'bg-emerald-500', barColor: 'bg-emerald-500' },
        { label: 'Lansia', count: 50, percent: 4.1, color: 'bg-purple-500', barColor: 'bg-purple-500' },
    ];

    const upcomingServices = [
        {
            title: 'Ibadah Minggu Pagi',
            time: '07.00 WIB',
            type: 'Bahasa Batak / Indonesia',
            target: 'Jemaat Umum (Wijk 1 - 4)',
            status: 'Terjadwal',
            icon: Sun,
        },
        {
            title: 'Ibadah Minggu Siang',
            time: '10.00 WIB',
            type: 'Bahasa Indonesia',
            target: 'Jemaat Umum (Wijk 5 - 8)',
            status: 'Terjadwal',
            icon: Clock,
        },
        {
            title: 'Sekolah Minggu',
            time: '07.00 & 10.00 WIB',
            type: 'Ibadah Anak',
            target: 'Anak Balita - Remaja Kelas 6',
            status: '2 Sesi',
            icon: BookOpen,
        },
        {
            title: 'Remaja / Naposobulung',
            time: 'Sabtu, 18.00 WIB',
            type: 'Persekutuan Pemuda',
            target: 'Remaja & Pemuda Gereja',
            status: 'Mingguan',
            icon: Users,
        },
    ];

    const ministryUpdates = [
        {
            dept: 'Marturia',
            title: 'Jadwal Pemusik Minggu Ini',
            desc: 'Pemusik & Songleader untuk Ibadah Minggu Pagi & Siang telah dikonfirmasi.',
            icon: Music,
            color: 'text-blue-600 bg-blue-50 border-blue-100',
            badge: 'Musik & Liturgi',
        },
        {
            dept: 'Koinonia',
            title: 'PA Seksi Parompuan & Ama',
            desc: 'Penelaahan Alkitab gabungan wilayah Citra Indah dilaksanakan hari Rabu.',
            icon: HeartHandshake,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
            badge: 'Persekutuan',
        },
        {
            dept: 'Diakonia',
            title: 'Kunjungan Pastoral & Doa',
            desc: 'Tim Diakonia menjadwalkan kunjungan jemaat yang sedang dalam pemulihan.',
            icon: HandHeart,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            badge: 'Kasih & Sosial',
        },
    ];

    return (
        <>
            <Head title="Dashboard - HKBP Citra Indah" />

            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
                {/* 1. Welcome Banner Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#173882] via-[#1e40af] to-[#2563eb] p-6 sm:p-8 text-white shadow-xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-white/5 blur-xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                                <span>Portal Pelayanan Gereja</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Horas, Selamat Datang, {auth.user?.name || 'Administrator'}!
                            </h1>
                            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                                Sistem Manajemen & Informasi Pelayanan HKBP Citra Indah Ressort Jonggol.
                                &quot;Melayani dengan Kasih, Bertumbuh dalam Iman, Berbuah bagi Sesama.&quot;
                            </p>
                        </div>

                        {/* Current Date Badge */}
                        <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/15">
                            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center text-white">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[11px] text-blue-200 uppercase font-medium">
                                    Kalender Pelayanan
                                </span>
                                <span className="text-sm font-bold text-white">
                                    Senin, 28 September 2026
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Top Summary Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {stats.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {item.title}
                                </span>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {item.value}
                                </span>
                                <span className="text-xs font-semibold text-slate-400">
                                    {item.unit}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                                <span>{item.subtext}</span>
                                <span className="font-medium text-emerald-600">{item.change}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Main Dashboard Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column (7 cols): Demografi & Sektor */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Demografi Jemaat Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-[#1e3a8a]">
                                        Demografi Jemaat
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Distribusi kategori jemaat terdaftar di HKBP Citra Indah
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    Total 1,245 Jiwa
                                </span>
                            </div>

                            {/* Stacked Progress Bar */}
                            <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden mb-6">
                                {demographics.map((item) => (
                                    <div
                                        key={item.label}
                                        style={{ width: `${item.percent}%` }}
                                        className={`${item.barColor} h-full transition-all`}
                                        title={`${item.label}: ${item.count} jiwa (${item.percent}%)`}
                                    />
                                ))}
                            </div>

                            {/* Category Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {demographics.map((item) => (
                                    <div
                                        key={item.label}
                                        className="bg-slate-50/70 rounded-xl p-3 border border-slate-100/80 flex flex-col"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                            <span className="text-xs font-medium text-slate-600 truncate">
                                                {item.label}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline justify-between mt-auto">
                                            <span className="text-lg font-bold text-slate-900">
                                                {item.count}
                                            </span>
                                            <span className="text-[11px] font-semibold text-slate-400">
                                                {item.percent}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/60 flex flex-col justify-center text-center">
                                    <span className="text-xs font-medium text-blue-700">Jumlah Wijk</span>
                                    <span className="text-lg font-extrabold text-[#1e3a8a]">8 Sektor</span>
                                </div>
                            </div>
                        </div>

                        {/* Jadwal Ibadah Terdekat Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-[#1e3a8a]">
                                        Jadwal Ibadah Minggu Ini
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Informasi jam dan sasaran ibadah jemaat
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Aktif
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {upcomingServices.map((service) => (
                                    <div
                                        key={service.title}
                                        className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <service.icon className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-slate-900 truncate">
                                                    {service.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {service.type} • {service.target}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="block text-xs font-bold text-[#1e3a8a] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-100">
                                                {service.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (5 cols): Seksi Pelayanan & Quick Info */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Renungan Singkat Hari Ini Card */}
                        <div className="bg-gradient-to-br from-blue-900 to-[#1e3a8a] rounded-2xl p-6 text-white shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                                    Manna Sorgawi
                                </span>
                                <span className="text-xs text-blue-200">
                                    Mazmur 23:1-2
                                </span>
                            </div>
                            <h3 className="text-lg font-serif font-bold text-white mb-2">
                                &quot;Tuhan adalah Gembalaku&quot;
                            </h3>
                            <p className="text-xs text-blue-100/90 italic font-serif leading-relaxed mb-4">
                                &quot;TUHAN adalah gembalaku, takkan kekurangan aku. Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang.&quot;
                            </p>
                            <Link
                                href="/#renungan"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-lg transition-colors"
                            >
                                <span>Lihat Renungan Lengkap</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Aktivitas Seksi Pelayanan (Marturia, Koinonia, Diakonia) */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex-1 flex flex-col">
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-[#1e3a8a]">
                                        Catatan Pelayanan
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Aktivitas Marturia, Koinonia, dan Diakonia
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3.5 flex-1">
                                {ministryUpdates.map((item) => (
                                    <div
                                        key={item.title}
                                        className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-[#1e3a8a]">
                                                {item.dept}
                                            </span>
                                            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                                {item.badge}
                                            </span>
                                        </div>
                                        <h4 className="text-xs font-bold text-slate-800 mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kontak & Sekretariat */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Sekretariat HKBP Citra Indah
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                Perumahan Citra Indah City, Kec. Jonggol, Kab. Bogor, Jawa Barat.
                            </p>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                <span className="text-slate-400">Email Resmi:</span>
                                <span className="font-semibold text-blue-700">sekretariat@hkbpcitraindah.org</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
