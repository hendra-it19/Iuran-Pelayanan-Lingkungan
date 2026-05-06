<?php

namespace App\Http\Controllers;

use App\Exports\TagihanExport;
use App\Models\Setting;
use App\Models\Tagihan;
use App\Models\Warga;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TagihanController extends Controller
{
    public function index(Request $request)
    {
        $bulan = $request->input('bulan', date('n'));
        $tahun = $request->input('tahun', date('Y'));
        $status = $request->input('status');

        $query = Tagihan::with('warga')->where('bulan', $bulan)->where('tahun', $tahun);

        if ($status && in_array($status, ['Belum Lunas', 'Lunas'])) {
            $query->where('status', $status);
        }

        $tagihans = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('tagihan/index', [
            'tagihans' => $tagihans,
            'filters' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
                'status' => $status,
            ],
        ]);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2020|max:2099',
        ]);

        $bulan = $validated['bulan'];
        $tahun = $validated['tahun'];

        $countCreated = 0;

        // Use chunk to not overload memory
        Warga::chunk(100, function ($wargas) use ($bulan, $tahun, &$countCreated) {
            $inserts = [];

            // Collect existing warga_ids for this month/year to avoid duplicate inserting
            $existingWargaIds = Tagihan::where('bulan', $bulan)
                ->where('tahun', $tahun)
                ->whereIn('warga_id', $wargas->pluck('id'))
                ->pluck('warga_id')
                ->toArray();

            foreach ($wargas as $warga) {
                if (! in_array($warga->id, $existingWargaIds)) {
                    $inserts[] = [
                        'warga_id' => $warga->id,
                        'bulan' => $bulan,
                        'tahun' => $tahun,
                        'nominal' => $warga->nominal_ipl_tetap,
                        'status' => 'Belum Lunas',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $countCreated++;
                }
            }

            if (! empty($inserts)) {
                Tagihan::insert($inserts);
            }
        });

        if ($countCreated > 0) {
            return back()->with('success', "Berhasil generate {$countCreated} tagihan untuk bulan {$bulan}/{$tahun}.");
        }

        return back()->with('message', 'Tagihan untuk bulan tersebut sudah ter-generate semua.');
    }

    public function pay(Tagihan $tagihan)
    {
        if ($tagihan->status === 'Lunas') {
            return back()->with('error', 'Tagihan ini sudah lunas.');
        }

        $tagihan->update([
            'status' => 'Lunas',
            'tanggal_bayar' => now(),
        ]);

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function bulkPay(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tagihans,id',
        ]);

        Tagihan::whereIn('id', $validated['ids'])
            ->where('status', 'Belum Lunas')
            ->update([
                'status' => 'Lunas',
                'tanggal_bayar' => now(),
            ]);

        return back()->with('success', 'Pembayaran massal berhasil dicatat.');
    }

    public function bulkPrint(Request $request)
    {
        $ids = explode(',', $request->query('ids', ''));
        $format = $request->query('format', 'format-1');

        $tagihans = Tagihan::with('warga')->whereIn('id', $ids)->get();
        $settings = Setting::first();

        return Inertia::render('tagihan/print/bulk', [
            'tagihans' => $tagihans,
            'settings' => $settings,
            'format' => $format,
        ]);
    }

    public function print(Tagihan $tagihan, string $format)
    {
        $tagihan->load('warga');
        // Get generic config from settings
        $settings = Setting::first();

        $viewPath = 'tagihan/print/'.($format === 'format-1' ? 'format-1' : 'format-2');

        return Inertia::render($viewPath, [
            'tagihan' => $tagihan,
            'settings' => $settings,
            'isBlank' => false,
        ]);
    }

    public function printBlank(string $format)
    {
        $settings = Setting::first();
        $viewPath = 'tagihan/print/'.($format === 'format-1' ? 'format-1' : 'format-2');

        return Inertia::render($viewPath, [
            'tagihan' => null,
            'settings' => $settings,
            'isBlank' => true,
        ]);
    }

    public function exportExcel(Request $request)
    {
        $bulan = (int) $request->input('bulan', date('n'));
        $tahun = (int) $request->input('tahun', date('Y'));
        $status = $request->input('status');

        $bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        $filename = 'Tagihan_IPL_'.$bulanNames[$bulan - 1].'_'.$tahun.'.xlsx';

        return Excel::download(new TagihanExport($bulan, $tahun, $status), $filename);
    }

    public function exportPdf(Request $request)
    {
        $bulan = (int) $request->input('bulan', date('n'));
        $tahun = (int) $request->input('tahun', date('Y'));
        $status = $request->input('status');

        $query = Tagihan::with('warga')->where('bulan', $bulan)->where('tahun', $tahun);

        if ($status && in_array($status, ['Belum Lunas', 'Lunas'])) {
            $query->where('status', $status);
        }

        $data = $query->latest()->get();
        $settings = Setting::first();

        $bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

        $pdf = Pdf::loadView('exports.tagihan-pdf', [
            'data' => $data,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'settings' => $settings,
            'filterStatus' => $status,
            'totalNominal' => $data->sum('nominal'),
            'countLunas' => $data->where('status', 'Lunas')->count(),
            'countBelum' => $data->where('status', 'Belum Lunas')->count(),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('Tagihan_IPL_'.$bulanNames[$bulan - 1].'_'.$tahun.'.pdf');
    }
}
