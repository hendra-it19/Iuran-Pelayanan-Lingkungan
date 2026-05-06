import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import tagihanRoutes from '@/routes/tagihan';

const BULAN_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

interface Props {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function GenerateTagihanModal({ isOpen, setIsOpen }: Props) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const { data, setData, post, processing, reset } = useForm({
        bulan: currentMonth.toString(),
        tahun: currentYear.toString(),
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(tagihanRoutes.generate().url, {
            onSuccess: () => setIsOpen(false),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Generate Tagihan Massal</DialogTitle>
                        <DialogDescription>
                            Sistem akan membuatkan tagihan untuk semua warga yang terdaftar pada bulan dan tahun terpilih.
                            Jika tagihan untuk warga pada bulan tersebut sudah ada, sistem tidak akan menduplikasinya.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Bulan</Label>
                            <div className="col-span-3">
                                <Select value={data.bulan} onValueChange={v => setData('bulan', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BULAN_NAMES.map((name, i) => (
                                            <SelectItem key={i+1} value={(i+1).toString()}>{name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Tahun</Label>
                            <div className="col-span-3">
                                <Select value={data.tahun} onValueChange={v => setData('tahun', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 5 }, (_, i) => {
                                            const y = currentYear - 2 + i;

                                            return <SelectItem key={y} value={y.toString()}>{y}</SelectItem>;
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                        <Button type="submit" disabled={processing}>Mulai Generate</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
