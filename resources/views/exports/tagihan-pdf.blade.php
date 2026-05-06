<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Tagihan IPL</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 10px; color: #1a1a1a; }
        .header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { font-size: 16px; margin-bottom: 2px; }
        .header h2 { font-size: 12px; font-weight: normal; color: #555; }
        .header .company { font-size: 13px; font-weight: bold; margin-bottom: 4px; }
        .meta { margin-bottom: 12px; font-size: 10px; }
        .meta span { margin-right: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        th, td { border: 1px solid #555; padding: 5px 8px; text-align: left; }
        th { background: #d9e1f2; font-weight: bold; font-size: 10px; text-align: center; }
        td { font-size: 9px; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .total-row { background: #e8e8e8; font-weight: bold; }
        .badge-lunas { background: #22c55e; color: white; padding: 2px 6px; border-radius: 3px; font-size: 8px; }
        .badge-belum { background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px; font-size: 8px; }
        .footer { margin-top: 8px; font-size: 9px; color: #777; text-align: right; }
    </style>
</head>
<body>
    @php
        $bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    @endphp

    <div class="header">
        <div class="company">{{ $settings->company_name ?? 'Unit Pengelola IPL' }}</div>
        <h1>LAPORAN TAGIHAN IPL</h1>
        <h2>Periode: {{ $bulanNames[$bulan - 1] }} {{ $tahun }}</h2>
    </div>

    <div class="meta">
        @if($filterStatus)
            <span><strong>Filter Status:</strong> {{ $filterStatus }}</span>
        @endif
        <span><strong>Total Tagihan:</strong> {{ $data->count() }}</span>
        <span><strong>Total Nilai:</strong> Rp {{ number_format($totalNominal, 0, ',', '.') }}</span>
        <span><strong>Lunas:</strong> {{ $countLunas }} &nbsp; <strong>Belum Lunas:</strong> {{ $countBelum }}</span>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 30px">No</th>
                <th>Nama Warga</th>
                <th style="width: 80px">Blok / Rumah</th>
                <th style="width: 120px">Nominal</th>
                <th style="width: 80px">Status</th>
                <th style="width: 80px">Tgl Bayar</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $tagihan)
            <tr>
                <td class="text-center">{{ $i + 1 }}</td>
                <td>{{ $tagihan->warga->nama ?? '-' }}</td>
                <td class="text-center">{{ $tagihan->warga->blok ?? '' }}/{{ $tagihan->warga->no_rumah ?? '' }}</td>
                <td class="text-right">Rp {{ number_format($tagihan->nominal, 0, ',', '.') }}</td>
                <td class="text-center">
                    <span class="{{ $tagihan->status === 'Lunas' ? 'badge-lunas' : 'badge-belum' }}">{{ $tagihan->status }}</span>
                </td>
                <td class="text-center">{{ $tagihan->tanggal_bayar ? $tagihan->tanggal_bayar->format('d/m/Y') : '-' }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="3" class="text-right">TOTAL</td>
                <td class="text-right">Rp {{ number_format($totalNominal, 0, ',', '.') }}</td>
                <td colspan="2"></td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        {{ $settings->company_name ?? 'Unit Pengelola IPL' }} &mdash; {{ date('d F Y') }}
    </div>
</body>
</html>
