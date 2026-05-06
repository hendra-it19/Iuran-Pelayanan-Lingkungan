import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as wargaRoutes from '../../../routes/warga/index';

interface BulkUpdateIplModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function BulkUpdateIplModal({ isOpen, setIsOpen }: BulkUpdateIplModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        target: 'all',
        blok: '',
        nominal: 0,
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, reset, clearErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(wargaRoutes.bulkUpdateIpl().url, {
            onSuccess: () => setIsOpen(false),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update IPL Massal</DialogTitle>
                        <DialogDescription>
                            Atur nominal IPL tetap untuk banyak warga sekaligus.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="target">Target Update</Label>
                            <Select 
                                value={data.target} 
                                onValueChange={(value) => setData('target', value)}
                            >
                                <SelectTrigger id="target">
                                    <SelectValue placeholder="Pilih target" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Warga</SelectItem>
                                    <SelectItem value="blok">Berdasarkan Blok</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.target && <p className="text-sm text-red-500">{errors.target}</p>}
                        </div>

                        {data.target === 'blok' && (
                            <div className="grid gap-2">
                                <Label htmlFor="blok">Pilih Blok</Label>
                                <Select 
                                    value={data.blok} 
                                    onValueChange={(value) => setData('blok', value)}
                                >
                                    <SelectTrigger id="blok">
                                        <SelectValue placeholder="Pilih blok" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">Blok A</SelectItem>
                                        <SelectItem value="B">Blok B</SelectItem>
                                        <SelectItem value="C">Blok C</SelectItem>
                                        <SelectItem value="D">Blok D</SelectItem>
                                        <SelectItem value="E">Blok E</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.blok && <p className="text-sm text-red-500">{errors.blok}</p>}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="nominal">Nominal IPL Baru (Rp)</Label>
                            <Input
                                id="nominal"
                                type="number"
                                value={data.nominal}
                                onChange={(e) => setData('nominal', parseInt(e.target.value))}
                                placeholder="Contoh: 150000"
                            />
                            {errors.nominal && <p className="text-sm text-red-500">{errors.nominal}</p>}
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Perbarui Semua'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
