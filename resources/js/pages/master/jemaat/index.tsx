import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    Users,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    AlertCircle,
    X,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Calendar,
    Phone,
    FileText,
    Download,
    ChevronDown,
    ChevronUp,
    UserPlus,
    UserCheck,
    FileCheck,
    Sparkles,
    Eye,
    Loader2,
    ExternalLink,
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

interface WilayahItem {
    id: number;
    nomor_wilayah: string | null;
    name: string;
}

interface JemaatMember {
    id: number;
    keluarga_id: number;
    nama: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string;
    status: 'single' | 'menikah' | 'cerai' | 'cerai_mati';
    hubungan_keluarga: string | null;
    tanggal_baptis: string | null;
    file_baptis: string | null;
    file_baptis_url: string | null;
    tanggal_sidi: string | null;
    file_sidi: string | null;
    file_sidi_url: string | null;
    tanggal_menikah: string | null;
    file_menikah: string | null;
    file_menikah_url: string | null;
    telepon: string | null;
    keterangan: string | null;
    kategori: string;
    kategori_label: string;
    status_label: string;
}

interface KeluargaItem {
    id: number;
    nrj: string;
    nama_keluarga: string;
    wilayah_id: number;
    alamat: string;
    tanggal_terdaftar: string;
    telepon: string | null;
    keterangan: string | null;
    wilayah?: WilayahItem;
    anggota: JemaatMember[];
    anggota_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedKeluargas {
    data: KeluargaItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface StatsData {
    total_keluarga: number;
    total_jiwa: number;
    total_ama: number;
    total_ina: number;
    total_naposo: number;
    total_anak: number;
    total_duda: number;
    total_janda: number;
}

interface Props {
    keluargas: PaginatedKeluargas;
    wilayahs: WilayahItem[];
    filters: {
        search?: string;
        wilayah_id?: string;
        kategori?: string;
    };
    stats: StatsData;
}

// Function to calculate dynamic category for preview in form
function calculateKategori(
    jenisKelamin: 'L' | 'P',
    status: 'single' | 'menikah' | 'cerai' | 'cerai_mati',
    tanggalSidi: string,
    tanggalMenikah: string
): { key: string; label: string; badgeClass: string; note: string } {
    if (status === 'cerai' || status === 'cerai_mati') {
        return jenisKelamin === 'L'
            ? {
                  key: 'duda',
                  label: 'Duda',
                  badgeClass: 'bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-950/50 dark:text-amber-300',
                  note: 'Status Cerai / Cerai Mati (Laki-laki)',
              }
            : {
                  key: 'janda',
                  label: 'Janda',
                  badgeClass: 'bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-950/50 dark:text-rose-300',
                  note: 'Status Cerai / Cerai Mati (Perempuan)',
              };
    }

    if (tanggalMenikah || status === 'menikah') {
        return jenisKelamin === 'L'
            ? {
                  key: 'ama',
                  label: 'Ama',
                  badgeClass: 'bg-blue-100 text-blue-800 ring-blue-300 dark:bg-blue-950/50 dark:text-blue-300',
                  note: 'Sudah SIDI & Menikah (Laki-laki)',
              }
            : {
                  key: 'ina',
                  label: 'Ina',
                  badgeClass: 'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300',
                  note: 'Sudah SIDI & Menikah (Perempuan)',
              };
    }

    if (tanggalSidi) {
        return {
            key: 'naposo',
            label: 'Naposo',
            badgeClass: 'bg-purple-100 text-purple-800 ring-purple-300 dark:bg-purple-950/50 dark:text-purple-300',
            note: 'Sudah SIDI / Malua, Belum Menikah',
        };
    }

    return jenisKelamin === 'L'
        ? {
              key: 'anak_laki',
              label: 'Anak (Laki-laki)',
              badgeClass: 'bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-950/50 dark:text-sky-300',
              note: 'Belum SIDI / Malua (Laki-laki)',
          }
        : {
              key: 'anak_perempuan',
              label: 'Anak (Perempuan)',
              badgeClass: 'bg-pink-100 text-pink-800 ring-pink-300 dark:bg-pink-950/50 dark:text-pink-300',
              note: 'Belum SIDI / Malua (Perempuan)',
          };
}

function getKategoriBadge(kategori: string) {
    switch (kategori) {
        case 'ama':
            return 'bg-blue-100 text-blue-800 ring-blue-300 dark:bg-blue-950/50 dark:text-blue-300';
        case 'ina':
            return 'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300';
        case 'naposo':
            return 'bg-purple-100 text-purple-800 ring-purple-300 dark:bg-purple-950/50 dark:text-purple-300';
        case 'duda':
            return 'bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-950/50 dark:text-amber-300';
        case 'janda':
            return 'bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-950/50 dark:text-rose-300';
        case 'anak_laki':
            return 'bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-950/50 dark:text-sky-300';
        case 'anak_perempuan':
            return 'bg-pink-100 text-pink-800 ring-pink-300 dark:bg-pink-950/50 dark:text-pink-300';
        default:
            return 'bg-slate-100 text-slate-700 ring-slate-300';
    }
}

function getHubunganBadge(hubungan: string | null) {
    switch (hubungan) {
        case 'kepala_keluarga':
            return 'bg-indigo-50 text-indigo-700 border-indigo-200';
        case 'istri':
            return 'bg-rose-50 text-rose-700 border-rose-200';
        case 'anak':
            return 'bg-sky-50 text-sky-700 border-sky-200';
        case 'orang_tua':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200';
    }
}

function formatHubunganLabel(hubungan: string | null) {
    switch (hubungan) {
        case 'kepala_keluarga':
            return 'Kepala Keluarga';
        case 'istri':
            return 'Istri';
        case 'anak':
            return 'Anak';
        case 'orang_tua':
            return 'Orang Tua';
        case 'famili':
            return 'Famili Lain';
        default:
            return hubungan || 'Anggota';
    }
}

function calculateAge(dateString: string): number {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export default function MasterJemaat({ keluargas, wilayahs, filters, stats }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [wilayahFilter, setWilayahFilter] = useState(filters.wilayah_id || '');
    const [kategoriFilter, setKategoriFilter] = useState(filters.kategori || '');

    // Expanded families in accordion
    const [expandedFamilies, setExpandedFamilies] = useState<Record<number, boolean>>({});

    const toggleExpand = (id: number) => {
        setExpandedFamilies((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Modal state: Keluarga (Create / Edit)
    const [isKeluargaModalOpen, setIsKeluargaModalOpen] = useState(false);
    const [editingKeluarga, setEditingKeluarga] = useState<KeluargaItem | null>(null);

    // Modal state: Delete Keluarga
    const [isDeleteKeluargaOpen, setIsDeleteKeluargaOpen] = useState(false);
    const [deletingKeluarga, setDeletingKeluarga] = useState<KeluargaItem | null>(null);

    // Modal state: Anggota (Create / Edit)
    const [isAnggotaModalOpen, setIsAnggotaModalOpen] = useState(false);
    const [selectedKeluargaForAnggota, setSelectedKeluargaForAnggota] = useState<KeluargaItem | null>(null);
    const [editingAnggota, setEditingAnggota] = useState<JemaatMember | null>(null);

    // Modal state: Delete Anggota
    const [isDeleteAnggotaOpen, setIsDeleteAnggotaOpen] = useState(false);
    const [deletingAnggota, setDeletingAnggota] = useState<JemaatMember | null>(null);

    // Modal state: Detail Keluarga View
    const [detailKeluarga, setDetailKeluarga] = useState<KeluargaItem | null>(null);

    // Form: Keluarga
    const keluargaForm = useForm({
        nrj: '',
        nama_keluarga: '',
        wilayah_id: wilayahs[0]?.id ? String(wilayahs[0].id) : '',
        alamat: '',
        tanggal_terdaftar: new Date().toISOString().split('T')[0],
        telepon: '',
        keterangan: '',
    });

    // Form: Anggota
    const anggotaForm = useForm({
        nama: '',
        jenis_kelamin: 'L' as 'L' | 'P',
        tanggal_lahir: '',
        status: 'single' as 'single' | 'menikah' | 'cerai' | 'cerai_mati',
        hubungan_keluarga: 'kepala_keluarga',
        tanggal_baptis: '',
        file_baptis: null as File | null,
        tanggal_sidi: '',
        file_sidi: null as File | null,
        tanggal_menikah: '',
        file_menikah: null as File | null,
        telepon: '',
        keterangan: '',
    });

    const deleteForm = useForm({});

    // Live calculated category preview for Anggota Modal
    const previewKategori = calculateKategori(
        anggotaForm.data.jenis_kelamin,
        anggotaForm.data.status,
        anggotaForm.data.tanggal_sidi,
        anggotaForm.data.tanggal_menikah
    );

    // Filter handling
    const applyFilters = (overrides: Record<string, string> = {}) => {
        const params: Record<string, string> = {
            ...(searchQuery && { search: searchQuery }),
            ...(wilayahFilter && { wilayah_id: wilayahFilter }),
            ...(kategoriFilter && { kategori: kategoriFilter }),
            ...overrides,
        };

        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === undefined) {
                delete params[key];
            }
        });

        router.get('/master/jemaat', params, {
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

    const handleWilayahFilterChange = (val: string) => {
        setWilayahFilter(val);
        applyFilters({ wilayah_id: val });
    };

    const handleKategoriFilterChange = (val: string) => {
        setKategoriFilter(val);
        applyFilters({ kategori: val });
    };

    const handleResetAllFilters = () => {
        setSearchQuery('');
        setWilayahFilter('');
        setKategoriFilter('');
        router.get('/master/jemaat', {}, { preserveState: true, replace: true });
    };

    const hasActiveFilters = !!searchQuery || !!wilayahFilter || !!kategoriFilter;

    // Handlers: Keluarga
    const handleOpenCreateKeluarga = () => {
        setEditingKeluarga(null);
        keluargaForm.clearErrors();
        keluargaForm.reset();
        keluargaForm.setData({
            nrj: '',
            nama_keluarga: '',
            wilayah_id: wilayahs[0]?.id ? String(wilayahs[0].id) : '',
            alamat: '',
            tanggal_terdaftar: new Date().toISOString().split('T')[0],
            telepon: '',
            keterangan: '',
        });
        setIsKeluargaModalOpen(true);
    };

    const handleOpenEditKeluarga = (item: KeluargaItem) => {
        setEditingKeluarga(item);
        keluargaForm.clearErrors();
        keluargaForm.setData({
            nrj: item.nrj,
            nama_keluarga: item.nama_keluarga,
            wilayah_id: String(item.wilayah_id),
            alamat: item.alamat,
            tanggal_terdaftar: item.tanggal_terdaftar ? item.tanggal_terdaftar.split('T')[0] : '',
            telepon: item.telepon || '',
            keterangan: item.keterangan || '',
        });
        setIsKeluargaModalOpen(true);
    };

    const handleSubmitKeluarga = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingKeluarga) {
            keluargaForm.put(`/master/jemaat/keluarga/${editingKeluarga.id}`, {
                onSuccess: () => {
                    setIsKeluargaModalOpen(false);
                    keluargaForm.reset();
                },
            });
        } else {
            keluargaForm.post('/master/jemaat/keluarga', {
                onSuccess: () => {
                    setIsKeluargaModalOpen(false);
                    keluargaForm.reset();
                },
            });
        }
    };

    const handleOpenDeleteKeluarga = (item: KeluargaItem) => {
        setDeletingKeluarga(item);
        setIsDeleteKeluargaOpen(true);
    };

    const handleConfirmDeleteKeluarga = () => {
        if (!deletingKeluarga) return;
        deleteForm.delete(`/master/jemaat/keluarga/${deletingKeluarga.id}`, {
            onSuccess: () => {
                setIsDeleteKeluargaOpen(false);
                setDeletingKeluarga(null);
            },
        });
    };

    // Handlers: Anggota
    const handleOpenCreateAnggota = (keluarga: KeluargaItem) => {
        setSelectedKeluargaForAnggota(keluarga);
        setEditingAnggota(null);
        anggotaForm.clearErrors();
        anggotaForm.reset();
        anggotaForm.setData({
            nama: '',
            jenis_kelamin: 'L',
            tanggal_lahir: '',
            status: 'single',
            hubungan_keluarga: keluarga.anggota && keluarga.anggota.length === 0 ? 'kepala_keluarga' : 'anak',
            tanggal_baptis: '',
            file_baptis: null,
            tanggal_sidi: '',
            file_sidi: null,
            tanggal_menikah: '',
            file_menikah: null,
            telepon: '',
            keterangan: '',
        });
        setIsAnggotaModalOpen(true);
    };

    const handleOpenEditAnggota = (keluarga: KeluargaItem, anggota: JemaatMember) => {
        setSelectedKeluargaForAnggota(keluarga);
        setEditingAnggota(anggota);
        anggotaForm.clearErrors();
        anggotaForm.setData({
            nama: anggota.nama,
            jenis_kelamin: anggota.jenis_kelamin,
            tanggal_lahir: anggota.tanggal_lahir ? anggota.tanggal_lahir.split('T')[0] : '',
            status: anggota.status,
            hubungan_keluarga: anggota.hubungan_keluarga || 'anak',
            tanggal_baptis: anggota.tanggal_baptis ? anggota.tanggal_baptis.split('T')[0] : '',
            file_baptis: null,
            tanggal_sidi: anggota.tanggal_sidi ? anggota.tanggal_sidi.split('T')[0] : '',
            file_sidi: null,
            tanggal_menikah: anggota.tanggal_menikah ? anggota.tanggal_menikah.split('T')[0] : '',
            file_menikah: null,
            telepon: anggota.telepon || '',
            keterangan: anggota.keterangan || '',
        });
        setIsAnggotaModalOpen(true);
    };

    const handleSubmitAnggota = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAnggota) {
            anggotaForm.post(`/master/jemaat/anggota/${editingAnggota.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    setIsAnggotaModalOpen(false);
                    anggotaForm.reset();
                },
            });
        } else if (selectedKeluargaForAnggota) {
            anggotaForm.post(`/master/jemaat/keluarga/${selectedKeluargaForAnggota.id}/anggota`, {
                forceFormData: true,
                onSuccess: () => {
                    setIsAnggotaModalOpen(false);
                    anggotaForm.reset();
                    // Auto expand the family row to view newly added member
                    setExpandedFamilies((prev) => ({
                        ...prev,
                        [selectedKeluargaForAnggota.id]: true,
                    }));
                },
            });
        }
    };

    const handleOpenDeleteAnggota = (anggota: JemaatMember) => {
        setDeletingAnggota(anggota);
        setIsDeleteAnggotaOpen(true);
    };

    const handleConfirmDeleteAnggota = () => {
        if (!deletingAnggota) return;
        deleteForm.delete(`/master/jemaat/anggota/${deletingAnggota.id}`, {
            onSuccess: () => {
                setIsDeleteAnggotaOpen(false);
                setDeletingAnggota(null);
            },
        });
    };

    return (
        <>
            <Head title="Master Jemaat - HKBP Citra Indah" />

            <div className="flex min-h-screen flex-col gap-6 bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                {/* 1. Header & Actions Bar */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1e3a8a] ring-4 ring-blue-50/60">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[#1e3a8a] sm:text-2xl">
                                Master Data Jemaat
                            </h1>
                            <p className="text-xs text-slate-500 sm:text-sm">
                                Kelola data register keluarga (NRJ) dan anggota jemaat HKBP Citra Indah
                            </p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleOpenCreateKeluarga}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1e3a8a] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all duration-200 hover:bg-[#152e70] hover:shadow-lg active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Daftar Keluarga Baru</span>
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
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">Keluarga</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-[#1e3a8a]">{stats.total_keluarga}</span>
                            <span className="text-[10px] text-slate-400">KK</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Jiwa</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-slate-800">{stats.total_jiwa}</span>
                            <span className="text-[10px] text-slate-400">Jiwa</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-blue-100/60 bg-blue-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-blue-700 uppercase">Ama</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-blue-900">{stats.total_ama}</span>
                            <span className="text-[10px] text-blue-600">Bapak</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-emerald-100/60 bg-emerald-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase">Ina</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-emerald-900">{stats.total_ina}</span>
                            <span className="text-[10px] text-emerald-600">Ibu</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-purple-100/60 bg-purple-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-purple-700 uppercase">Naposo</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-purple-900">{stats.total_naposo}</span>
                            <span className="text-[10px] text-purple-600">Pemuda/i</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sky-100/60 bg-sky-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-sky-700 uppercase">Anak</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-sky-900">{stats.total_anak}</span>
                            <span className="text-[10px] text-sky-600">SM</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-amber-100/60 bg-amber-50/40 p-3.5 shadow-xs">
                        <span className="text-[11px] font-bold text-amber-700 uppercase">Duda / Janda</span>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-amber-900">
                                {stats.total_duda + stats.total_janda}
                            </span>
                            <span className="text-[10px] text-amber-600">{stats.total_duda}D / {stats.total_janda}J</span>
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
                                placeholder="Cari NRJ, nama keluarga, anggota, atau alamat..."
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
                                Total: <strong className="text-slate-800">{keluargas.total}</strong> Keluarga Terdaftar
                            </span>
                        </div>
                    </div>

                    {/* Filter row */}
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={wilayahFilter}
                            onChange={(e) => handleWilayahFilterChange(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        >
                            <option value="">Semua Wilayah / Wijk</option>
                            {wilayahs.map((w) => (
                                <option key={w.id} value={w.id}>
                                    Wijk {w.nomor_wilayah} - {w.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={kategoriFilter}
                            onChange={(e) => handleKategoriFilterChange(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        >
                            <option value="">Semua Kategori Jemaat</option>
                            <option value="ama">Ama (Bapak)</option>
                            <option value="ina">Ina (Ibu)</option>
                            <option value="naposo">Naposo (Pemuda/i)</option>
                            <option value="anak">Anak (Semua)</option>
                            <option value="anak_laki">Anak (Laki-laki)</option>
                            <option value="anak_perempuan">Anak (Perempuan)</option>
                            <option value="duda">Duda</option>
                            <option value="janda">Janda</option>
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

                {/* 5. Data List / Families Card Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold tracking-wider text-slate-600 uppercase">
                                    <th className="w-10 px-3 py-3.5 text-center"></th>
                                    <th className="w-36 px-4 py-3.5">NRJ</th>
                                    <th className="px-4 py-3.5">Nama Keluarga</th>
                                    <th className="px-4 py-3.5">Wijk / Wilayah</th>
                                    <th className="px-4 py-3.5 text-center">Jumlah Jiwa</th>
                                    <th className="px-4 py-3.5">Tgl Terdaftar</th>
                                    <th className="px-4 py-3.5">Alamat</th>
                                    <th className="w-36 px-4 py-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {keluargas.data.length > 0 ? (
                                    keluargas.data.map((keluarga) => {
                                        const isExpanded = !!expandedFamilies[keluarga.id];
                                        return (
                                            <React.Fragment key={keluarga.id}>
                                                {/* Family Main Row */}
                                                <tr className={`group transition-colors ${isExpanded ? 'bg-blue-50/20' : 'hover:bg-slate-50/60'}`}>
                                                    <td className="px-3 py-4 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExpand(keluarga.id)}
                                                            className="rounded-lg p-1 text-slate-400 hover:bg-blue-100 hover:text-blue-700 transition"
                                                            title={isExpanded ? 'Tutup daftar anggota' : 'Lihat daftar anggota'}
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </td>

                                                    {/* NRJ */}
                                                    <td className="px-4 py-4">
                                                        <span className="inline-flex items-center rounded-lg border border-blue-200/70 bg-blue-50/80 px-2.5 py-1 font-mono text-xs font-bold text-[#1e3a8a]">
                                                            {keluarga.nrj}
                                                        </span>
                                                    </td>

                                                    {/* Nama Keluarga */}
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                                {keluarga.nama_keluarga}
                                                            </span>
                                                            {keluarga.telepon && (
                                                                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                                    <Phone className="h-3 w-3" />
                                                                    {keluarga.telepon}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Wilayah */}
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                                            <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                                            <span>
                                                                Wijk {keluarga.wilayah?.nomor_wilayah || '-'}: {keluarga.wilayah?.name || '-'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Jumlah Jiwa */}
                                                    <td className="px-4 py-4 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExpand(keluarga.id)}
                                                            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 transition hover:bg-blue-100 hover:text-blue-800"
                                                        >
                                                            <Users className="h-3 w-3" />
                                                            {keluarga.anggota?.length || 0} Jiwa
                                                        </button>
                                                    </td>

                                                    {/* Tgl Terdaftar */}
                                                    <td className="px-4 py-4 text-xs text-slate-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3 text-slate-400" />
                                                            <span>{keluarga.tanggal_terdaftar}</span>
                                                        </div>
                                                    </td>

                                                    {/* Alamat */}
                                                    <td className="px-4 py-4 text-slate-600 text-xs max-w-xs">
                                                        <span className="line-clamp-2">{keluarga.alamat}</span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            {/* Add Member button */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenCreateAnggota(keluarga)}
                                                                className="cursor-pointer rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-800"
                                                                title="Tambah Anggota Jemaat"
                                                            >
                                                                <UserPlus className="h-4 w-4" />
                                                            </button>

                                                            {/* Detail KK view */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setDetailKeluarga(keluarga)}
                                                                className="cursor-pointer rounded-lg p-1.5 text-sky-600 transition hover:bg-sky-50 hover:text-sky-800"
                                                                title="Lihat Detail Kartu Keluarga"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>

                                                            {/* Edit Keluarga */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEditKeluarga(keluarga)}
                                                                className="cursor-pointer rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-100/60 hover:text-blue-800"
                                                                title="Ubah Data Keluarga"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>

                                                            {/* Delete Keluarga */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenDeleteKeluarga(keluarga)}
                                                                className="cursor-pointer rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                                                                title="Hapus Keluarga"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded Members Row */}
                                                {isExpanded && (
                                                    <tr className="bg-slate-50/70">
                                                        <td colSpan={8} className="p-4 sm:p-5">
                                                            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-2xs">
                                                                <div className="mb-3 flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <Users className="h-4 w-4 text-[#1e3a8a]" />
                                                                        <h4 className="text-xs font-bold tracking-wide text-slate-800 uppercase">
                                                                            Anggota Keluarga ({keluarga.anggota?.length || 0} orang)
                                                                        </h4>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleOpenCreateAnggota(keluarga)}
                                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1e3a8a] hover:bg-blue-100 transition"
                                                                    >
                                                                        <UserPlus className="h-3.5 w-3.5" />
                                                                        Tambah Anggota
                                                                    </button>
                                                                </div>

                                                                {keluarga.anggota && keluarga.anggota.length > 0 ? (
                                                                    <div className="overflow-x-auto">
                                                                        <table className="w-full text-left text-xs">
                                                                            <thead>
                                                                                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                                                                                    <th className="py-2 px-3">Nama Anggota</th>
                                                                                    <th className="py-2 px-3">Hubungan</th>
                                                                                    <th className="py-2 px-3 text-center">Gender</th>
                                                                                    <th className="py-2 px-3">Tgl Lahir / Usia</th>
                                                                                    <th className="py-2 px-3 text-center">Status</th>
                                                                                    <th className="py-2 px-3 text-center">Kategori Dinamis</th>
                                                                                    <th className="py-2 px-3">Dokumen Gereja</th>
                                                                                    <th className="py-2 px-3 text-center">Aksi</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-slate-100">
                                                                                {keluarga.anggota.map((m) => (
                                                                                    <tr key={m.id} className="hover:bg-slate-50/50">
                                                                                        {/* Nama */}
                                                                                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                                                                                            {m.nama}
                                                                                        </td>

                                                                                        {/* Hubungan */}
                                                                                        <td className="py-2.5 px-3">
                                                                                            <span
                                                                                                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${getHubunganBadge(
                                                                                                    m.hubungan_keluarga
                                                                                                )}`}
                                                                                            >
                                                                                                {formatHubunganLabel(m.hubungan_keluarga)}
                                                                                            </span>
                                                                                        </td>

                                                                                        {/* Gender */}
                                                                                        <td className="py-2.5 px-3 text-center">
                                                                                            {m.jenis_kelamin === 'L' ? (
                                                                                                <span className="font-bold text-blue-600">L</span>
                                                                                            ) : (
                                                                                                <span className="font-bold text-pink-600">P</span>
                                                                                            )}
                                                                                        </td>

                                                                                        {/* Tgl Lahir */}
                                                                                        <td className="py-2.5 px-3 text-slate-600">
                                                                                            {m.tanggal_lahir} ({calculateAge(m.tanggal_lahir)} thn)
                                                                                        </td>

                                                                                        {/* Status */}
                                                                                        <td className="py-2.5 px-3 text-center">
                                                                                            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                                                                                                {m.status_label}
                                                                                            </span>
                                                                                        </td>

                                                                                        {/* Kategori Dinamis Badge */}
                                                                                        <td className="py-2.5 px-3 text-center">
                                                                                            <span
                                                                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${getKategoriBadge(
                                                                                                    m.kategori
                                                                                                )}`}
                                                                                            >
                                                                                                {m.kategori_label}
                                                                                            </span>
                                                                                        </td>

                                                                                        {/* Dokumen: Baptis, SIDI, Menikah */}
                                                                                        <td className="py-2.5 px-3">
                                                                                            <div className="flex flex-wrap items-center gap-1 text-[11px]">
                                                                                                {/* Baptis */}
                                                                                                {m.tanggal_baptis ? (
                                                                                                    <div className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">
                                                                                                        <span>Baptis</span>
                                                                                                        {m.file_baptis_url && (
                                                                                                            <a
                                                                                                                href={m.file_baptis_url}
                                                                                                                target="_blank"
                                                                                                                rel="noreferrer"
                                                                                                                className="text-blue-600 hover:text-blue-800"
                                                                                                                title="Buka Surat Baptis"
                                                                                                            >
                                                                                                                <ExternalLink className="h-3 w-3" />
                                                                                                            </a>
                                                                                                        )}
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <span className="text-slate-300">-</span>
                                                                                                )}

                                                                                                {/* SIDI */}
                                                                                                {m.tanggal_sidi && (
                                                                                                    <div className="inline-flex items-center gap-1 rounded bg-purple-50 px-1.5 py-0.5 text-purple-700 font-medium">
                                                                                                        <span>SIDI</span>
                                                                                                        {m.file_sidi_url && (
                                                                                                            <a
                                                                                                                href={m.file_sidi_url}
                                                                                                                target="_blank"
                                                                                                                rel="noreferrer"
                                                                                                                className="text-purple-600 hover:text-purple-800"
                                                                                                                title="Buka Surat SIDI/Malua"
                                                                                                            >
                                                                                                                <ExternalLink className="h-3 w-3" />
                                                                                                            </a>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Menikah */}
                                                                                                {m.tanggal_menikah && (
                                                                                                    <div className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 font-medium">
                                                                                                        <span>Pernikahan</span>
                                                                                                        {m.file_menikah_url && (
                                                                                                            <a
                                                                                                                href={m.file_menikah_url}
                                                                                                                target="_blank"
                                                                                                                rel="noreferrer"
                                                                                                                className="text-emerald-600 hover:text-emerald-800"
                                                                                                                title="Buka Surat Nikah"
                                                                                                            >
                                                                                                                <ExternalLink className="h-3 w-3" />
                                                                                                            </a>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </td>

                                                                                        {/* Actions */}
                                                                                        <td className="py-2.5 px-3 text-center">
                                                                                            <div className="flex items-center justify-center gap-1">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handleOpenEditAnggota(keluarga, m)}
                                                                                                    className="rounded p-1 text-blue-600 hover:bg-blue-50 transition"
                                                                                                    title="Ubah Anggota"
                                                                                                >
                                                                                                    <Edit2 className="h-3.5 w-3.5" />
                                                                                                </button>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handleOpenDeleteAnggota(m)}
                                                                                                    className="rounded p-1 text-rose-500 hover:bg-rose-50 transition"
                                                                                                    title="Hapus Anggota"
                                                                                                >
                                                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                                                </button>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ) : (
                                                                    <div className="py-6 text-center text-xs text-slate-400">
                                                                        Belum ada data anggota pada keluarga ini.{' '}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleOpenCreateAnggota(keluarga)}
                                                                            className="font-semibold text-blue-600 hover:underline"
                                                                        >
                                                                            Tambah anggota sekarang
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    Belum Ada Data Keluarga Jemaat
                                                </h3>
                                                <p className="mt-1 mb-4 max-w-sm text-xs text-slate-500">
                                                    {hasActiveFilters
                                                        ? 'Tidak ditemukan keluarga dengan filter yang dipilih.'
                                                        : 'Silakan mulai dengan mendaftarkan keluarga jemaat pertama gereja.'}
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
                                                        onClick={handleOpenCreateKeluarga}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e3a8a] px-4 py-2 text-xs font-semibold text-white"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        Daftar Keluarga Sekarang
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
                    {keluargas.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 text-xs text-slate-500 sm:flex-row">
                            <div>
                                Menampilkan {keluargas.from || 0} - {keluargas.to || 0} dari {keluargas.total} keluarga
                            </div>
                            <div className="flex items-center gap-1">
                                {keluargas.links.map((link, idx) => {
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

            {/* MODAL 1: Create / Edit Keluarga */}
            <Dialog open={isKeluargaModalOpen} onOpenChange={setIsKeluargaModalOpen}>
                <DialogContent className="rounded-2xl bg-white p-6 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-[#1e3a8a]">
                            {editingKeluarga ? 'Ubah Data Keluarga' : 'Daftar Keluarga Baru'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            {editingKeluarga
                                ? 'Perbarui informasi nomor register, wilayah wijk, atau alamat keluarga.'
                                : 'Masukkan data register keluarga baru (Kepala Keluarga) jemaat HKBP Citra Indah.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitKeluarga} className="space-y-4 pt-2">
                        {/* NRJ & Nama Keluarga in grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="nrj"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    NRJ (No. Register) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="nrj"
                                    type="text"
                                    value={keluargaForm.data.nrj}
                                    onChange={(e) => keluargaForm.setData('nrj', e.target.value)}
                                    placeholder="Contoh: NRJ-2026-001"
                                    required
                                    autoFocus
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={keluargaForm.errors.nrj} className="mt-1" />
                            </div>

                            <div>
                                <label
                                    htmlFor="nama_keluarga"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Nama Keluarga <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="nama_keluarga"
                                    type="text"
                                    value={keluargaForm.data.nama_keluarga}
                                    onChange={(e) => keluargaForm.setData('nama_keluarga', e.target.value)}
                                    placeholder="Contoh: Kel. St. B. Pakpahan"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={keluargaForm.errors.nama_keluarga} className="mt-1" />
                            </div>
                        </div>

                        {/* Wilayah & Tanggal Terdaftar */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="wilayah_id"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Wilayah / Wijk <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="wilayah_id"
                                    value={keluargaForm.data.wilayah_id}
                                    onChange={(e) => keluargaForm.setData('wilayah_id', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                >
                                    {wilayahs.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            Wijk {w.nomor_wilayah} - {w.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={keluargaForm.errors.wilayah_id} className="mt-1" />
                            </div>

                            <div>
                                <label
                                    htmlFor="tanggal_terdaftar"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Tgl Terdaftar di Gereja <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="tanggal_terdaftar"
                                    type="date"
                                    value={keluargaForm.data.tanggal_terdaftar}
                                    onChange={(e) => keluargaForm.setData('tanggal_terdaftar', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={keluargaForm.errors.tanggal_terdaftar} className="mt-1" />
                            </div>
                        </div>

                        {/* Alamat */}
                        <div>
                            <label
                                htmlFor="alamat"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Alamat Domisili <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                id="alamat"
                                rows={2}
                                value={keluargaForm.data.alamat}
                                onChange={(e) => keluargaForm.setData('alamat', e.target.value)}
                                placeholder="Contoh: Perumahan Citra Indah Blok AA No. 12, Klaster Bukit Menteng"
                                required
                                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            />
                            <InputError message={keluargaForm.errors.alamat} className="mt-1" />
                        </div>

                        {/* Telepon & Keterangan */}
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
                                    value={keluargaForm.data.telepon}
                                    onChange={(e) => keluargaForm.setData('telepon', e.target.value)}
                                    placeholder="0812xxxxxxx"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={keluargaForm.errors.telepon} className="mt-1" />
                            </div>

                            <div>
                                <label
                                    htmlFor="keterangan"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Catatan Tambahan
                                </label>
                                <input
                                    id="keterangan"
                                    type="text"
                                    value={keluargaForm.data.keterangan}
                                    onChange={(e) => keluargaForm.setData('keterangan', e.target.value)}
                                    placeholder="Pindahan gereja asal, dll..."
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={keluargaForm.errors.keterangan} className="mt-1" />
                            </div>
                        </div>

                        <DialogFooter className="flex gap-2 pt-3">
                            <button
                                type="button"
                                onClick={() => setIsKeluargaModalOpen(false)}
                                className="w-full cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={keluargaForm.processing}
                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-900/10 transition hover:bg-[#152e70] active:scale-95 disabled:opacity-70 sm:w-auto"
                            >
                                {keluargaForm.processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                <span>{editingKeluarga ? 'Simpan Perubahan' : 'Simpan Keluarga'}</span>
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL 2: Create / Edit Anggota Jemaat */}
            <Dialog open={isAnggotaModalOpen} onOpenChange={setIsAnggotaModalOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-[#1e3a8a]">
                            {editingAnggota
                                ? `Ubah Data Anggota: ${editingAnggota.nama}`
                                : `Tambah Anggota: ${selectedKeluargaForAnggota?.nama_keluarga}`}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Masukkan data anggota jemaat. Kategori (Anak, Naposo, Ama, Ina, Duda, Janda) akan dihitung otomatis sesuai data baptis, malua/SIDI, dan pernikahan.
                        </DialogDescription>
                    </DialogHeader>

                    {/* DYNAMIC CATEGORY PREVIEW BANNER */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                                <span className="text-xs font-bold text-slate-700">Kategori Dinamis Terkalkulasi:</span>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${previewKategori.badgeClass}`}>
                                {previewKategori.label}
                            </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">
                            Aturan: {previewKategori.note}
                        </p>
                    </div>

                    <form onSubmit={handleSubmitAnggota} className="space-y-4 pt-1">
                        {/* Nama & Hubungan Keluarga */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                    value={anggotaForm.data.nama}
                                    onChange={(e) => anggotaForm.setData('nama', e.target.value)}
                                    placeholder="Nama anggota jemaat"
                                    required
                                    autoFocus
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={anggotaForm.errors.nama} className="mt-1" />
                            </div>

                            <div>
                                <label
                                    htmlFor="hubungan_keluarga"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Hubungan dalam Keluarga <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="hubungan_keluarga"
                                    value={anggotaForm.data.hubungan_keluarga}
                                    onChange={(e) => anggotaForm.setData('hubungan_keluarga', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                >
                                    <option value="kepala_keluarga">Kepala Keluarga</option>
                                    <option value="istri">Istri</option>
                                    <option value="anak">Anak</option>
                                    <option value="orang_tua">Orang Tua</option>
                                    <option value="famili">Famili Lain</option>
                                </select>
                                <InputError message={anggotaForm.errors.hubungan_keluarga} className="mt-1" />
                            </div>
                        </div>

                        {/* Jenis Kelamin, Tanggal Lahir, Status Pernikahan */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label
                                    htmlFor="jenis_kelamin"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Jenis Kelamin <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="jenis_kelamin"
                                    value={anggotaForm.data.jenis_kelamin}
                                    onChange={(e) => anggotaForm.setData('jenis_kelamin', e.target.value as 'L' | 'P')}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                >
                                    <option value="L">Laki-laki (L)</option>
                                    <option value="P">Perempuan (P)</option>
                                </select>
                                <InputError message={anggotaForm.errors.jenis_kelamin} className="mt-1" />
                            </div>

                            <div>
                                <label
                                    htmlFor="tanggal_lahir"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Tanggal Lahir <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="tanggal_lahir"
                                    type="date"
                                    value={anggotaForm.data.tanggal_lahir}
                                    onChange={(e) => anggotaForm.setData('tanggal_lahir', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={anggotaForm.errors.tanggal_lahir} className="mt-1" />
                            </div>

                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Status Pernikahan <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    value={anggotaForm.data.status}
                                    onChange={(e) =>
                                        anggotaForm.setData('status', e.target.value as 'single' | 'menikah' | 'cerai' | 'cerai_mati')
                                    }
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                >
                                    <option value="single">Single (Belum Menikah)</option>
                                    <option value="menikah">Menikah</option>
                                    <option value="cerai">Cerai Hidup</option>
                                    <option value="cerai_mati">Cerai Mati</option>
                                </select>
                                <InputError message={anggotaForm.errors.status} className="mt-1" />
                            </div>
                        </div>

                        {/* SECTION: SAKRAMEN & DOKUMEN GEREJA */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 space-y-4">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <FileCheck className="h-4 w-4 text-[#1e3a8a]" />
                                Data Sakramen & Upload Dokumen
                            </h4>

                            {/* 1. BAPTIS */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-b border-slate-200/80 pb-3">
                                <div>
                                    <label
                                        htmlFor="tanggal_baptis"
                                        className="mb-1 block text-xs font-semibold text-slate-700"
                                    >
                                        Tanggal Baptis
                                    </label>
                                    <input
                                        id="tanggal_baptis"
                                        type="date"
                                        value={anggotaForm.data.tanggal_baptis}
                                        onChange={(e) => anggotaForm.setData('tanggal_baptis', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs transition-all focus:border-blue-600 focus:outline-none"
                                    />
                                    <InputError message={anggotaForm.errors.tanggal_baptis} className="mt-1" />
                                </div>
                                <div>
                                    <label
                                        htmlFor="file_baptis"
                                        className="mb-1 block text-xs font-semibold text-slate-700"
                                    >
                                        Upload Surat Baptis (PDF / Gambar)
                                    </label>
                                    <input
                                        id="file_baptis"
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) => anggotaForm.setData('file_baptis', e.target.files ? e.target.files[0] : null)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-blue-50 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-[#1e3a8a]"
                                    />
                                    {editingAnggota?.file_baptis_url && (
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            File saat ini:{' '}
                                            <a
                                                href={editingAnggota.file_baptis_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Lihat Dokumen
                                            </a>
                                        </p>
                                    )}
                                    <InputError message={anggotaForm.errors.file_baptis} className="mt-1" />
                                </div>
                            </div>

                            {/* 2. MALUA / SIDI */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-b border-slate-200/80 pb-3">
                                <div>
                                    <label
                                        htmlFor="tanggal_sidi"
                                        className="mb-1 block text-xs font-semibold text-slate-700"
                                    >
                                        Tanggal Malua / SIDI
                                    </label>
                                    <input
                                        id="tanggal_sidi"
                                        type="date"
                                        value={anggotaForm.data.tanggal_sidi}
                                        onChange={(e) => anggotaForm.setData('tanggal_sidi', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs transition-all focus:border-blue-600 focus:outline-none"
                                    />
                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        *Jika sudah ada tanggal SIDI, jemaat berstatus Naposo (sebelum menikah).
                                    </p>
                                    <InputError message={anggotaForm.errors.tanggal_sidi} className="mt-1" />
                                </div>
                                <div>
                                    <label
                                        htmlFor="file_sidi"
                                        className="mb-1 block text-xs font-semibold text-slate-700"
                                    >
                                        Upload Surat SIDI / Malua
                                    </label>
                                    <input
                                        id="file_sidi"
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) => anggotaForm.setData('file_sidi', e.target.files ? e.target.files[0] : null)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-purple-50 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-purple-700"
                                    />
                                    {editingAnggota?.file_sidi_url && (
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            File saat ini:{' '}
                                            <a
                                                href={editingAnggota.file_sidi_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-purple-600 underline"
                                            >
                                                Lihat Dokumen
                                            </a>
                                        </p>
                                    )}
                                    <InputError message={anggotaForm.errors.file_sidi} className="mt-1" />
                                </div>
                            </div>

                            {/* 3. PERNIKAHAN */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="tanggal_menikah"
                                        className="mb-1 block text-xs font-semibold text-slate-700"
                                    >
                                        Tanggal Pemberkatan Pernikahan
                                    </label>
                                    <input
                                        id="tanggal_menikah"
                                        type="date"
                                        value={anggotaForm.data.tanggal_menikah}
                                        onChange={(e) => anggotaForm.setData('tanggal_menikah', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs transition-all focus:border-blue-600 focus:outline-none"
                                    />
                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        *Jika sudah menikah & SIDI, jemaat berstatus Ama (L) / Ina (P).
                                    </p>
                                    <InputError message={anggotaForm.errors.tanggal_menikah} className="mt-1" />
                                </div>
                                <div>
                                    <label
                                        htmlFor="file_menikah"
                                        className="mb-1 block text-xs font-semibold text-slate-700"
                                    >
                                        Upload Surat Nikah Gereja
                                    </label>
                                    <input
                                        id="file_menikah"
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) =>
                                            anggotaForm.setData('file_menikah', e.target.files ? e.target.files[0] : null)
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-emerald-50 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-emerald-700"
                                    />
                                    {editingAnggota?.file_menikah_url && (
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            File saat ini:{' '}
                                            <a
                                                href={editingAnggota.file_menikah_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-emerald-600 underline"
                                            >
                                                Lihat Dokumen
                                            </a>
                                        </p>
                                    )}
                                    <InputError message={anggotaForm.errors.file_menikah} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Telepon & Keterangan */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="anggota_telepon"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    No. Telepon / HP
                                </label>
                                <input
                                    id="anggota_telepon"
                                    type="text"
                                    value={anggotaForm.data.telepon}
                                    onChange={(e) => anggotaForm.setData('telepon', e.target.value)}
                                    placeholder="0812xxxxxxx"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={anggotaForm.errors.telepon} className="mt-1" />
                            </div>

                            <div>
                                <label
                                    htmlFor="anggota_keterangan"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Catatan / Profesi / Pendidikan
                                </label>
                                <input
                                    id="anggota_keterangan"
                                    type="text"
                                    value={anggotaForm.data.keterangan}
                                    onChange={(e) => anggotaForm.setData('keterangan', e.target.value)}
                                    placeholder="Mahasiswa, Guru, dsb..."
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                                />
                                <InputError message={anggotaForm.errors.keterangan} className="mt-1" />
                            </div>
                        </div>

                        <DialogFooter className="flex gap-2 pt-3">
                            <button
                                type="button"
                                onClick={() => setIsAnggotaModalOpen(false)}
                                className="w-full cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={anggotaForm.processing}
                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-900/10 transition hover:bg-[#152e70] active:scale-95 disabled:opacity-70 sm:w-auto"
                            >
                                {anggotaForm.processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                <span>{editingAnggota ? 'Simpan Perubahan' : 'Tambah Anggota'}</span>
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL 3: Detail Kartu Keluarga View */}
            <Dialog open={!!detailKeluarga} onOpenChange={(open) => !open && setDetailKeluarga(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-[#1e3a8a] flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Kartu Keluarga Gereja: {detailKeluarga?.nama_keluarga}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Ringkasan informasi keluarga terdaftar dan seluruh data anggota jemaat.
                        </DialogDescription>
                    </DialogHeader>

                    {detailKeluarga && (
                        <div className="space-y-5 pt-2">
                            {/* Family metadata card */}
                            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-4 text-xs">
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">NRJ</span>
                                    <span className="font-mono font-bold text-[#1e3a8a]">{detailKeluarga.nrj}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Wijk / Wilayah</span>
                                    <span className="font-semibold text-slate-800">
                                        Wijk {detailKeluarga.wilayah?.nomor_wilayah} ({detailKeluarga.wilayah?.name})
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tgl Terdaftar</span>
                                    <span className="font-semibold text-slate-800">{detailKeluarga.tanggal_terdaftar}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Kontak Telepon</span>
                                    <span className="font-semibold text-slate-800">{detailKeluarga.telepon || '-'}</span>
                                </div>
                                <div className="col-span-2 sm:col-span-4 border-t border-slate-200/60 pt-2 mt-1">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Alamat</span>
                                    <span className="text-slate-700">{detailKeluarga.alamat}</span>
                                </div>
                            </div>

                            {/* Members table */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                                    Daftar Anggota Keluarga ({detailKeluarga.anggota?.length || 0} Jiwa)
                                </h4>
                                <div className="overflow-x-auto rounded-xl border border-slate-100">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                                            <tr>
                                                <th className="py-2.5 px-3">Nama</th>
                                                <th className="py-2.5 px-3">Hubungan</th>
                                                <th className="py-2.5 px-3">L/P</th>
                                                <th className="py-2.5 px-3">Usia</th>
                                                <th className="py-2.5 px-3">Status</th>
                                                <th className="py-2.5 px-3 text-center">Kategori</th>
                                                <th className="py-2.5 px-3">Dokumen</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {detailKeluarga.anggota?.map((m) => (
                                                <tr key={m.id} className="hover:bg-slate-50/50">
                                                    <td className="py-2.5 px-3 font-semibold text-slate-900">{m.nama}</td>
                                                    <td className="py-2.5 px-3">
                                                        <span
                                                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${getHubunganBadge(
                                                                m.hubungan_keluarga
                                                            )}`}
                                                        >
                                                            {formatHubunganLabel(m.hubungan_keluarga)}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3 font-bold">
                                                        {m.jenis_kelamin === 'L' ? (
                                                            <span className="text-blue-600">L</span>
                                                        ) : (
                                                            <span className="text-pink-600">P</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-slate-600">
                                                        {calculateAge(m.tanggal_lahir)} thn
                                                    </td>
                                                    <td className="py-2.5 px-3">{m.status_label}</td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${getKategoriBadge(
                                                                m.kategori
                                                            )}`}
                                                        >
                                                            {m.kategori_label}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3">
                                                        <div className="flex items-center gap-1.5">
                                                            {m.file_baptis_url && (
                                                                <a
                                                                    href={m.file_baptis_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-0.5 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 hover:underline"
                                                                >
                                                                    Baptis
                                                                </a>
                                                            )}
                                                            {m.file_sidi_url && (
                                                                <a
                                                                    href={m.file_sidi_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-0.5 rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 hover:underline"
                                                                >
                                                                    SIDI
                                                                </a>
                                                            )}
                                                            {m.file_menikah_url && (
                                                                <a
                                                                    href={m.file_menikah_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 hover:underline"
                                                                >
                                                                    Nikah
                                                                </a>
                                                            )}
                                                            {!m.file_baptis_url && !m.file_sidi_url && !m.file_menikah_url && (
                                                                <span className="text-slate-300 italic text-[11px]">
                                                                    Tidak ada file
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-3">
                        <button
                            type="button"
                            onClick={() => setDetailKeluarga(null)}
                            className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition sm:w-auto"
                        >
                            Tutup
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL 4: Delete Confirmation Keluarga */}
            <Dialog open={isDeleteKeluargaOpen} onOpenChange={setIsDeleteKeluargaOpen}>
                <DialogContent className="rounded-2xl bg-white p-6 text-center sm:max-w-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-base font-bold text-slate-900">
                        Hapus Data Keluarga?
                    </DialogTitle>
                    <DialogDescription className="mt-1 mb-5 text-xs text-slate-500">
                        Apakah Anda yakin ingin menghapus data keluarga{' '}
                        <strong className="text-slate-800">
                            &quot;{deletingKeluarga?.nama_keluarga}&quot; ({deletingKeluarga?.nrj})
                        </strong>
                        ? Seluruh data anggota dan berkas di dalamnya akan ikut terhapus.
                    </DialogDescription>

                    <div className="flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsDeleteKeluargaOpen(false)}
                            className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDeleteKeluarga}
                            disabled={deleteForm.processing}
                            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 active:scale-95 disabled:opacity-70"
                        >
                            {deleteForm.processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            <span>Hapus</span>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* MODAL 5: Delete Confirmation Anggota */}
            <Dialog open={isDeleteAnggotaOpen} onOpenChange={setIsDeleteAnggotaOpen}>
                <DialogContent className="rounded-2xl bg-white p-6 text-center sm:max-w-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-base font-bold text-slate-900">
                        Hapus Anggota Jemaat?
                    </DialogTitle>
                    <DialogDescription className="mt-1 mb-5 text-xs text-slate-500">
                        Apakah Anda yakin ingin menghapus anggota{' '}
                        <strong className="text-slate-800">&quot;{deletingAnggota?.nama}&quot;</strong>?
                        Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>

                    <div className="flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsDeleteAnggotaOpen(false)}
                            className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDeleteAnggota}
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

MasterJemaat.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Master Jemaat',
            href: '/master/jemaat',
        },
    ],
};

