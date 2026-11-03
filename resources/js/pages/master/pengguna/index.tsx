import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    UserCog,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    AlertCircle,
    X,
    ChevronLeft,
    ChevronRight,
    Shield,
    Loader2,
    Eye,
    EyeOff,
    Mail,
    User,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Role {
    value: string;
    label: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: UserData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Props {
    users: PaginatedUsers;
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
}

const roleBadgeColors: Record<string, string> = {
    'super-admin':
        'bg-indigo-100 text-indigo-700 ring-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:ring-indigo-800/50',
    pendeta:
        'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-800/50',
    sekretaris:
        'bg-orange-100 text-orange-700 ring-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:ring-orange-800/50',
    bendahara:
        'bg-orange-100 text-orange-700 ring-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:ring-orange-800/50',
    marturia:
        'bg-teal-100 text-teal-700 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:ring-teal-800/50',
    koinonia:
        'bg-lime-100 text-lime-700 ring-lime-200 dark:bg-lime-950/50 dark:text-lime-300 dark:ring-lime-800/50',
    diakonia:
        'bg-purple-100 text-purple-700 ring-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:ring-purple-800/50',
    admin: 'bg-pink-100 text-pink-700 ring-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:ring-pink-800/50',
};

function getRoleBadgeClass(role: string): string {
    return (
        roleBadgeColors[role] ||
        'bg-slate-100 text-slate-700 ring-slate-200'
    );
}

function getRoleLabel(role: string, roles: Role[]): string {
    const found = roles.find((r) => r.value === role);
    return found ? found.label : role;
}

export default function MasterPengguna({ users, roles, filters }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const currentUser = usePage<{
        auth?: { user?: { id: number } };
    }>().props.auth?.user;

    // Search & filter state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);

    // Password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    // Delete confirmation state
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

    // Form handling
    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin' as string,
        is_active: true,
    });

    const deleteForm = useForm({});

    // Open Modal for Create
    const handleOpenCreate = () => {
        setEditingUser(null);
        clearErrors();
        reset();
        setShowPassword(false);
        setShowPasswordConfirmation(false);
        setIsFormOpen(true);
    };

    // Open Modal for Edit
    const handleOpenEdit = (item: UserData) => {
        setEditingUser(item);
        clearErrors();
        setData({
            name: item.name,
            email: item.email,
            password: '',
            password_confirmation: '',
            role: item.role,
            is_active: item.is_active,
        });
        setShowPassword(false);
        setShowPasswordConfirmation(false);
        setIsFormOpen(true);
    };

    // Open Delete Dialog
    const handleOpenDelete = (item: UserData) => {
        setDeletingUser(item);
        setIsDeleteOpen(true);
    };

    // Submit Create or Update
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            put(`/master/pengguna/${editingUser.id}`, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        } else {
            post('/master/pengguna', {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        }
    };

    // Confirm Delete
    const handleConfirmDelete = () => {
        if (!deletingUser) return;

        deleteForm.delete(`/master/pengguna/${deletingUser.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingUser(null);
            },
        });
    };

    // Apply filter
    const applyFilters = (overrides: Record<string, string> = {}) => {
        const params: Record<string, string> = {
            ...(searchQuery && { search: searchQuery }),
            ...(roleFilter && { role: roleFilter }),
            ...(statusFilter !== '' && { status: statusFilter }),
            ...overrides,
        };

        // Remove empty values
        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === undefined) {
                delete params[key];
            }
        });

        router.get('/master/pengguna', params, {
            preserveState: true,
            replace: true,
        });
    };

    // Trigger Search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        const params: Record<string, string> = {};
        if (roleFilter) params.role = roleFilter;
        if (statusFilter !== '') params.status = statusFilter;
        router.get('/master/pengguna', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value);
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (value) params.role = value;
        if (statusFilter !== '') params.status = statusFilter;
        router.get('/master/pengguna', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (roleFilter) params.role = roleFilter;
        if (value !== '') params.status = value;
        router.get('/master/pengguna', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearAllFilters = () => {
        setSearchQuery('');
        setRoleFilter('');
        setStatusFilter('');
        router.get(
            '/master/pengguna',
            {},
            { preserveState: true, replace: true },
        );
    };

    const hasActiveFilters =
        !!filters.search || !!filters.role || (filters.status !== undefined && filters.status !== '');

    return (
        <>
            <Head title="Master Pengguna - HKBP Citra Indah" />

            <div className="flex min-h-screen flex-col gap-6 bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                {/* 1. Header & Actions Bar */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1e3a8a] ring-4 ring-blue-50/60">
                            <UserCog className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[#1e3a8a] sm:text-2xl">
                                Master Pengguna
                            </h1>
                            <p className="text-xs text-slate-500 sm:text-sm">
                                Kelola data pengguna & hak akses sistem HKBP
                                Citra Indah
                            </p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1e3a8a] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all duration-200 hover:bg-[#152e70] hover:shadow-lg active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Tambah Pengguna</span>
                        </button>
                    </div>
                </div>

                {/* 2. Flash Feedback Alert */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 shadow-xs">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800 shadow-xs">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* 3. Search, Filters & Count Stats */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <form
                            onSubmit={handleSearch}
                            className="relative max-w-md flex-1"
                        >
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                                placeholder="Cari nama atau email pengguna..."
                                className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-9 pl-10 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </form>

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <span className="rounded-lg border border-slate-200/60 bg-slate-100 px-3 py-1.5">
                                Total:{' '}
                                <strong className="text-slate-800">
                                    {users.total}
                                </strong>{' '}
                                Pengguna
                            </span>
                        </div>
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                handleRoleFilterChange(e.target.value)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        >
                            <option value="">Semua Role</option>
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                handleStatusFilterChange(e.target.value)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        >
                            <option value="">Semua Status</option>
                            <option value="1">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearAllFilters}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. Data Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold tracking-wider text-slate-600 uppercase">
                                    <th className="w-12 px-4 py-3.5 text-center">
                                        #
                                    </th>
                                    <th className="px-4 py-3.5">
                                        Nama Pengguna
                                    </th>
                                    <th className="px-4 py-3.5">Email</th>
                                    <th className="px-4 py-3.5 text-center">
                                        Role
                                    </th>
                                    <th className="px-4 py-3.5 text-center">
                                        Status
                                    </th>
                                    <th className="w-32 px-4 py-3.5 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {users.data.length > 0 ? (
                                    users.data.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="group transition-colors hover:bg-blue-50/40"
                                        >
                                            {/* No */}
                                            <td className="px-4 py-4 text-center text-xs text-slate-500">
                                                {(users.from || 0) + index}
                                            </td>

                                            {/* Nama */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                                                            {item.name}
                                                        </span>
                                                        {item.id ===
                                                            currentUser?.id && (
                                                            <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                                                                Anda
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                    <span className="text-xs sm:text-sm">
                                                        {item.email}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Role Badge */}
                                            <td className="px-4 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getRoleBadgeClass(item.role)}`}
                                                >
                                                    {getRoleLabel(
                                                        item.role,
                                                        roles,
                                                    )}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4 text-center">
                                                {item.is_active ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenEdit(item)
                                                        }
                                                        className="cursor-pointer rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-100/60 hover:text-blue-800"
                                                        title="Ubah Data"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenDelete(
                                                                item,
                                                            )
                                                        }
                                                        disabled={
                                                            item.id ===
                                                            currentUser?.id
                                                        }
                                                        className="cursor-pointer rounded-lg p-1.5 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-30"
                                                        title={
                                                            item.id ===
                                                            currentUser?.id
                                                                ? 'Tidak dapat menghapus akun sendiri'
                                                                : 'Hapus Pengguna'
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                    <UserCog className="h-6 w-6" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    Belum Ada Data Pengguna
                                                </h3>
                                                <p className="mt-1 mb-4 max-w-sm text-xs text-slate-500">
                                                    {hasActiveFilters
                                                        ? 'Tidak ditemukan pengguna dengan filter yang dipilih.'
                                                        : 'Silakan tambahkan pengguna pertama untuk mengelola sistem gereja.'}
                                                </p>
                                                {hasActiveFilters ? (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleClearAllFilters
                                                        }
                                                        className="text-xs font-semibold text-blue-600 hover:underline"
                                                    >
                                                        Reset Filter
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleOpenCreate
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e3a8a] px-4 py-2 text-xs font-semibold text-white"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        Tambah Sekarang
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 text-xs text-slate-500 sm:flex-row">
                            <div>
                                Menampilkan {users.from || 0} -{' '}
                                {users.to || 0} dari {users.total} data
                            </div>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, idx) => {
                                    if (link.label.includes('Previous')) {
                                        return link.url ? (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
                                                title="Halaman Sebelumnya"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <span
                                                key={idx}
                                                className="p-1.5 text-slate-300"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </span>
                                        );
                                    }

                                    if (link.label.includes('Next')) {
                                        return link.url ? (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
                                                title="Halaman Selanjutnya"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <span
                                                key={idx}
                                                className="p-1.5 text-slate-300"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </span>
                                        );
                                    }

                                    return link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                                                link.active
                                                    ? 'bg-[#1e3a8a] text-white'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 text-slate-300"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 5. Create / Edit Dialog Modal */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="rounded-2xl bg-white p-6 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-[#1e3a8a]">
                            {editingUser
                                ? 'Ubah Data Pengguna'
                                : 'Tambah Pengguna Baru'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            {editingUser
                                ? 'Perbarui informasi pengguna. Kosongkan password jika tidak ingin mengubahnya.'
                                : 'Masukkan data pengguna baru untuk mengakses sistem.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {/* Name Field */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Nama Lengkap{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Masukkan nama lengkap"
                                required
                                autoFocus
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-1"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Email{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="contoh@email.com"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                        </div>

                        {/* Role Field */}
                        <div>
                            <label
                                htmlFor="role"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Role / Hak Akses{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Shield className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData('role', e.target.value)
                                    }
                                    required
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-3.5 pl-9 text-sm transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                >
                                    {roles.map((role) => (
                                        <option
                                            key={role.value}
                                            value={role.value}
                                        >
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <InputError
                                message={errors.role}
                                className="mt-1"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Password{' '}
                                {!editingUser && (
                                    <span className="text-rose-500">*</span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder={
                                        editingUser
                                            ? 'Kosongkan jika tidak diubah'
                                            : 'Minimal 8 karakter'
                                    }
                                    required={!editingUser}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                                className="mt-1"
                            />
                        </div>

                        {/* Password Confirmation Field */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Konfirmasi Password{' '}
                                {!editingUser && (
                                    <span className="text-rose-500">*</span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    type={
                                        showPasswordConfirmation
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ulangi password"
                                    required={!editingUser}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswordConfirmation(
                                            !showPasswordConfirmation,
                                        )
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-1"
                            />
                        </div>

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                                    Status Akun
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    {data.is_active
                                        ? 'Pengguna dapat login ke sistem'
                                        : 'Pengguna tidak dapat login ke sistem'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setData('is_active', !data.is_active)
                                }
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                                    data.is_active
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-300'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        data.is_active
                                            ? 'translate-x-5'
                                            : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>

                        <DialogFooter className="flex gap-2 pt-3">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="w-full cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-900/10 transition hover:bg-[#152e70] active:scale-95 disabled:opacity-70 sm:w-auto"
                            >
                                {processing && (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                )}
                                <span>
                                    {editingUser
                                        ? 'Simpan Perubahan'
                                        : 'Tambah Pengguna'}
                                </span>
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 6. Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="rounded-2xl bg-white p-6 text-center sm:max-w-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-base font-bold text-slate-900">
                        Hapus Pengguna?
                    </DialogTitle>
                    <DialogDescription className="mt-1 mb-5 text-xs text-slate-500">
                        Apakah Anda yakin ingin menghapus pengguna{' '}
                        <strong className="text-slate-800">
                            &quot;{deletingUser?.name}&quot;
                        </strong>
                        ? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>

                    <div className="flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsDeleteOpen(false)}
                            className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={deleteForm.processing}
                            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 active:scale-95 disabled:opacity-70"
                        >
                            {deleteForm.processing && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            )}
                            <span>Hapus</span>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

MasterPengguna.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Master Pengguna',
            href: '/master/pengguna',
        },
    ],
};

