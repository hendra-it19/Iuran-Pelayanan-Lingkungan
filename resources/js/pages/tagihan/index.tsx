import { Head, router, useForm } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as tagihanRoutes from '../../routes/tagihan/index';
import { Checkbox } from '@/components/ui/checkbox';
import GenerateTagihanModal from './partials/generate-modal';
import ConfirmPaymentModal from './partials/pay-confirmation-modal';

interface Warga {
    id: number;
    nama: string;
    no_rumah: string;
    blok: string;
}

interface Tagihan {
    id: number;
    warga_id: number;
    bulan: number;
    tahun: number;
    nominal: number;
    status: 'Belum Lunas' | 'Lunas';
    tanggal_bayar: string | null;
    warga: Warga;
}

interface PaginatedLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface IndexProps {
    tagihans: {
        data: Tagihan[];
        current_page: number;
        last_page: number;
        links: PaginatedLink[];
    };
    filters: {
        bulan: number;
        tahun: number;
        status?: string;
    };
}

const BULAN_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function TagihanIndex({ tagihans, filters }: IndexProps) {
    const [bulan, setBulan] = useState(filters.bulan.toString());
    const [tahun, setTahun] = useState(filters.tahun.toString());
    const [status, setStatus] = useState(filters.status || 'all');
    
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    
    // For paying action
    const { post: payProcess, processing: payingAction } = useForm();
    const [payingId, setPayingId] = useState<number | null>(null);
    const [isConfirmPayOpen, setIsConfirmPayOpen] = useState(false);
    const [isConfirmBulkPayOpen, setIsConfirmBulkPayOpen] = useState(false);
    const [tagihanToPay, setTagihanToPay] = useState<Tagihan | null>(null);

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelectAll = () => {
        if (selectedIds.length === tagihans.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(tagihans.data.map(t => t.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkPay = () => {
        setIsConfirmBulkPayOpen(true);
    };

    const confirmBulkPay = () => {
        router.post(tagihanRoutes.bulkPay().url, {
            ids: selectedIds
        }, {
            onSuccess: () => {
                setSelectedIds([]);
                setIsConfirmBulkPayOpen(false);
            },
            preserveScroll: true
        });
    };

    const handleBulkPrint = () => {
        const idsString = selectedIds.join(',');
        window.open(`${tagihanRoutes.bulkPrint().url}?ids=${idsString}&format=format-3`, '_blank');
    };

    const applyFilters = (b: string, t: string, s: string) => {
        router.get(tagihanRoutes.index().url, {
            bulan: b,
            tahun: t,
            status: s === 'all' ? undefined : s
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleBulanChange = (val: string) => {
        setBulan(val); 
        applyFilters(val, tahun, status); 
    };

    const handleTahunChange = (val: string) => {
        setTahun(val); 
        applyFilters(bulan, val, status); 
    };

    const handleStatusChange = (val: string) => {
        setStatus(val); 
        applyFilters(bulan, tahun, val); 
    };

    const promptBayar = (tagihan: Tagihan) => {
        setTagihanToPay(tagihan);
        setIsConfirmPayOpen(true);
    };

    const confirmSinglePay = () => {
        if (tagihanToPay) {
            setPayingId(tagihanToPay.id);
            payProcess(tagihanRoutes.pay(tagihanToPay.id).url, {
                preserveScroll: true,
                onSuccess: () => setIsConfirmPayOpen(false),
                onFinish: () => {
                    setPayingId(null);
                    setTagihanToPay(null);
                },
            });
        }
    };

    // Calculate sum dynamically for the current visible page
    const totalCurrentTagihan = tagihans.data.reduce((acc, curr) => acc + curr.nominal, 0);

    return (
        <>
            <Head title="Pembayaran IPL" />
            
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                        <Select value={bulan} onValueChange={handleBulanChange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Pilih Bulan" />
                            </SelectTrigger>
                            <SelectContent>
                                {BULAN_NAMES.map((name, i) => (
                                    <SelectItem key={i+1} value={(i+1).toString()}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={tahun} onValueChange={handleTahunChange}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 5 }, (_, i) => {
                                    const y = new Date().getFullYear() - 2 + i;

                                    return <SelectItem key={y} value={y.toString()}>{y}</SelectItem>;
                                })}
                            </SelectContent>
                        </Select>

                        <Select value={status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                                <SelectItem value="Lunas">Lunas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.open(tagihanRoutes.printBlank('format-3').url, '_blank')}>
                            Cetak Kwitansi Kosong
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Download className="size-4 mr-2" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.open(`/tagihan/export/excel?bulan=${bulan}&tahun=${tahun}${status !== 'all' ? `&status=${status}` : ''}`, '_blank')}>
                                    <FileSpreadsheet className="size-4 mr-2" />
                                    Export Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/tagihan/export/pdf?bulan=${bulan}&tahun=${tahun}${status !== 'all' ? `&status=${status}` : ''}`, '_blank')}>
                                    <FileText className="size-4 mr-2" />
                                    Export PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button onClick={() => setIsGenerateOpen(true)}>Generate Tagihan</Button>
                    </div>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox 
                                        checked={selectedIds.length === tagihans.data.length && tagihans.data.length > 0} 
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Warga (No. Rumah)</TableHead>
                                <TableHead>Periode</TableHead>
                                <TableHead>Nominal IPL</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tgl Bayar</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tagihans.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Data tagihan tidak ditemukan. Harap generate tagihan untuk bulan ini.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tagihans.data.map((item) => (
                                    <TableRow key={item.id} className={selectedIds.includes(item.id) ? 'bg-muted/50' : ''}>
                                        <TableCell>
                                            <Checkbox 
                                                checked={selectedIds.includes(item.id)} 
                                                onCheckedChange={() => toggleSelect(item.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {item.warga.nama} <span className="text-xs text-muted-foreground ml-1">({item.warga.blok}/{item.warga.no_rumah})</span>
                                        </TableCell>
                                        <TableCell>{BULAN_NAMES[item.bulan - 1]} {item.tahun}</TableCell>
                                        <TableCell>Rp {item.nominal.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'Lunas' ? 'default' : 'destructive'}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {item.tanggal_bayar ? new Date(item.tanggal_bayar).toLocaleDateString('id-ID') : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                {item.status === 'Belum Lunas' ? (
                                                    <Button size="sm" onClick={() => promptBayar(item)} disabled={payingAction && payingId === item.id}>
                                                        Bayar
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-green-600 font-semibold uppercase mr-2">Lunas</span>
                                                )}
                                                
                                                <Button variant="secondary" size="sm" onClick={() => window.open(tagihanRoutes.print({ tagihan: item.id, format: 'format-3' }).url, '_blank')}>
                                                    Cetak
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Halaman {tagihans.current_page} dari {tagihans.last_page} | Total Nilai Tampak: <b>Rp {totalCurrentTagihan.toLocaleString('id-ID')}</b>
                    </div>
                    <div className="flex gap-1">
                        {tagihans.links.map((link, i) => {
                            const isFirst = i === 0;
                            const isLast = i === tagihans.links.length - 1;

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

            {/* Floating Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-zinc-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 border-r border-zinc-700 pr-6">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                            {selectedIds.length}
                        </span>
                        <span className="text-sm font-medium italic">Item Terpilih</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="rounded-full h-8 px-4"
                            onClick={handleBulkPay}
                        >
                            Bayar Sekaligus
                        </Button>

                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full h-8 px-4 bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-50"
                            onClick={handleBulkPrint}
                        >
                            Cetak Sekaligus
                        </Button>

                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-full h-8 px-4 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
                            onClick={() => setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                </div>
            )}

            <GenerateTagihanModal 
                isOpen={isGenerateOpen} 
                setIsOpen={setIsGenerateOpen} 
            />

            <ConfirmPaymentModal
                isOpen={isConfirmPayOpen}
                setIsOpen={setIsConfirmPayOpen}
                title="Konfirmasi Pembayaran"
                description={`Apakah Anda yakin ingin memproses pembayaran IPL untuk warga ${tagihanToPay?.warga.nama} (Blok ${tagihanToPay?.warga.blok}/${tagihanToPay?.warga.no_rumah}) sebesar Rp ${tagihanToPay?.nominal.toLocaleString('id-ID')}?`}
                onConfirm={confirmSinglePay}
                processing={payingAction}
            />

            <ConfirmPaymentModal
                isOpen={isConfirmBulkPayOpen}
                setIsOpen={setIsConfirmBulkPayOpen}
                title="Konfirmasi Pembayaran Massal"
                description={`Apakah Anda yakin ingin memproses pembayaran massal untuk ${selectedIds.length} tagihan yang terpilih?`}
                onConfirm={confirmBulkPay}
            />
        </>
    );
}

TagihanIndex.layout = {
    breadcrumbs: [
        {
            title: 'Pembayaran IPL',
            href: tagihanRoutes.index(),
        },
    ],
};
