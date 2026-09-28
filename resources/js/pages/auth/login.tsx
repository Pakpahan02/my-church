import React, { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { HkbpLogo } from '@/components/hkbp-logo';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword?: boolean;
};

export default function Login({ status, canResetPassword = true }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Masuk - HKBP Citra Indah" />

            <PasskeyVerify />

            <div className="min-h-screen bg-[#f0f4f9] flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-blue-600 selection:text-white">
                {/* Status Message */}
                {status && (
                    <div className="mb-4 w-full max-w-[420px] rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center text-sm font-medium text-emerald-700 shadow-xs">
                        {status}
                    </div>
                )}

                {/* Login Card */}
                <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100/80 overflow-hidden transition-all duration-300">
                    <div className="p-8 sm:p-10 pb-8">
                        {/* Church Logo */}
                        <div className="flex justify-center mb-5">
                            <Link href={home()} className="group">
                                <HkbpLogo className="w-16 h-16 drop-shadow-sm group-hover:scale-105 transition-transform duration-200" />
                            </Link>
                        </div>

                        {/* Card Header */}
                        <div className="text-center mb-7">
                            <h1 className="text-2xl sm:text-[26px] font-bold text-[#1e3a8a] tracking-tight">
                                Selamat Datang
                            </h1>
                            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                                Silakan masuk ke portal jemaat
                                <br />
                                HKBP Citra Indah Jonggol
                            </p>
                        </div>

                        {/* Login Form */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Email Field */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5"
                                        >
                                            Alamat Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="nama@email.com"
                                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all duration-200"
                                            />
                                        </div>
                                        <InputError message={errors.email} className="mt-1.5" />
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5"
                                        >
                                            Kata Sandi
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all duration-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                tabIndex={-1}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-1.5" />
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition cursor-pointer"
                                            />
                                            <span className="text-xs sm:text-sm text-slate-600">
                                                Ingat Saya
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={request()}
                                                tabIndex={5}
                                                className="text-xs sm:text-sm font-medium text-[#1d4ed8] hover:text-blue-700 hover:underline transition-colors"
                                            >
                                                Lupa Kata Sandi?
                                            </Link>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        tabIndex={4}
                                        disabled={processing}
                                        className="w-full mt-3 py-3 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-semibold text-sm sm:text-base shadow-md shadow-blue-900/10 hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner className="text-white" />}
                                        <span>Masuk</span>
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Card Footer: Kembali ke Beranda */}
                    <div className="bg-slate-50/80 border-t border-slate-100 py-4 px-8 sm:px-10 text-center">
                        <Link
                            href={home()}
                            className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
