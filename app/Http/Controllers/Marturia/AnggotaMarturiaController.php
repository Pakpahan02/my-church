<?php

namespace App\Http\Controllers\Marturia;

use App\Enum\JabatanMarturiaEnum;
use App\Http\Controllers\Controller;
use App\Models\AnggotaMarturia;
use App\Models\Jemaat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AnggotaMarturiaController extends Controller
{
    /**
     * Display a listing of Anggota Marturia.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $jabatanFilter = $request->input('jabatan');
        $statusFilter = $request->input('status');

        $anggotaList = AnggotaMarturia::query()
            ->with(['jemaat.keluarga.wilayah'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('telepon', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('instrumen', 'like', "%{$search}%")
                        ->orWhere('keterangan', 'like', "%{$search}%");
                });
            })
            ->when($jabatanFilter, function ($query, $jabatan) {
                $query->where('jabatan', $jabatan);
            })
            ->when($statusFilter !== null && $statusFilter !== '', function ($query) use ($statusFilter) {
                $query->where('is_active', $statusFilter === '1');
            })
            ->orderBy('is_active', 'desc')
            ->orderBy('nama', 'asc')
            ->paginate(10)
            ->withQueryString();

        // Enum options for select & filter
        $jabatans = collect(JabatanMarturiaEnum::cases())->map(fn(JabatanMarturiaEnum $item) => [
            'value' => $item->value,
            'label' => $item->label(),
            'kelompok' => $item->kelompok(),
            'badgeClass' => $item->badgeClass(),
        ])->values()->all();

        // List jemaat for link/autocomplete
        $jemaats = Jemaat::query()
            ->with(['keluarga.wilayah'])
            ->orderBy('nama', 'asc')
            ->get(['id', 'keluarga_id', 'nama', 'jenis_kelamin', 'telepon'])
            ->map(fn($j) => [
                'id' => $j->id,
                'nama' => $j->nama,
                'telepon' => $j->telepon,
                'wijk' => $j->keluarga?->wilayah ? 'Wijk ' . $j->keluarga->wilayah->nomor_wilayah : null,
            ]);

        // Statistics
        $totalAnggota = AnggotaMarturia::count();
        $totalAktif = AnggotaMarturia::where('is_active', true)->count();
        $totalDewan = AnggotaMarturia::whereIn('jabatan', [
            JabatanMarturiaEnum::DEWAN_MARTURIA->value,
            JabatanMarturiaEnum::ANGGOTA_MARTURIA->value,
        ])->count();
        $totalMultimedia = AnggotaMarturia::whereIn('jabatan', [
            JabatanMarturiaEnum::KETUA_MULTIMEDIA->value,
            JabatanMarturiaEnum::ANGGOTA_MULTIMEDIA->value,
        ])->count();
        $totalPemusik = AnggotaMarturia::whereIn('jabatan', [
            JabatanMarturiaEnum::KETUA_SEKSI_MUSIK->value,
            JabatanMarturiaEnum::ORGANIS->value,
            JabatanMarturiaEnum::TAGADING->value,
            JabatanMarturiaEnum::PEMUSIK_BAND->value,
        ])->count();
        $totalSongLeader = AnggotaMarturia::where('jabatan', JabatanMarturiaEnum::SONG_LEADER->value)->count();

        return Inertia::render('marturia/anggota/index', [
            'anggotaList' => $anggotaList,
            'jabatans' => $jabatans,
            'jemaats' => $jemaats,
            'filters' => [
                'search' => $search,
                'jabatan' => $jabatanFilter,
                'status' => $statusFilter,
            ],
            'stats' => [
                'total_anggota' => $totalAnggota,
                'total_aktif' => $totalAktif,
                'total_dewan' => $totalDewan,
                'total_multimedia' => $totalMultimedia,
                'total_pemusik' => $totalPemusik,
                'total_song_leader' => $totalSongLeader,
            ],
        ]);
    }

    /**
     * Store Anggota Marturia baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jemaat_id' => ['nullable', 'exists:jemaats,id'],
            'nama' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', Rule::in(array_column(JabatanMarturiaEnum::cases(), 'value'))],
            'telepon' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'instrumen' => ['nullable', 'string', 'max:100'],
            'tanggal_bergabung' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;

        AnggotaMarturia::create($validated);

        return redirect()->route('marturia.anggota.index')->with('success', "Anggota Marturia {$validated['nama']} berhasil ditambahkan.");
    }

    /**
     * Update Anggota Marturia.
     */
    public function update(Request $request, AnggotaMarturia $anggota): RedirectResponse
    {
        $validated = $request->validate([
            'jemaat_id' => ['nullable', 'exists:jemaats,id'],
            'nama' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', Rule::in(array_column(JabatanMarturiaEnum::cases(), 'value'))],
            'telepon' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'instrumen' => ['nullable', 'string', 'max:100'],
            'tanggal_bergabung' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;

        $anggota->update($validated);

        return redirect()->route('marturia.anggota.index')->with('success', "Data Anggota Marturia {$anggota->nama} berhasil diperbarui.");
    }

    /**
     * Delete Anggota Marturia.
     */
    public function destroy(AnggotaMarturia $anggota): RedirectResponse
    {
        $nama = $anggota->nama;
        $anggota->delete();

        return redirect()->route('marturia.anggota.index')->with('success', "Anggota Marturia {$nama} berhasil dihapus.");
    }
}
