import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    Music,
    UserCheck,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    AlertCircle,
    X,
    ChevronLeft,
    ChevronRight,
    Phone,
    Mail,
    Calendar,
    Users,
    Radio,
    Sparkles,
    Loader2,
    Tv,
    Mic,
    SlidersHorizontal,
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

interface JemaatOption {
    id: number;
    nama: string;
    telepon: string | null;
    wijk: string | null;
}

interface JabatanOption {
    value: string;
    label: string;
    kelompok: string;
    badgeClass: string;
}

interface AnggotaMarturiaItem {
    id: number;
    jemaat_id: number | null;
    nama: string;
    jabatan: string;
    jabatan_label: string;
    jabatan_badge: string;
    kelompok: string;
    telepon: string | null;
    email: string | null;
    instrumen: string | null;
    tanggal_bergabung: string | null;
    is_active: boolean;
    keterangan: string | null;
    jemaat?: {
        id: number;
        nama: string;
        keluarga?: {
            id: number;
            wilayah?: {
                id: number;
                nomor_wilayah: string;
                name: string;
            };
        };
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedAnggota {
    data: AnggotaMarturiaItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface StatsData {
    total_anggota: number;
    total_aktif: number;
    total_dewan: number;
    total_multimedia: number;
    total_pemusik: number;
    total_song_leader: number;
}

interface Props {
    anggotaList: PaginatedAnggota;
    jabatans: JabatanOption[];
    jemaats: JemaatOption[];
    filters: {
        search?: string;
        jabatan?: string;
        status?: string;
    };
    stats: StatsData;
}

export default function MarturiaAnggota({
    anggotaList,
    jabatans,
    jemaats,
    filters,
    stats,
}: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [jabatanFilter, setJabatanFilter] = useState(filters.jabatan || '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');

    // Modal state: Create / Edit
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAnggota, setEditingAnggota] = useState<AnggotaMarturiaItem | null>(null);

    // Modal state: Delete
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingAnggota, setDeletingAnggota] = useState<AnggotaMarturiaItem | null>(null);

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
        jemaat_id: '' as string,
        nama: '',
        jabatan: jabatans[0]?.value || 'dewan_marturia',
        telepon: '',
        email: '',
        instrumen: '',
        tanggal_bergabung: '',
        is_active: true,
        keterangan: '',
    });

    const deleteForm = useForm({});

    // Filter handling
    const applyFilters = (overrides: Record<string, string> = {}) => {
        const params: Record<string, string> = {
            ...(searchQuery && { search: searchQuery }),
            ...(jabatanFilter && { jabatan: jabatanFilter }),
            ...(statusFilter !== '' && { status: statusFilter }),
            ...overrides,
        };

        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === undefined) {
                delete params[key];
            }
        });

        router.get('/marturia/anggota', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        applyFilters({ search: '' });
    };

    const handleJabatanFilterChange = (val: string) => {
        setJabatanFilter(val);
        applyFilters({ jabatan: val });
    };

    const handleStatusFilterChange = (val: string) => {
        setStatusFilter(val);
        applyFilters({ status: val });
    };

    const handleResetAllFilters = () => {
        setSearchQuery('');
        setJabatanFilter('');
        setStatusFilter('');
        router.get('/marturia/anggota', {}, { preserveState: true, replace: true });
    };

    const hasActiveFilters = !!searchQuery || !!jabatanFilter || (statusFilter !== undefined && statusFilter !== '');

    // Form open create
    const handleOpenCreate = () => {
        setEditingAnggota(null);
        clearErrors();
        reset();
        setData({
            jemaat_id: '',
            nama: '',
            jabatan: 'dewan_marturia',
            telepon: '',
            email: '',
            instrumen: '',
            tanggal_bergabung: new Date().toISOString().split('T')[0],
            is_active: true,
            keterangan: '',
        });
        setIsFormOpen(true);
    };

    // Form open edit
    const handleOpenEdit = (item: AnggotaMarturiaItem) => {
        setEditingAnggota(item);
        clearErrors();
        setData({
            jemaat_id: item.jemaat_id ? String(item.jemaat_id) : '',
            nama: item.nama,
            jabatan: item.jabatan,
            telepon: item.telepon || '',
            email: item.email || '',
            instrumen: item.instrumen || '',
            tanggal_bergabung: item.tanggal_bergabung ? item.tanggal_bergabung.split('T')[0] : '',
            is_active: item.is_active,
            keterangan: item.keterangan || '',
        });
        setIsFormOpen(true);
    };

    // Auto-fill when selecting a Jemaat
    const handleSelectJemaat = (jemaatId: string) => {
        setData('jemaat_id', jemaatId);
        if (jemaatId) {
            const found = jemaats.find((j) => String(j.id) === jemaatId);
            if (found) {
                if (!data.nama || editingAnggota?.nama === data.nama) {
                    setData('nama', found.nama);
                }
                if (found.telepon && !data.telepon) {
                    setData('telepon', found.telepon);
                }
            }
        }
    };

    // Submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingAnggota) {
            put(`/marturia/anggota/${editingAnggota.id}`, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        } else {
            post('/marturia/anggota', {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        }
    };

    // Delete
    const handleOpenDelete = (item: AnggotaMarturiaItem) => {
        setDeletingAnggota(item);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!deletingAnggota) return;

        deleteForm.delete(`/marturia/anggota/${deletingAnggota.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingAnggota(null);
            },
        });
    };

    return (
        <>
            <Head title="Anggota Marturia - HKBP Citra Indah" />

            <div className="flex min-h-screen flex-col gap-6 bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                {/* 1. Header & Actions Bar */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#1e3a8a] ring-4 ring-purple-50/60">
                            <Music className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[#1e3a8a] sm:text-2xl">
                                Pelayan & Anggota Marturia
                            </h1>
                            <p className="text-xs text-slate-500 sm:text-sm">
                                Kelola pengurus Dewan Marturia, Seksi Musik, Multimedia, Song Leader, dan Pemusik HKBP Citra Indah
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
                            <span>Tambah Anggota</span>
                        </button>
                    </div>
                </div>

                {/* 2. Feedback Alert */}
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

                {/* 3. Stat Cards Bar */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Pelayan</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-[#1e3a8a]">{stats.total_anggota}</span>
                            <span className="text-[10px] text-slate-400">Orang</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-emerald-100/60 bg-emerald-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase">Aktif Melayani</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-emerald-900">{stats.total_aktif}</span>
                            <span className="text-[10px] text-emerald-600">Aktif</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-indigo-100/60 bg-indigo-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-indigo-700 uppercase">Dewan Marturia</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-indigo-900">{stats.total_dewan}</span>
                            <span className="text-[10px] text-indigo-600">Pengurus</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sky-100/60 bg-sky-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-sky-700 uppercase">Multimedia</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-sky-900">{stats.total_multimedia}</span>
                            <span className="text-[10px] text-sky-600">Operator/Live</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-purple-100/60 bg-purple-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-purple-700 uppercase">Pemusik & Iringan</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-purple-900">{stats.total_pemusik}</span>
                            <span className="text-[10px] text-purple-600">Organ/Band</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-rose-100/60 bg-rose-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-rose-700 uppercase">Song Leader</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-rose-900">{stats.total_song_leader}</span>
                            <span className="text-[10px] text-rose-600">Pemandu</span>
                        </div>
                    </div>
                </div>

                {/* 4. Search & Filters Bar */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <form onSubmit={handleSearch} className="relative max-w-md flex-1">
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama, instrumen, telepon, atau catatan..."
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
                                Total: <strong className="text-slate-800">{anggotaList.total}</strong> Pelayan Terdaftar
                            </span>
                        </div>
                    </div>

                    {/* Filter row */}
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={jabatanFilter}
                            onChange={(e) => handleJabatanFilterChange(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        >
                            <option value="">Semua Jabatan / Peran</option>
                            {jabatans.map((j) => (
                                <option key={j.value} value={j.value}>
                                    {j.label} ({j.kelompok})
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        >
                            <option value="">Semua Status Keaktifan</option>
                            <option value="1">Aktif Melayani</option>
                            <option value="0">Nonaktif</option>
                        </select>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetAllFilters}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* 5. Data Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold tracking-wider text-slate-600 uppercase">
                                    <th className="w-12 px-4 py-3.5 text-center">#</th>
                                    <th className="px-4 py-3.5">Nama Pelayan</th>
                                    <th className="px-4 py-3.5 text-center">Jabatan / Peran</th>
                                    <th className="px-4 py-3.5">Bidang / Kelompok</th>
                                    <th className="px-4 py-3.5">Instrumen / Catatan</th>
                                    <th className="px-4 py-3.5">Kontak</th>
                                    <th className="px-4 py-3.5 text-center">Status</th>
                                    <th className="w-32 px-4 py-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {anggotaList.data.length > 0 ? (
                                    anggotaList.data.map((item, index) => (
                                        <tr key={item.id} className="group transition-colors hover:bg-purple-50/30">
                                            {/* Number */}
                                            <td className="px-4 py-4 text-center text-xs text-slate-400">
                                                {(anggotaList.from || 0) + index}
                                            </td>

                                            {/* Nama */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-700 font-bold text-xs">
                                                        {item.nama.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                            {item.nama}
                                                        </span>
                                                        {item.jemaat?.keluarga?.wilayah && (
                                                            <span className="block text-[11px] text-slate-400">
                                                                Wijk {item.jemaat.keluarga.wilayah.nomor_wilayah} - {item.jemaat.keluarga.wilayah.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Jabatan */}
                                            <td className="px-4 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${item.jabatan_badge}`}
                                                >
                                                    {item.jabatan_label}
                                                </span>
                                            </td>

                                            {/* Kelompok */}
                                            <td className="px-4 py-4 text-xs text-slate-600 font-medium">
                                                {item.kelompok}
                                            </td>

                                            {/* Instrumen / Catatan */}
                                            <td className="px-4 py-4 text-xs text-slate-600">
                                                {item.instrumen ? (
                                                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                                                        <Music className="h-3 w-3 text-purple-500" />
                                                        {item.instrumen}
                                                    </span>
                                                ) : item.keterangan ? (
                                                    <span className="text-slate-500 line-clamp-1">{item.keterangan}</span>
                                                ) : (
                                                    <span className="text-slate-300 italic">-</span>
                                                )}
                                            </td>

                                            {/* Kontak */}
                                            <td className="px-4 py-4 text-xs">
                                                {item.telepon ? (
                                                    <a
                                                        href={`https://wa.me/${item.telepon.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-600 font-medium transition"
                                                        title="Hubungi via WhatsApp"
                                                    >
                                                        <Phone className="h-3 w-3 text-emerald-500" />
                                                        {item.telepon}
                                                    </a>
                                                ) : item.email ? (
                                                    <span className="inline-flex items-center gap-1 text-slate-500">
                                                        <Mail className="h-3 w-3 text-slate-400" />
                                                        {item.email}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
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

                                            {/* Actions */}
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(item)}
                                                        className="cursor-pointer rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-100/60 hover:text-blue-800"
                                                        title="Ubah Data"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenDelete(item)}
                                                        className="cursor-pointer rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                                                        title="Hapus Anggota"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-400">
                                                    <Music className="h-6 w-6" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    Belum Ada Data Pelayan Marturia
                                                </h3>
                                                <p className="mt-1 mb-4 max-w-sm text-xs text-slate-500">
                                                    {hasActiveFilters
                                                        ? 'Tidak ditemukan anggota dengan filter yang dipilih.'
                                                        : 'Silakan mulai dengan mendaftarkan pelayan dewan marturia, pemusik, atau song leader pertama.'}
                                                </p>
                                                {hasActiveFilters ? (
                                                    <button
                                                        type="button"
                                                        onClick={handleResetAllFilters}
                                                        className="text-xs font-semibold text-blue-600 hover:underline"
                                                    >
                                                        Reset Filter
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleOpenCreate}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e3a8a] px-4 py-2 text-xs font-semibold text-white"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        Tambah Anggota Sekarang
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
                    {anggotaList.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 text-xs text-slate-500 sm:flex-row">
                            <div>
                                Menampilkan {anggotaList.from || 0} - {anggotaList.to || 0} dari {anggotaList.total} pelayan
                            </div>
                            <div className="flex items-center gap-1">
                                {anggotaList.links.map((link, idx) => {
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
                                            <span key={idx} className="p-1.5 text-slate-300">
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
                                            <span key={idx} className="p-1.5 text-slate-300">
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
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 text-slate-300"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: Create / Edit Anggota Marturia */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-[#1e3a8a] flex items-center gap-2">
                            <Music className="h-5 w-5" />
                            {editingAnggota ? 'Ubah Data Pelayan Marturia' : 'Tambah Pelayan Marturia'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Pilih atau masukkan data pelayan dewan marturia, multimedia, seksi musik, atau pemusik gereja.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {/* Pilih dari Jemaat (Opsional / Helper) */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
                            <label
                                htmlFor="jemaat_id"
                                className="mb-1 block text-xs font-bold tracking-wider text-[#1e3a8a] uppercase flex items-center gap-1.5"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                Hubungkan dengan Data Jemaat (Opsional)
                            </label>
                            <select
                                id="jemaat_id"
                                value={data.jemaat_id}
                                onChange={(e) => handleSelectJemaat(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs transition-all focus:border-blue-600 focus:outline-none"
                            >
                                <option value="">-- Pilih dari Jemaat Gereja (Auto-fill) --</option>
                                {jemaats.map((j) => (
                                    <option key={j.id} value={j.id}>
                                        {j.nama} {j.wijk ? `(${j.wijk})` : ''}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-[11px] text-slate-500">
                                Memilih jemaat akan mengisi otomatis nama dan nomor telepon.
                            </p>
                        </div>

                        {/* Nama Lengkap & Jabatan */}
                        <div>
                            <label
                                htmlFor="nama"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Nama Lengkap <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="nama"
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Contoh: St. M. Hutapea / Daniel Pakpahan"
                                required
                                autoFocus
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            />
                            <InputError message={errors.nama} className="mt-1" />
                        </div>

                        {/* Jabatan / Peran di Marturia */}
                        <div>
                            <label
                                htmlFor="jabatan"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Jabatan / Peran di Marturia <span className="text-rose-500">*</span>
                            </label>
                            <select
                                id="jabatan"
                                value={data.jabatan}
                                onChange={(e) => setData('jabatan', e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            >
                                {jabatans.map((j) => (
                                    <option key={j.value} value={j.value}>
                                        {j.label} — [{j.kelompok}]
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.jabatan} className="mt-1" />
                        </div>

                        {/* Instrumen / Alat Musik Spesifik (jika pemusik) */}
                        <div>
                            <label
                                htmlFor="instrumen"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Instrumen / Alat Musik / Spesialisasi
                            </label>
                            <input
                                id="instrumen"
                                type="text"
                                value={data.instrumen}
                                onChange={(e) => setData('instrumen', e.target.value)}
                                placeholder="Contoh: Keyboard, Gitar Elektrik, Bass, Drum, Saxophone, Live Stream Operator"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            />
                            <InputError message={errors.instrumen} className="mt-1" />
                        </div>

                        {/* Telepon & Email */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="telepon"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    No. Telepon / WhatsApp
                                </label>
                                <input
                                    id="telepon"
                                    type="text"
                                    value={data.telepon}
                                    onChange={(e) => setData('telepon', e.target.value)}
                                    placeholder="0812xxxxxxx"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={errors.telepon} className="mt-1" />
                            </div>

                            <div>
                                <label
                                    htmlFor="tanggal_bergabung"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Tanggal Mulai Melayani
                                </label>
                                <input
                                    id="tanggal_bergabung"
                                    type="date"
                                    value={data.tanggal_bergabung}
                                    onChange={(e) => setData('tanggal_bergabung', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={errors.tanggal_bergabung} className="mt-1" />
                            </div>
                        </div>

                        {/* Status Keaktifan Toggle */}
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                                    Status Keaktifan
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    {data.is_active
                                        ? 'Pelayan aktif dijadwalkan dalam ibadah'
                                        : 'Pelayan sedang nonaktif / cuti pelayanan'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                                    data.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        data.is_active ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Catatan / Keterangan */}
                        <div>
                            <label
                                htmlFor="keterangan"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Catatan Tambahan
                            </label>
                            <textarea
                                id="keterangan"
                                rows={2}
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                placeholder="Jadwal ketersediaan, pengalaman pelayanan, dll..."
                                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            />
                            <InputError message={errors.keterangan} className="mt-1" />
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
                                {processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                <span>{editingAnggota ? 'Simpan Perubahan' : 'Tambah Anggota'}</span>
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="rounded-2xl bg-white p-6 text-center sm:max-w-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-base font-bold text-slate-900">
                        Hapus Anggota Marturia?
                    </DialogTitle>
                    <DialogDescription className="mt-1 mb-5 text-xs text-slate-500">
                        Apakah Anda yakin ingin menghapus data pelayan{' '}
                        <strong className="text-slate-800">&quot;{deletingAnggota?.nama}&quot;</strong> (
                        {deletingAnggota?.jabatan_label})? Tindakan ini tidak dapat dibatalkan.
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
                            {deleteForm.processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            <span>Hapus</span>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

MarturiaAnggota.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Marturia',
            href: '#',
        },
        {
            title: 'Anggota Marturia',
            href: '/marturia/anggota',
        },
    ],
};

