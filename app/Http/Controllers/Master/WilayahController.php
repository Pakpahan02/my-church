<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Wilayah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WilayahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $wilayahs = Wilayah::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('nomor_wilayah', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%");
            })
            ->orderByRaw('CAST(nomor_wilayah AS UNSIGNED) ASC, nomor_wilayah ASC, id ASC')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('master/wilayah/index', [
            'wilayahs' => $wilayahs,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): RedirectResponse
    {
        return redirect()->route('master.wilayah.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_wilayah' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ]);

        Wilayah::create($validated);

        return redirect()->route('master.wilayah.index')->with('success', 'Wilayah berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Wilayah $wilayah)
    {
        if ($request->wantsJson()) {
            return response()->json($wilayah);
        }

        return redirect()->route('master.wilayah.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Wilayah $wilayah)
    {
        if ($request->wantsJson()) {
            return response()->json($wilayah);
        }

        return redirect()->route('master.wilayah.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Wilayah $wilayah): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_wilayah' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ]);

        $wilayah->update($validated);

        return redirect()->route('master.wilayah.index')->with('success', 'Wilayah berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wilayah $wilayah): RedirectResponse
    {
        $wilayah->delete();

        return redirect()->route('master.wilayah.index')->with('success', 'Wilayah berhasil dihapus.');
    }
}
