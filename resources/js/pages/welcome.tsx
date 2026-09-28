import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { HkbpLogo } from '@/components/hkbp-logo';
import {
    Sun,
    Clock,
    BookOpen,
    Users,
    MapPin,
    Mail,
    Share2,
    Check,
    Menu,
    X,
    Calendar,
    ArrowRight,
    LogIn,
    UserCheck,
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<{
        auth: { user: { name: string; email: string } | null };
    }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Share devotional function
    const handleShareDevotional = async () => {
        const shareData = {
            title: 'Renungan Harian - HKBP Citra Indah',
            text: 'Tuhan adalah Gembalaku (Mazmur 23:1-2) - "TUHAN adalah gembalaku, takkan kekurangan aku. Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang."',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // User cancelled or share failed, fallback to copy
                copyToClipboard(shareData.text);
            }
        } else {
            copyToClipboard(shareData.text);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <>
            <Head>
                <title>HKBP Citra Indah - Ressort Jonggol</title>
                <meta
                    name="description"
                    content="Situs resmi HKBP Citra Indah Ressort Jonggol. Melayani dengan kasih, bertumbuh dalam iman, berbuah bagi sesama."
                />
            </Head>

            <div className="min-h-screen scroll-smooth bg-white font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
                {/* ========================================================================= */}
                {/* 1. NAVBAR                                                                 */}
                {/* ========================================================================= */}
                <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-xs backdrop-blur-md transition-all">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            {/* Brand Logo & Name */}
                            <a
                                href="#beranda"
                                className="group flex items-center gap-3.5"
                            >
                                <HkbpLogo className="h-11 w-11 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                                <div className="flex flex-col">
                                    <span className="text-lg leading-tight font-extrabold tracking-tight text-[#1e3a8a] sm:text-xl">
                                        HKBP Citra Indah
                                    </span>
                                    <span className="text-xs font-medium tracking-normal text-slate-500">
                                        Ressort Jonggol
                                    </span>
                                </div>
                            </a>

                            {/* Desktop Nav Items */}
                            <nav className="hidden items-center gap-8 md:flex">
                                <a
                                    href="#beranda"
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                                >
                                    Beranda
                                </a>
                                <a
                                    href="#renungan"
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                                >
                                    Renungan
                                </a>
                                <a
                                    href="#layanan"
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                                >
                                    Layanan
                                </a>
                                <a
                                    href="#statistik"
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                                >
                                    Statistik
                                </a>

                                {/* Jadwal Ibadah Pill Button */}
                                <a
                                    href="#layanan"
                                    className="inline-flex transform items-center justify-center rounded-full bg-[#1d4ed8] px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
                                >
                                    Jadwal Ibadah
                                </a>

                                {/* User Auth Link (if logged in or for login) */}
                                {auth?.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                                        title={`Masuk sebagai ${auth.user.name}`}
                                    >
                                        <UserCheck className="h-3.5 w-3.5" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-blue-700"
                                        title="Login Pengurus / Jemaat"
                                    >
                                        <LogIn className="h-3.5 w-3.5" />
                                        Masuk
                                    </Link>
                                )}
                            </nav>

                            {/* Mobile Menu Button */}
                            <div className="flex items-center gap-3 md:hidden">
                                <a
                                    href="#layanan"
                                    className="rounded-full bg-[#1d4ed8] px-3.5 py-2 text-xs font-medium text-white"
                                >
                                    Ibadah
                                </a>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileMenuOpen(!mobileMenuOpen)
                                    }
                                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 focus:outline-hidden"
                                    aria-label="Buka menu navigasi"
                                >
                                    {mobileMenuOpen ? (
                                        <X className="h-6 w-6" />
                                    ) : (
                                        <Menu className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {mobileMenuOpen && (
                        <div className="animate-in space-y-3 border-b border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl duration-200 slide-in-from-top-2 md:hidden">
                            <a
                                href="#beranda"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                                Beranda
                            </a>
                            <a
                                href="#renungan"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                                Renungan
                            </a>
                            <a
                                href="#layanan"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                                Layanan
                            </a>
                            <a
                                href="#statistik"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                                Statistik
                            </a>
                            <div className="flex flex-col gap-2 border-t border-slate-100 pt-2">
                                <a
                                    href="#layanan"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full rounded-full bg-[#1d4ed8] py-2.5 text-center text-sm font-medium text-white"
                                >
                                    Jadwal Ibadah
                                </a>
                                {auth?.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="w-full rounded-full bg-slate-100 py-2 text-center text-sm font-medium text-slate-800"
                                    >
                                        Buka Dashboard ({auth.user.name})
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="w-full rounded-full border border-slate-200 py-2 text-center text-sm font-medium text-slate-700"
                                    >
                                        Masuk Akun
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* ========================================================================= */}
                {/* 2. HERO SECTION                                                           */}
                {/* ========================================================================= */}
                <section
                    id="beranda"
                    className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-slate-900 lg:min-h-[680px]"
                >
                    {/* Background Image with Deep Blue Overlay */}
                    <div
                        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
                        style={{
                            backgroundImage: `url('/images/hero-bg.jpg')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0b2158]/90 via-[#123b8c]/85 to-[#1d4ed8]/90 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-radial from-transparent via-[#0d2869]/40 to-[#06153b]/85" />

                    {/* Hero Content */}
                    <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center text-white sm:px-6 sm:py-32 lg:px-8">
                        {/* Emblem Logo */}
                        <div className="mb-6 inline-flex rounded-full bg-white/10 p-2 shadow-2xl ring-1 ring-white/20 backdrop-blur-md">
                            <HkbpLogo className="h-16 w-16 drop-shadow-2xl sm:h-20 sm:w-20" />
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md sm:text-5xl lg:text-6xl">
                            <span className="block text-white">
                                Selamat Datang di
                            </span>
                            <span className="mt-1 block font-black text-white">
                                HKBP Citra Indah
                            </span>
                        </h1>

                        {/* Slogan */}
                        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed font-normal text-blue-100/95 drop-shadow-xs sm:text-base lg:text-lg">
                            &quot;Melayani dengan Kasih, Bertumbuh dalam Iman,
                            Berbuah bagi Sesama.&quot;
                            <br className="hidden sm:inline" /> Mari bergabung
                            bersama kami dalam persekutuan dan ibadah.
                        </p>

                        {/* Call-to-Action Buttons */}
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="#layanan"
                                className="transform rounded-full bg-white px-7 py-3 text-sm font-bold text-[#123b8c] shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-2xl active:translate-y-0 sm:px-8 sm:py-3.5 sm:text-base"
                            >
                                Lihat Layanan
                            </a>
                            <a
                                href="#renungan"
                                className="transform rounded-full border border-white/25 bg-[#0d255c]/60 px-7 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0d255c]/90 active:translate-y-0 sm:px-8 sm:py-3.5 sm:text-base"
                            >
                                Renungan Hari Ini
                            </a>
                        </div>
                    </div>

                    {/* Wave Divider to Next Section */}
                    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 w-full overflow-hidden leading-none">
                        <svg
                            className="relative block h-10 w-full text-white sm:h-16 lg:h-24"
                            viewBox="0 0 1440 120"
                            preserveAspectRatio="none"
                            fill="currentColor"
                        >
                            <path d="M0,40 C320,120 720,0 1140,80 C1280,105 1380,95 1440,80 L1440,120 L0,120 Z" />
                        </svg>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* 3. RENUNGAN HARIAN                                                        */}
                {/* ========================================================================= */}
                <section
                    id="renungan"
                    className="relative bg-white py-20 sm:py-24"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="mb-12 text-center">
                            <h2 className="text-2xl font-extrabold tracking-tight text-[#1e3a8a] sm:text-3xl">
                                Renungan Harian
                            </h2>
                            <div className="mx-auto my-3 h-1 w-12 rounded-full bg-[#1d4ed8]" />
                            <p className="text-sm text-slate-500 sm:text-base">
                                Santapan rohani untuk menemani langkah Anda hari
                                ini.
                            </p>
                        </div>

                        {/* Devotional Card */}
                        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 transition-all hover:shadow-2xl sm:p-10">
                            {/* Card Header */}
                            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                                <span className="text-xs font-bold tracking-wider text-[#1d4ed8] uppercase">
                                    MANNA SORGAWI
                                </span>
                                <span className="text-xs font-medium text-slate-400">
                                    Senin, 28 Sep 2026
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="text-center">
                                <h3 className="mb-1 font-serif text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                    Tuhan adalah Gembalaku
                                </h3>
                                <p className="mb-6 text-sm font-semibold text-[#1d4ed8]">
                                    Mazmur 23:1-2
                                </p>

                                {/* Scripture Quote */}
                                <blockquote className="mb-6 px-2 font-serif text-sm leading-relaxed text-slate-700 italic sm:px-6 sm:text-base">
                                    &quot;TUHAN adalah gembalaku, takkan
                                    kekurangan aku. Ia membaringkan aku di
                                    padang yang berumput hijau, Ia membimbing
                                    aku ke air yang tenang.&quot;
                                </blockquote>

                                {/* Reflection Body */}
                                <div className="mb-8 space-y-4 text-left text-xs leading-relaxed text-slate-600 sm:text-sm">
                                    <p>
                                        Dalam kebisingan dunia modern yang penuh
                                        tuntutan, kita sering merasa lelah,
                                        cemas, dan merasa kurang. Daud
                                        mengingatkan kita pada satu kebenaran
                                        yang membebaskan: ketika Tuhan menjadi
                                        Gembala kita, Ia bertanggung jawab penuh
                                        atas hidup kita.
                                    </p>
                                    <p>
                                        Tuhan tidak hanya memberikan apa yang
                                        kita butuhkan, tetapi Ia juga memberikan
                                        kedamaian sejati—rumput hijau dan air
                                        yang tenang. Hari ini, izinkan Sang
                                        Gembala Agung menuntun langkah Anda.
                                        Berhentilah sejenak, nikmati
                                        penyertaan-Nya, dan percayalah bahwa
                                        dalam Dia, Anda tidak akan pernah
                                        kekurangan.
                                    </p>
                                </div>

                                {/* Share Action Button */}
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleShareDevotional}
                                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-blue-50/80 px-6 py-2.5 text-xs font-semibold text-[#1d4ed8] shadow-xs transition-all duration-200 hover:bg-blue-100/80 hover:text-blue-700 active:scale-95 sm:text-sm"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4 text-emerald-600" />
                                                <span className="text-emerald-700">
                                                    Tersalin ke Clipboard!
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Share2 className="h-4 w-4" />
                                                <span>Bagikan Renungan</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* 4. LAYANAN GEREJA                                                         */}
                {/* ========================================================================= */}
                <section
                    id="layanan"
                    className="border-t border-slate-100 bg-slate-50/60 py-20"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="mb-14 text-center">
                            <h2 className="text-2xl font-extrabold tracking-tight text-[#1e3a8a] sm:text-3xl">
                                Layanan Gereja
                            </h2>
                            <div className="mx-auto my-3 h-1 w-12 rounded-full bg-[#1d4ed8]" />
                            <p className="mx-auto max-w-xl text-sm text-slate-500 sm:text-base">
                                Kami mengundang seluruh jemaat untuk hadir dan
                                bersekutu bersama dalam berbagai layanan ibadah
                                yang tersedia.
                            </p>
                        </div>

                        {/* Services Grid (4 Cards) */}
                        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Card 1: Ibadah Minggu Pagi */}
                            <div className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#1d4ed8] ring-8 ring-blue-50/60 transition-transform group-hover:scale-110">
                                    <Sun className="h-6 w-6" />
                                </div>
                                <h3 className="mb-1.5 text-base font-bold text-slate-900">
                                    Ibadah Minggu Pagi
                                </h3>
                                <p className="mb-6 text-center text-xs leading-relaxed text-slate-500">
                                    Ibadah Umum Bahasa Batak/Indonesia
                                </p>
                                <span className="mt-auto inline-block rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold text-[#1d4ed8]">
                                    Pukul 07.00 WIB
                                </span>
                            </div>

                            {/* Card 2: Ibadah Minggu Siang */}
                            <div className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#1d4ed8] ring-8 ring-blue-50/60 transition-transform group-hover:scale-110">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <h3 className="mb-1.5 text-base font-bold text-slate-900">
                                    Ibadah Minggu Siang
                                </h3>
                                <p className="mb-6 text-center text-xs leading-relaxed text-slate-500">
                                    Ibadah Umum Bahasa Indonesia
                                </p>
                                <span className="mt-auto inline-block rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold text-[#1d4ed8]">
                                    Pukul 10.00 WIB
                                </span>
                            </div>

                            {/* Card 3: Sekolah Minggu */}
                            <div className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#1d4ed8] ring-8 ring-blue-50/60 transition-transform group-hover:scale-110">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <h3 className="mb-1.5 text-base font-bold text-slate-900">
                                    Sekolah Minggu
                                </h3>
                                <p className="mb-6 text-center text-xs leading-relaxed text-slate-500">
                                    Ibadah khusus anak-anak sekolah minggu
                                </p>
                                <span className="mt-auto inline-block rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold text-[#1d4ed8]">
                                    Pukul 07.00 & 10.00 WIB
                                </span>
                            </div>

                            {/* Card 4: Remaja / Naposobulung */}
                            <div className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#1d4ed8] ring-8 ring-blue-50/60 transition-transform group-hover:scale-110">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="mb-1.5 text-base font-bold text-slate-900">
                                    Remaja / Naposobulung
                                </h3>
                                <p className="mb-6 text-center text-xs leading-relaxed text-slate-500">
                                    Persekutuan pemuda dan remaja gereja
                                </p>
                                <span className="mt-auto inline-block rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold text-[#1d4ed8]">
                                    Sabtu, Pukul 18.00 WIB
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* 5. STATISTIK JEMAAT                                                       */}
                {/* ========================================================================= */}
                <section
                    id="statistik"
                    className="relative overflow-hidden bg-gradient-to-b from-[#1b3f8e] via-[#1a3b85] to-[#153272] py-20 text-white sm:py-24"
                >
                    {/* Subtle decorative background circles */}
                    <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                Statistik Jemaat
                            </h2>
                            <div className="mx-auto my-3 h-1 w-12 rounded-full bg-blue-300" />
                            <p className="mx-auto max-w-xl text-sm text-blue-100/90 sm:text-base">
                                Informasi jumlah pelayan dan jemaat yang
                                diberkati di HKBP Citra Indah Jonggol.
                            </p>
                        </div>

                        {/* Top Highlight Card: TOTAL JEMAAT */}
                        <div className="mx-auto mb-8 max-w-xs rounded-2xl border border-blue-400/20 bg-blue-900/40 p-6 text-center shadow-2xl shadow-blue-950/40 backdrop-blur-md transition-colors hover:bg-blue-900/50">
                            <span className="mb-1 block text-xs font-semibold tracking-wider text-blue-200 uppercase">
                                TOTAL JEMAAT
                            </span>
                            <div className="my-1 text-4xl leading-none font-black tracking-tight text-white sm:text-5xl">
                                1,245
                            </div>
                            <span className="text-xs font-medium text-blue-200">
                                Jiwa
                            </span>
                        </div>

                        {/* 5 Sub-category Cards */}
                        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {/* Pria */}
                            <div className="rounded-xl border border-blue-400/15 bg-blue-900/30 px-4 py-5 text-center backdrop-blur-sm transition-colors hover:bg-blue-800/40">
                                <div className="mb-0.5 text-2xl font-bold text-white sm:text-3xl">
                                    480
                                </div>
                                <div className="text-xs font-medium text-blue-200">
                                    Pria
                                </div>
                            </div>

                            {/* Wanita */}
                            <div className="rounded-xl border border-blue-400/15 bg-blue-900/30 px-4 py-5 text-center backdrop-blur-sm transition-colors hover:bg-blue-800/40">
                                <div className="mb-0.5 text-2xl font-bold text-white sm:text-3xl">
                                    510
                                </div>
                                <div className="text-xs font-medium text-blue-200">
                                    Wanita
                                </div>
                            </div>

                            {/* Anak-anak */}
                            <div className="rounded-xl border border-blue-400/15 bg-blue-900/30 px-4 py-5 text-center backdrop-blur-sm transition-colors hover:bg-blue-800/40">
                                <div className="mb-0.5 text-2xl font-bold text-white sm:text-3xl">
                                    120
                                </div>
                                <div className="text-xs font-medium text-blue-200">
                                    Anak-anak
                                </div>
                            </div>

                            {/* Remaja/Pemuda */}
                            <div className="rounded-xl border border-blue-400/15 bg-blue-900/30 px-4 py-5 text-center backdrop-blur-sm transition-colors hover:bg-blue-800/40">
                                <div className="mb-0.5 text-2xl font-bold text-white sm:text-3xl">
                                    85
                                </div>
                                <div className="text-xs font-medium text-blue-200">
                                    Remaja/Pemuda
                                </div>
                            </div>

                            {/* Lansia */}
                            <div className="col-span-2 rounded-xl border border-blue-400/15 bg-blue-900/30 px-4 py-5 text-center backdrop-blur-sm transition-colors hover:bg-blue-800/40 sm:col-span-1">
                                <div className="mb-0.5 text-2xl font-bold text-white sm:text-3xl">
                                    50
                                </div>
                                <div className="text-xs font-medium text-blue-200">
                                    Lansia
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* 6. FOOTER                                                                 */}
                {/* ========================================================================= */}
                <footer className="border-t border-slate-800 bg-[#0b1120] text-slate-300">
                    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                            {/* Column 1: Church Identity */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <HkbpLogo className="h-9 w-9 shrink-0" />
                                    <span className="text-lg font-extrabold tracking-tight text-white">
                                        HKBP Citra Indah
                                    </span>
                                </div>
                                <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-sm">
                                    Gereja Huria Kristen Batak Protestan Ressort
                                    Jonggol, melayani jemaat di kawasan Citra
                                    Indah City dan sekitarnya dengan kasih
                                    Kristus.
                                </p>
                            </div>

                            {/* Column 2: Hubungi Kami */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold tracking-wide text-white">
                                    Hubungi Kami
                                </h4>
                                <ul className="space-y-3.5 text-xs text-slate-400 sm:text-sm">
                                    <li className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                                        <span>
                                            Perumahan Citra Indah City,
                                            Kecamatan Jonggol, Kab. Bogor, Jawa
                                            Barat
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                                        <a
                                            href="mailto:sekretariat@hkbpcitraindah.org"
                                            className="transition-colors hover:text-blue-300"
                                        >
                                            sekretariat@hkbpcitraindah.org
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Column 3: Sosial Media */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold tracking-wide text-white">
                                    Sosial Media
                                </h4>
                                <p className="mb-4 text-xs leading-relaxed text-slate-400 sm:text-sm">
                                    Ikuti kegiatan kami melalui platform sosial
                                    media resmi gereja.
                                </p>
                                {/* Social Media Icons */}
                                <div className="flex items-center gap-3">
                                    {/* Facebook */}
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 shadow-xs transition-all duration-200 hover:bg-blue-600 hover:text-white"
                                        aria-label="Facebook HKBP Citra Indah"
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                        </svg>
                                    </a>

                                    {/* Instagram */}
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 shadow-xs transition-all duration-200 hover:bg-pink-600 hover:text-white"
                                        aria-label="Instagram HKBP Citra Indah"
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>

                                    {/* YouTube */}
                                    <a
                                        href="https://youtube.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 shadow-xs transition-all duration-200 hover:bg-red-600 hover:text-white"
                                        aria-label="YouTube HKBP Citra Indah"
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar: Copyright & Policies */}
                        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-500 sm:flex-row">
                            <p>
                                © 2026 HKBP Citra Indah Jonggol. All rights
                                reserved.
                            </p>
                            <div className="flex items-center gap-6">
                                <a
                                    href="#"
                                    className="transition-colors hover:text-slate-400"
                                >
                                    Kebijakan Privasi
                                </a>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-slate-400"
                                >
                                    Syarat & Ketentuan
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
