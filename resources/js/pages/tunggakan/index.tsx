import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as tunggakanRoutes from '../../routes/tunggakan/index';

interface UnpaidBill {
    bulan: number;
    tahun: number;
    nominal: number;
}

interface TunggakanItem {
    id: number;
    nama: string;
    no_hp: string;
    no_rumah: string;
    blok: string;
    jumlah_tunggakan: number;
    total_tunggakan: number;
    unpaid_bills: UnpaidBill[];
}

interface PaginatedLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface IndexProps {
    tunggakans: {
        data: TunggakanItem[];
        current_page: number;
        last_page: number;
        links: PaginatedLink[];
    };
    filters: {
        search?: string;
        blok?: string;
    };
    summary: {
        total_warga: number;
        total_nominal: number;
    };
}

const BULAN_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

export default function TunggakanIndex({ tunggakans, filters, summary }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [blok, setBlok] = useState(filters.blok || 'all');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters(search, blok);
    };

    const handleBlokChange = (value: string) => {
        setBlok(value);
        applyFilters(search, value);
    };

    const applyFilters = (searchVal: string, blokVal: string) => {
        router.get(tunggakanRoutes.index().url, {
            search: searchVal || undefined,
            blok: blokVal === 'all' ? undefined : blokVal,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const buildExportParams = () => {
        const params = new URLSearchParams();

        if (search) {
params.set('search', search);
}

        if (blok && blok !== 'all') {
params.set('blok', blok);
}

        return params.toString() ? '?' + params.toString() : '';
    };

    return (
        <>
            <Head title="Tunggakan IPL" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Warga Menunggak</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-red-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" x2="22" y1="11" y2="11" /></svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{summary.total_warga}</div>
                            <p className="text-xs text-muted-foreground">warga memiliki tagihan belum lunas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tunggakan</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-red-500"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatRupiah(summary.total_nominal)}</div>
                            <p className="text-xs text-muted-foreground">total nilai belum terbayar</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters + Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Cari nama / no rumah..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full sm:w-64"
                            />
                            <Button type="submit" variant="secondary">Cari</Button>
                        </form>

                        <Select value={blok} onValueChange={handleBlokChange}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Semua Blok" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Blok</SelectItem>
                                <SelectItem value="A">Blok A</SelectItem>
                                <SelectItem value="B">Blok B</SelectItem>
                                <SelectItem value="C">Blok C</SelectItem>
                                <SelectItem value="D">Blok D</SelectItem>
                                <SelectItem value="E">Blok E</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Download className="size-4 mr-2" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(tunggakanRoutes.exportExcel().url + buildExportParams(), '_blank')}>
                                <FileSpreadsheet className="size-4 mr-2" />
                                Export Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(tunggakanRoutes.exportPdf().url + buildExportParams(), '_blank')}>
                                <FileText className="size-4 mr-2" />
                                Export PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table */}
                <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Warga</TableHead>
                                <TableHead>Blok / Rumah</TableHead>
                                <TableHead className="text-center">Bulan Tunggakan</TableHead>
                                <TableHead className="text-right">Total Tunggakan</TableHead>
                                <TableHead className="text-center">Detail</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tunggakans.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Tidak ada warga yang memiliki tunggakan. 🎉
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tunggakans.data.map((item) => (
                                    <>
                                        <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                                            <TableCell className="font-medium">{item.nama}</TableCell>
                                            <TableCell>{item.blok}/{item.no_rumah}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="destructive">{item.jumlah_tunggakan} bulan</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-red-600">
                                                {formatRupiah(item.total_tunggakan)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button variant="ghost" size="sm" onClick={(e) => {
 e.stopPropagation(); setExpandedId(expandedId === item.id ? null : item.id); 
}}>
                                                    {expandedId === item.id ? 'Tutup' : 'Lihat'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {expandedId === item.id && (
                                            <TableRow key={`detail-${item.id}`}>
                                                <TableCell colSpan={5} className="bg-muted/30 p-4">
                                                    <div className="text-xs font-medium text-muted-foreground mb-2">Rincian Tagihan Belum Lunas:</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.unpaid_bills.map((bill, idx) => (
                                                            <div key={idx} className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs bg-background">
                                                                <span className="font-medium">{BULAN_NAMES[bill.bulan - 1]} {bill.tahun}</span>
                                                                <span className="text-muted-foreground">—</span>
                                                                <span className="font-semibold text-red-600">{formatRupiah(bill.nominal)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Halaman {tunggakans.current_page} dari {tunggakans.last_page}
                    </div>
                    <div className="flex gap-1">
                        {tunggakans.links.map((link, i) => {
                            const isFirst = i === 0;
                            const isLast = i === tunggakans.links.length - 1;

                            return (
                                <Button
                                    key={i}
                                    variant={link.active ? "default" : "outline"}
                                    size="icon"
                                    className={isFirst || isLast ? 'size-8' : 'size-8 min-w-8'}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                >
                                    {isFirst ? <ChevronLeft className="size-4" /> : isLast ? <ChevronRight className="size-4" /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

TunggakanIndex.layout = {
    breadcrumbs: [
        {
            title: 'Tunggakan IPL',
            href: tunggakanRoutes.index(),
        },
    ],
};
