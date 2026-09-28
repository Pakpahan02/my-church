import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    MapPin,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    AlertCircle,
    X,
    ChevronLeft,
    ChevronRight,
    Building2,
    Loader2,
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

interface Wilayah {
    id: number;
    nomor_wilayah: string | null;
    name: string;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedWilayah {
    data: Wilayah[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Props {
    wilayahs: PaginatedWilayah;
    filters: {
        search?: string;
    };
}

export default function MasterWilayah({ wilayahs, filters }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    // Search state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingWilayah, setEditingWilayah] = useState<Wilayah | null>(null);

    // Delete confirmation state
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingWilayah, setDeletingWilayah] = useState<Wilayah | null>(
        null,
    );

    // Form handling
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            nomor_wilayah: '',
            name: '',
            keterangan: '',
        });

    const deleteForm = useForm({});

    // Open Modal for Create
    const handleOpenCreate = () => {
        setEditingWilayah(null);
        clearErrors();
        reset();
        setIsFormOpen(true);
    };

    // Open Modal for Edit
    const handleOpenEdit = (item: Wilayah) => {
        setEditingWilayah(item);
        clearErrors();
        setData({
            nomor_wilayah: item.nomor_wilayah || '',
            name: item.name,
            keterangan: item.keterangan || '',
        });
        setIsFormOpen(true);
    };

    // Open Delete Dialog
    const handleOpenDelete = (item: Wilayah) => {
        setDeletingWilayah(item);
        setIsDeleteOpen(true);
    };

    // Submit Create or Update
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingWilayah) {
            put(`/master/wilayah/${editingWilayah.id}`, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        } else {
            post('/master/wilayah', {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        }
    };

    // Confirm Delete
    const handleConfirmDelete = () => {
        if (!deletingWilayah) return;

        deleteForm.delete(`/master/wilayah/${deletingWilayah.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingWilayah(null);
            },
        });
    };

    // Trigger Search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/master/wilayah',
            { search: searchQuery },
            { preserveState: true, replace: true },
        );
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        router.get(
            '/master/wilayah',
            {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Master Wilayah - HKBP Citra Indah" />

            <div className="flex min-h-screen flex-col gap-6 bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                {/* 1. Header & Actions Bar */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1e3a8a] ring-4 ring-blue-50/60">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[#1e3a8a] sm:text-2xl">
                                Master Wilayah
                            </h1>
                            <p className="text-xs text-slate-500 sm:text-sm">
                                Kelola data wilayah / wijk pelayanan jemaat HKBP
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
                            <span>Tambah Wilayah</span>
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

                {/* 3. Search Bar & Count Stats */}
                <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
                    <form
                        onSubmit={handleSearch}
                        className="relative max-w-md flex-1"
                    >
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nomor, nama wilayah, atau keterangan..."
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
                                {wilayahs.total}
                            </strong>{' '}
                            Wilayah
                        </span>
                    </div>
                </div>

                {/* 4. Data Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold tracking-wider text-slate-600 uppercase">
                                    <th className="w-28 px-4 py-3.5 text-center">
                                        No. Wilayah
                                    </th>
                                    <th className="px-4 py-3.5">
                                        Nama Wilayah
                                    </th>
                                    <th className="px-4 py-3.5">Keterangan</th>
                                    <th className="w-32 px-4 py-3.5 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {wilayahs.data.length > 0 ? (
                                    wilayahs.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="group transition-colors hover:bg-blue-50/40"
                                        >
                                            {/* No. Wilayah */}
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center rounded-lg border border-blue-200/60 bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-[#1e3a8a] shadow-2xs">
                                                    {item.nomor_wilayah
                                                        ? `Wijk ${item.nomor_wilayah}`
                                                        : `#${item.id}`}
                                                </span>
                                            </td>

                                            {/* Nama Wilayah */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                                                        <Building2 className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Keterangan */}
                                            <td className="px-4 py-4 text-slate-600">
                                                {item.keterangan ? (
                                                    <span className="line-clamp-2 text-xs sm:text-sm">
                                                        {item.keterangan}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">
                                                        Tidak ada keterangan
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
                                                        className="cursor-pointer rounded-lg p-1.5 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
                                                        title="Hapus Wilayah"
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
                                            colSpan={4}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                    <MapPin className="h-6 w-6" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    Belum Ada Data Wilayah
                                                </h3>
                                                <p className="mt-1 mb-4 max-w-sm text-xs text-slate-500">
                                                    {filters.search
                                                        ? `Tidak ditemukan wilayah dengan kata kunci "${filters.search}"`
                                                        : 'Silakan tambahkan data wijk / wilayah pelayanan gereja pertama Anda.'}
                                                </p>
                                                {filters.search ? (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleClearSearch
                                                        }
                                                        className="text-xs font-semibold text-blue-600 hover:underline"
                                                    >
                                                        Hapus Pencarian
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
                    {wilayahs.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 text-xs text-slate-500 sm:flex-row">
                            <div>
                                Menampilkan {wilayahs.from || 0} -{' '}
                                {wilayahs.to || 0} dari {wilayahs.total} data
                            </div>
                            <div className="flex items-center gap-1">
                                {wilayahs.links.map((link, idx) => {
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
                <DialogContent className="rounded-2xl bg-white p-6 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-[#1e3a8a]">
                            {editingWilayah
                                ? 'Ubah Data Wilayah'
                                : 'Tambah Wilayah Baru'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            {editingWilayah
                                ? 'Perbarui informasi nama wilayah atau keterangan pelayanan.'
                                : 'Masukkan nama wilayah dan keterangan untuk mendata wijk gereja.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {/* Nomor Wilayah Field */}
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label
                                    htmlFor="nomor_wilayah"
                                    className="block text-xs font-bold tracking-wider text-slate-700 uppercase"
                                >
                                    Nomor Wilayah{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <span className="text-[11px] text-slate-400">
                                    Manual (Pemekaran wilayah)
                                </span>
                            </div>
                            <input
                                id="nomor_wilayah"
                                type="text"
                                value={data.nomor_wilayah}
                                onChange={(e) =>
                                    setData('nomor_wilayah', e.target.value)
                                }
                                placeholder="Contoh: 01, 1, 1A, atau W-01"
                                required
                                autoFocus
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            />
                            <p className="mt-1 text-[11px] text-slate-400">
                                Nomor/kode wijk dapat ditentukan manual untuk
                                kebutuhan pemekaran wijk baru.
                            </p>
                            <InputError
                                message={errors.nomor_wilayah}
                                className="mt-1"
                            />
                        </div>

                        {/* Name Field */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Nama Wilayah{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Contoh: Wijk 1 - Bukit Menteng"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-1"
                            />
                        </div>

                        {/* Keterangan Field */}
                        <div>
                            <label
                                htmlFor="keterangan"
                                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
                            >
                                Keterangan
                            </label>
                            <textarea
                                id="keterangan"
                                rows={3}
                                value={data.keterangan}
                                onChange={(e) =>
                                    setData('keterangan', e.target.value)
                                }
                                placeholder="Cakupan klaster, blok perumahan, atau catatan lainnya..."
                                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                            />
                            <InputError
                                message={errors.keterangan}
                                className="mt-1"
                            />
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
                                    {editingWilayah
                                        ? 'Simpan Perubahan'
                                        : 'Tambah Wilayah'}
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
                        Hapus Wilayah?
                    </DialogTitle>
                    <DialogDescription className="mt-1 mb-5 text-xs text-slate-500">
                        Apakah Anda yakin ingin menghapus data wilayah{' '}
                        <strong className="text-slate-800">
                            &quot;{deletingWilayah?.name}&quot;
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

MasterWilayah.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Master Wilayah',
            href: '/master/wilayah',
        },
    ],
};
