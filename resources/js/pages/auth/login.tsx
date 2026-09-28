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

            <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f4f9] p-4 font-sans selection:bg-blue-600 selection:text-white sm:p-6">
                {/* Status Message */}
                {status && (
                    <div className="mb-4 w-full max-w-[420px] rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700 shadow-xs">
                        {status}
                    </div>
                )}

                {/* Login Card */}
                <div className="w-full max-w-[420px] overflow-hidden rounded-3xl border border-slate-100/80 bg-white shadow-xl shadow-slate-200/60 transition-all duration-300">
                    <div className="p-8 pb-8 sm:p-10">
                        {/* Church Logo */}
                        <div className="mb-5 flex justify-center">
                            <Link href={home()} className="group">
                                <HkbpLogo className="h-16 w-16 drop-shadow-sm transition-transform duration-200 group-hover:scale-105" />
                            </Link>
                        </div>

                        {/* Card Header */}
                        <div className="mb-7 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-[#1e3a8a] sm:text-[26px]">
                                Selamat Datang
                            </h1>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
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
                                            className="mb-1.5 block text-xs font-medium text-slate-700 sm:text-sm"
                                        >
                                            Alamat Email
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <Mail className="h-4 w-4" />
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
                                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-3.5 pl-10 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.email}
                                            className="mt-1.5"
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="mb-1.5 block text-xs font-medium text-slate-700 sm:text-sm"
                                        >
                                            Kata Sandi
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <Lock className="h-4 w-4" />
                                            </div>
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                tabIndex={-1}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                                                aria-label={
                                                    showPassword
                                                        ? 'Sembunyikan kata sandi'
                                                        : 'Tampilkan kata sandi'
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError
                                            message={errors.password}
                                            className="mt-1.5"
                                        />
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between pt-1">
                                        <label className="flex cursor-pointer items-center gap-2 select-none">
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 transition focus:ring-blue-500 focus:ring-offset-0"
                                            />
                                            <span className="text-xs text-slate-600 sm:text-sm">
                                                Ingat Saya
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={request()}
                                                tabIndex={5}
                                                className="text-xs font-medium text-[#1d4ed8] transition-colors hover:text-blue-700 hover:underline sm:text-sm"
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
                                        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all duration-200 hover:bg-[#172554] hover:shadow-lg active:scale-[0.99] disabled:opacity-70 sm:text-base"
                                        data-test="login-button"
                                    >
                                        {processing && (
                                            <Spinner className="text-white" />
                                        )}
                                        <span>Masuk</span>
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Card Footer: Kembali ke Beranda */}
                    <div className="border-t border-slate-100 bg-slate-50/80 px-8 py-4 text-center sm:px-10">
                        <Link
                            href={home()}
                            className="inline-flex items-center justify-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-800 sm:text-sm"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
