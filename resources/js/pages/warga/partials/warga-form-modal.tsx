import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Warga {
    id: number;
    nama: string;
    no_hp: string;
    no_rumah: string;
    blok: string;
    alamat: string;
    nominal_ipl_tetap: number;
}

interface WargaFormModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    warga: Warga | null;
}

export default function WargaFormModal({ isOpen, setIsOpen, warga }: WargaFormModalProps) {
    const isEdit = !!warga;
    
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama: '',
        no_hp: '',
        no_rumah: '',
        blok: '',
        alamat: '',
        nominal_ipl_tetap: 0,
    });

    useEffect(() => {
        if (isOpen) {
            if (isEdit && warga) {
                setData({
                    nama: warga.nama,
                    no_hp: warga.no_hp || '',
                    no_rumah: warga.no_rumah,
                    blok: warga.blok,
                    alamat: warga.alamat || '',
                    nominal_ipl_tetap: warga.nominal_ipl_tetap,
                });
            } else {
                reset();
            }

            clearErrors();
        }
    }, [isOpen, warga]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit && warga) {
            put(`/warga/${warga.id}`, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            post('/warga', {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Data Warga' : 'Tambah Warga Baru'}</DialogTitle>
                        <DialogDescription>
                            Pastikan data seperti blok dan tarif IPL sudah sesuai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama" className="text-right">Nama</Label>
                            <div className="col-span-3">
                                <Input id="nama" value={data.nama} onChange={e => setData('nama', e.target.value)} required />
                                {errors.nama && <p className="text-sm text-destructive mt-1">{errors.nama}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="no_hp" className="text-right">No HP</Label>
                            <div className="col-span-3">
                                <Input id="no_hp" value={data.no_hp} onChange={e => setData('no_hp', e.target.value)} />
                                {errors.no_hp && <p className="text-sm text-destructive mt-1">{errors.no_hp}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="blok" className="text-right">Blok</Label>
                            <div className="col-span-3">
                                <Input id="blok" value={data.blok} onChange={e => setData('blok', e.target.value)} required />
                                {errors.blok && <p className="text-sm text-destructive mt-1">{errors.blok}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="no_rumah" className="text-right">No Rumah</Label>
                            <div className="col-span-3">
                                <Input id="no_rumah" value={data.no_rumah} onChange={e => setData('no_rumah', e.target.value)} required />
                                {errors.no_rumah && <p className="text-sm text-destructive mt-1">{errors.no_rumah}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alamat" className="text-right">Alamat (Opsional)</Label>
                            <div className="col-span-3">
                                <Input id="alamat" value={data.alamat} onChange={e => setData('alamat', e.target.value)} />
                                {errors.alamat && <p className="text-sm text-destructive mt-1">{errors.alamat}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nominal_ipl" className="text-right">Tarif IPL (Rp)</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="nominal_ipl" 
                                    type="number" 
                                    value={data.nominal_ipl_tetap} 
                                    onChange={e => setData('nominal_ipl_tetap', parseInt(e.target.value) || 0)} 
                                    required 
                                />
                                {errors.nominal_ipl_tetap && <p className="text-sm text-destructive mt-1">{errors.nominal_ipl_tetap}</p>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
