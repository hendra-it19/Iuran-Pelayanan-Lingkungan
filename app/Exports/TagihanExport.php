<?php

namespace App\Exports;

use App\Models\Tagihan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TagihanExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    private int $rowNumber = 0;

    public function __construct(
        private int $bulan,
        private int $tahun,
        private ?string $status = null,
    ) {}

    public function collection()
    {
        $query = Tagihan::with('warga')
            ->where('bulan', $this->bulan)
            ->where('tahun', $this->tahun);

        if ($this->status && in_array($this->status, ['Belum Lunas', 'Lunas'])) {
            $query->where('status', $this->status);
        }

        return $query->latest()->get();
    }

    public function headings(): array
    {
        $bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        return [
            'No',
            'Nama Warga',
            'Blok / No Rumah',
            'Periode',
            'Nominal (Rp)',
            'Status',
            'Tgl Bayar',
        ];
    }

    /**
     * @param  Tagihan  $tagihan
     */
    public function map($tagihan): array
    {
        $this->rowNumber++;
        $bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        return [
            $this->rowNumber,
            $tagihan->warga->nama ?? '-',
            ($tagihan->warga->blok ?? '').'/'.($tagihan->warga->no_rumah ?? ''),
            $bulanNames[$tagihan->bulan - 1].' '.$tagihan->tahun,
            $tagihan->nominal,
            $tagihan->status,
            $tagihan->tanggal_bayar ? $tagihan->tanggal_bayar->format('d/m/Y') : '-',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 11],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FFD9E1F2'],
                ],
            ],
        ];
    }

    public function title(): string
    {
        $bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

        return 'Tagihan '.$bulanNames[$this->bulan - 1].' '.$this->tahun;
    }
}
