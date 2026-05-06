import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as wargaRoutes from '../../routes/warga/index';
import BulkUpdateIplModal from './partials/bulk-update-ipl-modal';
import DeleteWargaModal from './partials/delete-warga-modal';
import WargaFormModal from './partials/warga-form-modal';

interface Warga {
    id: number;
    nama: string;
    no_hp: string;
    no_rumah: string;
    blok: string;
    alamat: string;
    nominal_ipl_tetap: number;
}

interface PaginatedLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface IndexProps {
    wargas: {
        data: Warga[];
        current_page: number;
        last_page: number;
        links: PaginatedLink[];
    };
    filters: {
        search?: string;
        blok?: string;
    };
}

export default function WargaIndex({ wargas, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [blok, setBlok] = useState(filters.blok || 'all');
    
    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters(search, blok);
    };

    const handleBlokChange = (value: string) => {
        setBlok(value);
        applyFilters(search, value);
    };

    const applyFilters = (searchVal: string, blokVal: string) => {
        router.get(wargaRoutes.index().url, {
            search: searchVal,
            blok: blokVal === 'all' ? undefined : blokVal
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const openForCreate = () => {
        setSelectedWarga(null);
        setIsFormOpen(true);
    };

    const openForEdit = (item: Warga) => {
        setSelectedWarga(item);
        setIsFormOpen(true);
    };

    const openForDelete = (item: Warga) => {
        setSelectedWarga(item);
        setIsDeleteOpen(true);
    };

    return (
        <>
            <Head title="Data Warga" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                        <Input 
                            placeholder="Cari nama / no rumah..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            className="w-full sm:w-64"
                        />
                        <Button type="submit" variant="secondary">Cari</Button>
                    </form>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={blok} onValueChange={handleBlokChange}>
                            <SelectTrigger className="w-full sm:w-32">
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
                        
                        <Button variant="outline" onClick={() => setIsBulkOpen(true)}>Update IPL Massal</Button>
                        <Button onClick={openForCreate}>Tambah Warga</Button>
                    </div>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No. Rumah</TableHead>
                                <TableHead>Blok</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>No HP</TableHead>
                                <TableHead>Tarif IPL</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {wargas.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Data warga tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                wargas.data.map((w) => (
                                    <TableRow key={w.id}>
                                        <TableCell className="font-medium">{w.no_rumah}</TableCell>
                                        <TableCell>{w.blok}</TableCell>
                                        <TableCell>{w.nama}</TableCell>
                                        <TableCell>{w.no_hp || '-'}</TableCell>
                                        <TableCell>Rp {w.nominal_ipl_tetap.toLocaleString('id-ID')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => openForEdit(w)}>Edit</Button>
                                                <Button size="sm" variant="destructive" onClick={() => openForDelete(w)}>Hapus</Button>
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
                        Halaman {wargas.current_page} dari {wargas.last_page}
                    </div>
                    <div className="flex gap-1">
                        {wargas.links.map((link, i) => {
                            const isFirst = i === 0;
                            const isLast = i === wargas.links.length - 1;

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

            <WargaFormModal 
                isOpen={isFormOpen} 
                setIsOpen={setIsFormOpen} 
                warga={selectedWarga} 
            />
            
            <DeleteWargaModal 
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                warga={selectedWarga}
            />

            <BulkUpdateIplModal 
                isOpen={isBulkOpen}
                setIsOpen={setIsBulkOpen}
            />
        </>
    );
}

WargaIndex.layout = {
    breadcrumbs: [
        {
            title: 'Data Warga',
            href: wargaRoutes.index(),
        },
    ],
};
