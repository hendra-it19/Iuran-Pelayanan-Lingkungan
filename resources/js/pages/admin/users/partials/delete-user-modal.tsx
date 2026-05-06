import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import * as adminUserRoutes from '@/routes/admin/users';
import type { User } from '@/types';

interface DeleteUserModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    user: User | null;
}

export default function DeleteUserModal({ isOpen, setIsOpen, user }: DeleteUserModalProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (user) {
            destroy(adminUserRoutes.destroy(user.id).url, {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleDelete}>
                    <DialogHeader>
                        <DialogTitle>Hapus Akun</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus akun <strong>{user?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                        <Button type="submit" variant="destructive" disabled={processing}>Hapus</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
