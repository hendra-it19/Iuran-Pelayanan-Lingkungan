<?php

namespace App\Http\Controllers;

use App\Models\Warga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WargaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $blok = $request->input('blok');

        $query = Warga::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('no_rumah', 'like', "%{$search}%");
            });
        }

        if ($blok) {
            $query->where('blok', $blok);
        }

        $wargas = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('warga/index', [
            'wargas' => $wargas,
            'filters' => $request->only(['search', 'blok']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:255',
            'no_rumah' => 'required|string|max:255',
            'blok' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'nominal_ipl_tetap' => 'required|integer|min:0',
        ]);

        Warga::create($validated);

        return back()->with('success', 'Data Warga berhasil ditambahkan.');
    }

    public function update(Request $request, Warga $warga)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:255',
            'no_rumah' => 'required|string|max:255',
            'blok' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'nominal_ipl_tetap' => 'required|integer|min:0',
        ]);

        $warga->update($validated);

        return back()->with('success', 'Data Warga berhasil diperbarui.');
    }

    public function destroy(Warga $warga)
    {
        $warga->delete();

        return back()->with('success', 'Data Warga berhasil dihapus.');
    }

    public function bulkUpdateIpl(Request $request)
    {
        $validated = $request->validate([
            'target' => 'required|in:all,blok',
            'blok' => 'required_if:target,blok|nullable|string',
            'nominal' => 'required|integer|min:0',
        ]);

        $query = Warga::query();

        if ($validated['target'] === 'blok') {
            $query->where('blok', $validated['blok']);
        }

        $count = $query->count();
        $query->update(['nominal_ipl_tetap' => $validated['nominal']]);

        return back()->with('success', "Nominal IPL berhasil diperbarui untuk {$count} warga.");
    }
}
