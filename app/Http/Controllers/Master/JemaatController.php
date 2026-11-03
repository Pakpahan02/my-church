<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Jemaat;
use App\Models\Keluarga;
use App\Models\Wilayah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class JemaatController extends Controller
{
    /**
     * Display a listing of Keluarga & Jemaat.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $wilayahId = $request->input('wilayah_id');
        $kategoriFilter = $request->input('kategori');

        $keluargasQuery = Keluarga::query()
            ->with(['wilayah', 'anggota'])
            ->withCount('anggota')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nrj', 'like', "%{$search}%")
                        ->orWhere('nama_keluarga', 'like', "%{$search}%")
                        ->orWhere('alamat', 'like', "%{$search}%")
                        ->orWhereHas('anggota', function ($sub) use ($search) {
                            $sub->where('nama', 'like', "%{$search}%");
                        });
                });
            })
            ->when($wilayahId, function ($query, $wilayahId) {
                $query->where('wilayah_id', $wilayahId);
            })
            ->when($kategoriFilter, function ($query, $kategori) {
                $query->whereHas('anggota', function ($sub) use ($kategori) {
                    // Filter berdasarkan kategori dinamis
                    match ($kategori) {
                        'duda' => $sub->whereIn('status', ['cerai', 'cerai_mati'])->where('jenis_kelamin', 'L'),
                        'janda' => $sub->whereIn('status', ['cerai', 'cerai_mati'])->where('jenis_kelamin', 'P'),
                        'ama' => $sub->where(function ($q) {
                            $q->whereNotNull('tanggal_menikah')->orWhere('status', 'menikah');
                        })->where('jenis_kelamin', 'L'),
                        'ina' => $sub->where(function ($q) {
                            $q->whereNotNull('tanggal_menikah')->orWhere('status', 'menikah');
                        })->where('jenis_kelamin', 'P'),
                        'naposo' => $sub->whereNotNull('tanggal_sidi')
                            ->whereNull('tanggal_menikah')
                            ->whereNotIn('status', ['menikah', 'cerai', 'cerai_mati']),
                        'anak' => $sub->whereNull('tanggal_sidi')
                            ->whereNull('tanggal_menikah')
                            ->whereNotIn('status', ['menikah', 'cerai', 'cerai_mati']),
                        'anak_laki' => $sub->whereNull('tanggal_sidi')
                            ->whereNull('tanggal_menikah')
                            ->whereNotIn('status', ['menikah', 'cerai', 'cerai_mati'])
                            ->where('jenis_kelamin', 'L'),
                        'anak_perempuan' => $sub->whereNull('tanggal_sidi')
                            ->whereNull('tanggal_menikah')
                            ->whereNotIn('status', ['menikah', 'cerai', 'cerai_mati'])
                            ->where('jenis_kelamin', 'P'),
                        default => null,
                    };
                });
            })
            ->orderBy('nama_keluarga', 'asc');

        $keluargas = $keluargasQuery->paginate(10)->withQueryString();

        // Wilayah list for filter & select dropdown
        $wilayahs = Wilayah::query()
            ->orderByRaw('CAST(nomor_wilayah AS UNSIGNED) ASC, nomor_wilayah ASC, id ASC')
            ->get(['id', 'nomor_wilayah', 'name']);

        // Overall stats
        $totalKeluarga = Keluarga::count();
        $totalJiwa = Jemaat::count();
        $totalAma = Jemaat::where(fn($q) => $q->whereNotNull('tanggal_menikah')->orWhere('status', 'menikah'))
            ->whereNotIn('status', ['cerai', 'cerai_mati'])
            ->where('jenis_kelamin', 'L')
            ->count();
        $totalIna = Jemaat::where(fn($q) => $q->whereNotNull('tanggal_menikah')->orWhere('status', 'menikah'))
            ->whereNotIn('status', ['cerai', 'cerai_mati'])
            ->where('jenis_kelamin', 'P')
            ->count();
        $totalNaposo = Jemaat::whereNotNull('tanggal_sidi')
            ->whereNull('tanggal_menikah')
            ->whereNotIn('status', ['menikah', 'cerai', 'cerai_mati'])
            ->count();
        $totalAnak = Jemaat::whereNull('tanggal_sidi')
            ->whereNull('tanggal_menikah')
            ->whereNotIn('status', ['menikah', 'cerai', 'cerai_mati'])
            ->count();
        $totalDuda = Jemaat::whereIn('status', ['cerai', 'cerai_mati'])->where('jenis_kelamin', 'L')->count();
        $totalJanda = Jemaat::whereIn('status', ['cerai', 'cerai_mati'])->where('jenis_kelamin', 'P')->count();

        return Inertia::render('master/jemaat/index', [
            'keluargas' => $keluargas,
            'wilayahs' => $wilayahs,
            'filters' => [
                'search' => $search,
                'wilayah_id' => $wilayahId,
                'kategori' => $kategoriFilter,
            ],
            'stats' => [
                'total_keluarga' => $totalKeluarga,
                'total_jiwa' => $totalJiwa,
                'total_ama' => $totalAma,
                'total_ina' => $totalIna,
                'total_naposo' => $totalNaposo,
                'total_anak' => $totalAnak,
                'total_duda' => $totalDuda,
                'total_janda' => $totalJanda,
            ],
        ]);
    }

    /**
     * Store Keluarga baru.
     */
    public function storeKeluarga(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nrj' => ['required', 'string', 'max:50', 'unique:keluargas,nrj'],
            'nama_keluarga' => ['required', 'string', 'max:255'],
            'wilayah_id' => ['required', 'exists:wilayahs,id'],
            'alamat' => ['required', 'string'],
            'tanggal_terdaftar' => ['required', 'date'],
            'telepon' => ['nullable', 'string', 'max:50'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ]);

        Keluarga::create($validated);

        return redirect()->route('master.jemaat.index')->with('success', 'Data Keluarga berhasil didaftarkan.');
    }

    /**
     * Update Keluarga.
     */
    public function updateKeluarga(Request $request, Keluarga $keluarga): RedirectResponse
    {
        $validated = $request->validate([
            'nrj' => ['required', 'string', 'max:50', Rule::unique('keluargas', 'nrj')->ignore($keluarga->id)],
            'nama_keluarga' => ['required', 'string', 'max:255'],
            'wilayah_id' => ['required', 'exists:wilayahs,id'],
            'alamat' => ['required', 'string'],
            'tanggal_terdaftar' => ['required', 'date'],
            'telepon' => ['nullable', 'string', 'max:50'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ]);

        $keluarga->update($validated);

        return redirect()->route('master.jemaat.index')->with('success', 'Data Keluarga berhasil diperbarui.');
    }

    /**
     * Delete Keluarga beserta anggotanya.
     */
    public function destroyKeluarga(Keluarga $keluarga): RedirectResponse
    {
        // Delete all uploaded files for anggota in this family
        foreach ($keluarga->anggota as $anggota) {
            $this->deleteJemaatFiles($anggota);
        }

        $keluarga->delete();

        return redirect()->route('master.jemaat.index')->with('success', 'Data Keluarga berhasil dihapus.');
    }

    /**
     * Store Anggota Jemaat dalam Keluarga.
     */
    public function storeAnggota(Request $request, Keluarga $keluarga): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'tanggal_lahir' => ['required', 'date'],
            'status' => ['required', Rule::in(['single', 'menikah', 'cerai', 'cerai_mati'])],
            'hubungan_keluarga' => ['nullable', 'string', 'max:100'],
            'tanggal_baptis' => ['nullable', 'date'],
            'file_baptis' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'tanggal_sidi' => ['nullable', 'date'],
            'file_sidi' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'tanggal_menikah' => ['nullable', 'date'],
            'file_menikah' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'telepon' => ['nullable', 'string', 'max:50'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ]);

        // Upload files if present
        if ($request->hasFile('file_baptis')) {
            $validated['file_baptis'] = $request->file('file_baptis')->store('jemaat/baptis', 'public');
        }
        if ($request->hasFile('file_sidi')) {
            $validated['file_sidi'] = $request->file('file_sidi')->store('jemaat/sidi', 'public');
        }
        if ($request->hasFile('file_menikah')) {
            $validated['file_menikah'] = $request->file('file_menikah')->store('jemaat/menikah', 'public');
        }

        $validated['keluarga_id'] = $keluarga->id;

        Jemaat::create($validated);

        return redirect()->route('master.jemaat.index')->with('success', "Anggota jemaat {$validated['nama']} berhasil ditambahkan.");
    }

    /**
     * Update Anggota Jemaat.
     */
    public function updateAnggota(Request $request, Jemaat $jemaat): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'tanggal_lahir' => ['required', 'date'],
            'status' => ['required', Rule::in(['single', 'menikah', 'cerai', 'cerai_mati'])],
            'hubungan_keluarga' => ['nullable', 'string', 'max:100'],
            'tanggal_baptis' => ['nullable', 'date'],
            'file_baptis' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'tanggal_sidi' => ['nullable', 'date'],
            'file_sidi' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'tanggal_menikah' => ['nullable', 'date'],
            'file_menikah' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'telepon' => ['nullable', 'string', 'max:50'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ]);

        // Handle file uploads & remove old files
        if ($request->hasFile('file_baptis')) {
            if ($jemaat->file_baptis && Storage::disk('public')->exists($jemaat->file_baptis)) {
                Storage::disk('public')->delete($jemaat->file_baptis);
            }
            $validated['file_baptis'] = $request->file('file_baptis')->store('jemaat/baptis', 'public');
        }
        if ($request->hasFile('file_sidi')) {
            if ($jemaat->file_sidi && Storage::disk('public')->exists($jemaat->file_sidi)) {
                Storage::disk('public')->delete($jemaat->file_sidi);
            }
            $validated['file_sidi'] = $request->file('file_sidi')->store('jemaat/sidi', 'public');
        }
        if ($request->hasFile('file_menikah')) {
            if ($jemaat->file_menikah && Storage::disk('public')->exists($jemaat->file_menikah)) {
                Storage::disk('public')->delete($jemaat->file_menikah);
            }
            $validated['file_menikah'] = $request->file('file_menikah')->store('jemaat/menikah', 'public');
        }

        $jemaat->update($validated);

        return redirect()->route('master.jemaat.index')->with('success', "Data anggota jemaat {$jemaat->nama} berhasil diperbarui.");
    }

    /**
     * Delete Anggota Jemaat.
     */
    public function destroyAnggota(Jemaat $jemaat): RedirectResponse
    {
        $nama = $jemaat->nama;
        $this->deleteJemaatFiles($jemaat);
        $jemaat->delete();

        return redirect()->route('master.jemaat.index')->with('success', "Anggota jemaat {$nama} berhasil dihapus.");
    }

    /**
     * Helper to delete uploaded files of a jemaat.
     */
    private function deleteJemaatFiles(Jemaat $jemaat): void
    {
        if ($jemaat->file_baptis && Storage::disk('public')->exists($jemaat->file_baptis)) {
            Storage::disk('public')->delete($jemaat->file_baptis);
        }
        if ($jemaat->file_sidi && Storage::disk('public')->exists($jemaat->file_sidi)) {
            Storage::disk('public')->delete($jemaat->file_sidi);
        }
        if ($jemaat->file_menikah && Storage::disk('public')->exists($jemaat->file_menikah)) {
            Storage::disk('public')->delete($jemaat->file_menikah);
        }
    }
}

