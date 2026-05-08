<?php

namespace App\Http\Controllers;

use App\Exports\TunggakanExport;
use App\Models\Setting;
use App\Models\Tagihan;
use App\Models\Warga;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TunggakanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $blok = $request->input('blok');

        $query = Warga::select('wargas.*')
            ->addSelect([
                'jumlah_tunggakan' => Tagihan::selectRaw('COUNT(*)')
                    ->whereColumn('warga_id', 'wargas.id')
                    ->where('status', 'Belum Lunas'),
                'total_tunggakan' => Tagihan::selectRaw('COALESCE(SUM(nominal), 0)')
                    ->whereColumn('warga_id', 'wargas.id')
                    ->where('status', 'Belum Lunas'),
            ])
            ->whereHas('tagihans', fn ($q) => $q->where('status', 'Belum Lunas'));

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('no_rumah', 'like', "%{$search}%");
            });
        }

        if ($blok) {
            $query->where('blok', $blok);
        }

        $tunggakans = $query->orderBy('blok')
            ->orderByRaw('CAST(no_rumah AS UNSIGNED) ASC')
            ->orderBy('no_rumah')
            ->paginate(15)
            ->withQueryString();

        // Enrich each item with detail of unpaid months
        $tunggakans->getCollection()->transform(function ($warga) {
            $unpaidBills = Tagihan::where('warga_id', $warga->id)
                ->where('status', 'Belum Lunas')
                ->orderBy('tahun')
                ->orderBy('bulan')
                ->get(['bulan', 'tahun', 'nominal']);

            $warga->unpaid_bills = $unpaidBills;

            return $warga;
        });

        // Summary stats
        $totalWargaTunggakan = Warga::whereHas('tagihans', fn ($q) => $q->where('status', 'Belum Lunas'))->count();
        $totalNominalTunggakan = Tagihan::where('status', 'Belum Lunas')->sum('nominal');

        return Inertia::render('tunggakan/index', [
            'tunggakans' => $tunggakans,
            'filters' => $request->only(['search', 'blok']),
            'summary' => [
                'total_warga' => $totalWargaTunggakan,
                'total_nominal' => $totalNominalTunggakan,
            ],
        ]);
    }

    public function exportExcel(Request $request)
    {
        $blok = $request->input('blok');
        $search = $request->input('search');
        $filename = 'Rekap_Tunggakan_IPL_'.date('Y-m-d').'.xlsx';

        return Excel::download(new TunggakanExport($blok, $search), $filename);
    }

    public function exportPdf(Request $request)
    {
        $blok = $request->input('blok');
        $search = $request->input('search');

        $query = Warga::select('wargas.*')
            ->addSelect([
                'jumlah_tunggakan' => Tagihan::selectRaw('COUNT(*)')
                    ->whereColumn('warga_id', 'wargas.id')
                    ->where('status', 'Belum Lunas'),
                'total_tunggakan' => Tagihan::selectRaw('COALESCE(SUM(nominal), 0)')
                    ->whereColumn('warga_id', 'wargas.id')
                    ->where('status', 'Belum Lunas'),
            ])
            ->whereHas('tagihans', fn ($q) => $q->where('status', 'Belum Lunas'));

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('no_rumah', 'like', "%{$search}%");
            });
        }

        if ($blok) {
            $query->where('blok', $blok);
        }

        $data = $query->orderBy('blok')
            ->orderByRaw('CAST(no_rumah AS UNSIGNED) ASC')
            ->orderBy('no_rumah')
            ->get();

        $totalNominal = $data->sum('total_tunggakan');
        $settings = Setting::first();

        $pdf = Pdf::loadView('exports.tunggakan-pdf', [
            'data' => $data,
            'totalNominal' => $totalNominal,
            'settings' => $settings,
            'filterBlok' => $blok,
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Rekap_Tunggakan_IPL_'.date('Y-m-d').'.pdf');
    }
}
