<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use App\Models\Warga;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $period = $request->input('period', '1_month');
        $bulanIni = (int) date('n');
        $tahunIni = (int) date('Y');
        $now = Carbon::now();

        $totalWarga = Warga::count();

        // Build query based on period
        $query = Tagihan::query();
        if ($period === '1_month') {
            $query->where('bulan', $bulanIni)->where('tahun', $tahunIni);
        } elseif ($period === '3_months') {
            $threeMonthsAgo = Carbon::now()->subMonths(2)->startOfMonth();
            $query->where(function ($q) use ($threeMonthsAgo) {
                $q->where('tahun', '>', $threeMonthsAgo->year)
                    ->orWhere(function ($sq) use ($threeMonthsAgo) {
                        $sq->where('tahun', $threeMonthsAgo->year)->where('bulan', '>=', $threeMonthsAgo->month);
                    });
            });
        } elseif ($period === '1_year') {
            $oneYearAgo = Carbon::now()->subMonths(11)->startOfMonth();
            $query->where(function ($q) use ($oneYearAgo) {
                $q->where('tahun', '>', $oneYearAgo->year)
                    ->orWhere(function ($sq) use ($oneYearAgo) {
                        $sq->where('tahun', $oneYearAgo->year)->where('bulan', '>=', $oneYearAgo->month);
                    });
            });
        }

        $totalTagihan = (clone $query)->count();
        $lunas = (clone $query)->where('status', 'Lunas')->count();
        $belumLunas = (clone $query)->where('status', 'Belum Lunas')->count();

        $totalNominal = (clone $query)->sum('nominal');
        $totalTerbayar = (clone $query)->where('status', 'Lunas')->sum('nominal');
        $totalBelumTerbayar = (clone $query)->where('status', 'Belum Lunas')->sum('nominal');

        // Chart Data (Last 12 months trend)
        $chartData = [];
        $bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $m = (int) $date->format('n');
            $y = (int) $date->format('Y');

            $statsMonthly = Tagihan::where('bulan', $m)
                ->where('tahun', $y)
                ->selectRaw('count(*) as total, sum(case when status = "Lunas" then 1 else 0 end) as lunas, sum(case when status = "Belum Lunas" then 1 else 0 end) as belum')
                ->first();

            $chartData[] = [
                'name' => $bulanNames[$m - 1].' '.substr($y, 2),
                'tagihan' => (int) ($statsMonthly->total ?? 0),
                'lunas' => (int) ($statsMonthly->lunas ?? 0),
                'belum_lunas' => (int) ($statsMonthly->belum ?? 0),
            ];
        }

        // Per-blok summary (keep current month for the detailed table)
        $perBlok = Warga::select('blok', DB::raw('count(*) as total_warga'))
            ->groupBy('blok')
            ->orderBy('blok')
            ->get()
            ->map(function ($item) use ($bulanIni, $tahunIni) {
                $lunas = Tagihan::where('bulan', $bulanIni)
                    ->where('tahun', $tahunIni)
                    ->where('status', 'Lunas')
                    ->whereHas('warga', fn ($q) => $q->where('blok', $item->blok))
                    ->count();

                $belum = Tagihan::where('bulan', $bulanIni)
                    ->where('tahun', $tahunIni)
                    ->where('status', 'Belum Lunas')
                    ->whereHas('warga', fn ($q) => $q->where('blok', $item->blok))
                    ->count();

                return [
                    'blok' => $item->blok,
                    'total_warga' => $item->total_warga,
                    'lunas' => $lunas,
                    'belum_lunas' => $belum,
                ];
            });

        // Recent payments (last 10)
        $recentPayments = Tagihan::with('warga')
            ->where('status', 'Lunas')
            ->whereNotNull('tanggal_bayar')
            ->orderByDesc('tanggal_bayar')
            ->take(10)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'warga_nama' => $t->warga->nama,
                'warga_blok' => $t->warga->blok,
                'warga_no_rumah' => $t->warga->no_rumah,
                'bulan' => $t->bulan,
                'tahun' => $t->tahun,
                'nominal' => $t->nominal,
                'tanggal_bayar' => $t->tanggal_bayar->toDateString(),
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'total_warga' => $totalWarga,
                'bulan' => $bulanIni,
                'tahun' => $tahunIni,
                'total_tagihan' => $totalTagihan,
                'lunas' => $lunas,
                'belum_lunas' => $belumLunas,
                'total_nominal' => $totalNominal,
                'total_terbayar' => $totalTerbayar,
                'total_belum_terbayar' => $totalBelumTerbayar,
                'period' => $period,
            ],
            'chartData' => $chartData,
            'perBlok' => $perBlok,
            'recentPayments' => $recentPayments,
        ]);
    }
}
