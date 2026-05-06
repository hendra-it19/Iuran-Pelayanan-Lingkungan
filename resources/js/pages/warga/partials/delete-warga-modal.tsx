import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Warga {
    id: number;
    nama: string;
    no_hp: string;
    no_rumah: string;
    blok: string;
    alamat: string;
    nominal_ipl_tetap: number;
}

interface DeleteWargaModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    warga: Warga | null;
}

export default function DeleteWargaModal({ isOpen, setIsOpen, warga }: DeleteWargaModalProps) {
    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        if (!warga) {
return;
}

        destroy(`/warga/${warga.id}`, {
            onSuccess: () => setIsOpen(false),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Hapus Data Warga</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus data warga <strong>{warga?.nama}</strong> (Blok {warga?.blok} / No. {warga?.no_rumah})? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                    <Button type="button" variant="destructive" disabled={processing} onClick={handleDelete}>Hapus Data</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
