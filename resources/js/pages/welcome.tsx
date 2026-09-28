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
    const { auth } = usePage<{ auth: { user: { name: string; email: string } | null } }>().props;
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

            <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
                {/* ========================================================================= */}
                {/* 1. NAVBAR                                                                 */}
                {/* ========================================================================= */}
                <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            {/* Brand Logo & Name */}
                            <a href="#beranda" className="flex items-center gap-3.5 group">
                                <HkbpLogo className="w-11 h-11 shrink-0 group-hover:scale-105 transition-transform duration-200" />
                                <div className="flex flex-col">
                                    <span className="font-extrabold text-lg sm:text-xl text-[#1e3a8a] tracking-tight leading-tight">
                                        HKBP Citra Indah
                                    </span>
                                    <span className="text-xs font-medium text-slate-500 tracking-normal">
                                        Ressort Jonggol
                                    </span>
                                </div>
                            </a>

                            {/* Desktop Nav Items */}
                            <nav className="hidden md:flex items-center gap-8">
                                <a
                                    href="#beranda"
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    Beranda
                                </a>
                                <a
                                    href="#renungan"
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    Renungan
                                </a>
                                <a
                                    href="#layanan"
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    Layanan
                                </a>
                                <a
                                    href="#statistik"
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    Statistik
                                </a>

                                {/* Jadwal Ibadah Pill Button */}
                                <a
                                    href="#layanan"
                                    className="inline-flex items-center justify-center rounded-full bg-[#1d4ed8] hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all transform active:scale-95"
                                >
                                    Jadwal Ibadah
                                </a>

                                {/* User Auth Link (if logged in or for login) */}
                                {auth?.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-full transition-colors"
                                        title={`Masuk sebagai ${auth.user.name}`}
                                    >
                                        <UserCheck className="w-3.5 h-3.5" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors"
                                        title="Login Pengurus / Jemaat"
                                    >
                                        <LogIn className="w-3.5 h-3.5" />
                                        Masuk
                                    </Link>
                                )}
                            </nav>

                            {/* Mobile Menu Button */}
                            <div className="flex md:hidden items-center gap-3">
                                <a
                                    href="#layanan"
                                    className="rounded-full bg-[#1d4ed8] text-white font-medium text-xs px-3.5 py-2"
                                >
                                    Ibadah
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 focus:outline-hidden"
                                    aria-label="Buka menu navigasi"
                                >
                                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
                            <a
                                href="#beranda"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                            >
                                Beranda
                            </a>
                            <a
                                href="#renungan"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                            >
                                Renungan
                            </a>
                            <a
                                href="#layanan"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                            >
                                Layanan
                            </a>
                            <a
                                href="#statistik"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                            >
                                Statistik
                            </a>
                            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                                <a
                                    href="#layanan"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center rounded-full bg-[#1d4ed8] text-white font-medium py-2.5 text-sm"
                                >
                                    Jadwal Ibadah
                                </a>
                                {auth?.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="w-full text-center rounded-full bg-slate-100 text-slate-800 font-medium py-2 text-sm"
                                    >
                                        Buka Dashboard ({auth.user.name})
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="w-full text-center rounded-full border border-slate-200 text-slate-700 font-medium py-2 text-sm"
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
                    className="relative min-h-[600px] lg:min-h-[680px] flex items-center justify-center overflow-hidden bg-slate-900"
                >
                    {/* Background Image with Deep Blue Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                        style={{ backgroundImage: `url('/images/hero-bg.jpg')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0b2158]/90 via-[#123b8c]/85 to-[#1d4ed8]/90 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-radial from-transparent via-[#0d2869]/40 to-[#06153b]/85" />

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center text-white">
                        {/* Emblem Logo */}
                        <div className="inline-flex p-2 rounded-full bg-white/10 backdrop-blur-md shadow-2xl mb-6 ring-1 ring-white/20">
                            <HkbpLogo className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-2xl" />
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
                            <span className="block text-white">Selamat Datang di</span>
                            <span className="block mt-1 text-white font-black">
                                HKBP Citra Indah
                            </span>
                        </h1>

                        {/* Slogan */}
                        <p className="mt-6 text-sm sm:text-base lg:text-lg text-blue-100/95 max-w-2xl mx-auto leading-relaxed drop-shadow-xs font-normal">
                            &quot;Melayani dengan Kasih, Bertumbuh dalam Iman, Berbuah bagi Sesama.&quot;
                            <br className="hidden sm:inline" />{' '}
                            Mari bergabung bersama kami dalam persekutuan dan ibadah.
                        </p>

                        {/* Call-to-Action Buttons */}
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="#layanan"
                                className="rounded-full bg-white text-[#123b8c] hover:bg-blue-50 font-bold px-7 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Lihat Layanan
                            </a>
                            <a
                                href="#renungan"
                                className="rounded-full bg-[#0d255c]/60 text-white border border-white/25 backdrop-blur-md hover:bg-[#0d255c]/90 font-semibold px-7 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Renungan Hari Ini
                            </a>
                        </div>
                    </div>

                    {/* Wave Divider to Next Section */}
                    <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
                        <svg
                            className="relative block w-full h-10 sm:h-16 lg:h-24 text-white"
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
                <section id="renungan" className="py-20 sm:py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] tracking-tight">
                                Renungan Harian
                            </h2>
                            <div className="w-12 h-1 bg-[#1d4ed8] rounded-full mx-auto my-3" />
                            <p className="text-slate-500 text-sm sm:text-base">
                                Santapan rohani untuk menemani langkah Anda hari ini.
                            </p>
                        </div>

                        {/* Devotional Card */}
                        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden p-6 sm:p-10 transition-all hover:shadow-2xl">
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1d4ed8]">
                                    MANNA SORGAWI
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    Senin, 28 Sep 2026
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="text-center">
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1 font-serif">
                                    Tuhan adalah Gembalaku
                                </h3>
                                <p className="text-[#1d4ed8] text-sm font-semibold mb-6">
                                    Mazmur 23:1-2
                                </p>

                                {/* Scripture Quote */}
                                <blockquote className="text-slate-700 italic font-serif text-sm sm:text-base leading-relaxed mb-6 px-2 sm:px-6">
                                    &quot;TUHAN adalah gembalaku, takkan kekurangan aku. Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang.&quot;
                                </blockquote>

                                {/* Reflection Body */}
                                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4 text-left mb-8">
                                    <p>
                                        Dalam kebisingan dunia modern yang penuh tuntutan, kita sering merasa lelah, cemas, dan merasa kurang. Daud mengingatkan kita pada satu kebenaran yang membebaskan: ketika Tuhan menjadi Gembala kita, Ia bertanggung jawab penuh atas hidup kita.
                                    </p>
                                    <p>
                                        Tuhan tidak hanya memberikan apa yang kita butuhkan, tetapi Ia juga memberikan kedamaian sejati—rumput hijau dan air yang tenang. Hari ini, izinkan Sang Gembala Agung menuntun langkah Anda. Berhentilah sejenak, nikmati penyertaan-Nya, dan percayalah bahwa dalam Dia, Anda tidak akan pernah kekurangan.
                                    </p>
                                </div>

                                {/* Share Action Button */}
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleShareDevotional}
                                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1d4ed8] hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-6 py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 text-emerald-600" />
                                                <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Share2 className="w-4 h-4" />
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
                <section id="layanan" className="py-20 bg-slate-50/60 border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-14">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] tracking-tight">
                                Layanan Gereja
                            </h2>
                            <div className="w-12 h-1 bg-[#1d4ed8] rounded-full mx-auto my-3" />
                            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
                                Kami mengundang seluruh jemaat untuk hadir dan bersekutu bersama dalam berbagai layanan ibadah yang tersedia.
                            </p>
                        </div>

                        {/* Services Grid (4 Cards) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {/* Card 1: Ibadah Minggu Pagi */}
                            <div className="bg-white rounded-2xl p-7 flex flex-col items-center text-center shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1d4ed8] flex items-center justify-center mb-5 ring-8 ring-blue-50/60 group-hover:scale-110 transition-transform">
                                    <Sun className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                                    Ibadah Minggu Pagi
                                </h3>
                                <p className="text-slate-500 text-xs text-center mb-6 leading-relaxed">
                                    Ibadah Umum Bahasa Batak/Indonesia
                                </p>
                                <span className="mt-auto inline-block border border-blue-200 text-[#1d4ed8] bg-blue-50/50 text-xs font-semibold px-4 py-1.5 rounded-full">
                                    Pukul 07.00 WIB
                                </span>
                            </div>

                            {/* Card 2: Ibadah Minggu Siang */}
                            <div className="bg-white rounded-2xl p-7 flex flex-col items-center text-center shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1d4ed8] flex items-center justify-center mb-5 ring-8 ring-blue-50/60 group-hover:scale-110 transition-transform">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                                    Ibadah Minggu Siang
                                </h3>
                                <p className="text-slate-500 text-xs text-center mb-6 leading-relaxed">
                                    Ibadah Umum Bahasa Indonesia
                                </p>
                                <span className="mt-auto inline-block border border-blue-200 text-[#1d4ed8] bg-blue-50/50 text-xs font-semibold px-4 py-1.5 rounded-full">
                                    Pukul 10.00 WIB
                                </span>
                            </div>

                            {/* Card 3: Sekolah Minggu */}
                            <div className="bg-white rounded-2xl p-7 flex flex-col items-center text-center shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1d4ed8] flex items-center justify-center mb-5 ring-8 ring-blue-50/60 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                                    Sekolah Minggu
                                </h3>
                                <p className="text-slate-500 text-xs text-center mb-6 leading-relaxed">
                                    Ibadah khusus anak-anak sekolah minggu
                                </p>
                                <span className="mt-auto inline-block border border-blue-200 text-[#1d4ed8] bg-blue-50/50 text-xs font-semibold px-4 py-1.5 rounded-full">
                                    Pukul 07.00 & 10.00 WIB
                                </span>
                            </div>

                            {/* Card 4: Remaja / Naposobulung */}
                            <div className="bg-white rounded-2xl p-7 flex flex-col items-center text-center shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1d4ed8] flex items-center justify-center mb-5 ring-8 ring-blue-50/60 group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                                    Remaja / Naposobulung
                                </h3>
                                <p className="text-slate-500 text-xs text-center mb-6 leading-relaxed">
                                    Persekutuan pemuda dan remaja gereja
                                </p>
                                <span className="mt-auto inline-block border border-blue-200 text-[#1d4ed8] bg-blue-50/50 text-xs font-semibold px-4 py-1.5 rounded-full">
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
                    className="py-20 sm:py-24 bg-gradient-to-b from-[#1b3f8e] via-[#1a3b85] to-[#153272] text-white relative overflow-hidden"
                >
                    {/* Subtle decorative background circles */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-10">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Statistik Jemaat
                            </h2>
                            <div className="w-12 h-1 bg-blue-300 rounded-full mx-auto my-3" />
                            <p className="text-blue-100/90 text-sm sm:text-base max-w-xl mx-auto">
                                Informasi jumlah pelayan dan jemaat yang diberkati di HKBP Citra Indah Jonggol.
                            </p>
                        </div>

                        {/* Top Highlight Card: TOTAL JEMAAT */}
                        <div className="max-w-xs mx-auto bg-blue-900/40 border border-blue-400/20 backdrop-blur-md rounded-2xl p-6 text-center shadow-2xl shadow-blue-950/40 mb-8 hover:bg-blue-900/50 transition-colors">
                            <span className="text-xs uppercase tracking-wider font-semibold text-blue-200 block mb-1">
                                TOTAL JEMAAT
                            </span>
                            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none my-1">
                                1,245
                            </div>
                            <span className="text-xs text-blue-200 font-medium">
                                Jiwa
                            </span>
                        </div>

                        {/* 5 Sub-category Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
                            {/* Pria */}
                            <div className="bg-blue-900/30 border border-blue-400/15 backdrop-blur-sm rounded-xl py-5 px-4 text-center hover:bg-blue-800/40 transition-colors">
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
                                    480
                                </div>
                                <div className="text-xs font-medium text-blue-200">
                                    Pria
                                </div>
                            </div>

                            {/* Wanita */}
                            <div className="bg-blue-900/30 border border-blue-400/15 backdrop-blur-sm rounded-xl py-5 px-4 text-center hover:bg-blue-800/40 transition-colors">
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
                                    510
                                </div>
                                <div className="text-xs font-medium text-blue-200">
                                    Wanita
                                </div>
                            </div>

                            {/* Anak-anak */}
                            <div className="bg-blue-900/30 border border-blue-400/15 backdrop-blur-sm rounded-xl py-5 px-4 text-center hover:bg-blue-800/40 transition-colors">
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
                                    120
                                </div>
                                <div className="text-xs font-medium text-blue-200">
                                    Anak-anak
                                </div>
                            </div>

                            {/* Remaja/Pemuda */}
                            <div className="bg-blue-900/30 border border-blue-400/15 backdrop-blur-sm rounded-xl py-5 px-4 text-center hover:bg-blue-800/40 transition-colors">
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
                                    85
                                </div>
                                <div className="text-xs font-medium text-blue-200">
                                    Remaja/Pemuda
                                </div>
                            </div>

                            {/* Lansia */}
                            <div className="col-span-2 sm:col-span-1 bg-blue-900/30 border border-blue-400/15 backdrop-blur-sm rounded-xl py-5 px-4 text-center hover:bg-blue-800/40 transition-colors">
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
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
                <footer className="bg-[#0b1120] text-slate-300 border-t border-slate-800">
                    <div className="max-w-6xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* Column 1: Church Identity */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <HkbpLogo className="w-9 h-9 shrink-0" />
                                    <span className="font-extrabold text-lg text-white tracking-tight">
                                        HKBP Citra Indah
                                    </span>
                                </div>
                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                                    Gereja Huria Kristen Batak Protestan Ressort Jonggol, melayani jemaat di kawasan Citra Indah City dan sekitarnya dengan kasih Kristus.
                                </p>
                            </div>

                            {/* Column 2: Hubungi Kami */}
                            <div>
                                <h4 className="text-white font-bold text-sm tracking-wide mb-4">
                                    Hubungi Kami
                                </h4>
                                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
                                    <li className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                        <span>
                                            Perumahan Citra Indah City, Kecamatan Jonggol, Kab. Bogor, Jawa Barat
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                                        <a
                                            href="mailto:sekretariat@hkbpcitraindah.org"
                                            className="hover:text-blue-300 transition-colors"
                                        >
                                            sekretariat@hkbpcitraindah.org
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Column 3: Sosial Media */}
                            <div>
                                <h4 className="text-white font-bold text-sm tracking-wide mb-4">
                                    Sosial Media
                                </h4>
                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                                    Ikuti kegiatan kami melalui platform sosial media resmi gereja.
                                </p>
                                {/* Social Media Icons */}
                                <div className="flex items-center gap-3">
                                    {/* Facebook */}
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs"
                                        aria-label="Facebook HKBP Citra Indah"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                        </svg>
                                    </a>

                                    {/* Instagram */}
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs"
                                        aria-label="Instagram HKBP Citra Indah"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>

                                    {/* YouTube */}
                                    <a
                                        href="https://youtube.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs"
                                        aria-label="YouTube HKBP Citra Indah"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar: Copyright & Policies */}
                        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                            <p>© 2026 HKBP Citra Indah Jonggol. All rights reserved.</p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-slate-400 transition-colors">
                                    Kebijakan Privasi
                                </a>
                                <a href="#" className="hover:text-slate-400 transition-colors">
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
