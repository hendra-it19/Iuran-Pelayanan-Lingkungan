<?php

namespace App\Exports;

use App\Models\Tagihan;
use App\Models\Warga;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TunggakanExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    private int $rowNumber = 0;

    public function __construct(
        private ?string $blok = null,
        private ?string $search = null,
    ) {}

    public function collection()
    {
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

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('nama', 'like', "%{$this->search}%")
                    ->orWhere('no_rumah', 'like', "%{$this->search}%");
            });
        }

        if ($this->blok) {
            $query->where('blok', $this->blok);
        }

        return $query->orderBy('blok')
            ->orderByRaw('CAST(no_rumah AS UNSIGNED) ASC')
            ->orderBy('no_rumah')
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Warga',
            'Blok',
            'No Rumah',
            'Jumlah Bulan Tunggakan',
            'Total Nominal Tunggakan (Rp)',
        ];
    }

    /**
     * @param  Warga  $warga
     */
    public function map($warga): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $warga->nama,
            $warga->blok,
            $warga->no_rumah,
            $warga->jumlah_tunggakan,
            $warga->total_tunggakan,
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
        return 'Rekap Tunggakan';
    }
}
