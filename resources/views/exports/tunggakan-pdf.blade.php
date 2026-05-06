<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rekap Tunggakan IPL</title>
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
        .footer { margin-top: 8px; font-size: 9px; color: #777; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company">{{ $settings->company_name ?? 'Unit Pengelola IPL' }}</div>
        <h1>REKAP TUNGGAKAN IPL</h1>
        <h2>Dicetak: {{ date('d/m/Y H:i') }}</h2>
    </div>

    <div class="meta">
        @if($filterBlok)
            <span><strong>Filter Blok:</strong> {{ $filterBlok }}</span>
        @endif
        <span><strong>Total Warga Menunggak:</strong> {{ $data->count() }}</span>
        <span><strong>Total Tunggakan:</strong> Rp {{ number_format($totalNominal, 0, ',', '.') }}</span>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 30px">No</th>
                <th>Nama Warga</th>
                <th style="width: 50px">Blok</th>
                <th style="width: 70px">No Rumah</th>
                <th style="width: 70px">Jml Bulan</th>
                <th style="width: 120px">Total Tunggakan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $warga)
            <tr>
                <td class="text-center">{{ $i + 1 }}</td>
                <td>{{ $warga->nama }}</td>
                <td class="text-center">{{ $warga->blok }}</td>
                <td class="text-center">{{ $warga->no_rumah }}</td>
                <td class="text-center">{{ $warga->jumlah_tunggakan }}</td>
                <td class="text-right">Rp {{ number_format($warga->total_tunggakan, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="4" class="text-right">TOTAL</td>
                <td class="text-center">{{ $data->sum('jumlah_tunggakan') }}</td>
                <td class="text-right">Rp {{ number_format($totalNominal, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        {{ $settings->company_name ?? 'Unit Pengelola IPL' }} &mdash; {{ date('d F Y') }}
    </div>
</body>
</html>
