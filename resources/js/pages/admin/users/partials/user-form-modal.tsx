import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as adminUserRoutes from '@/routes/admin/users';
import type { User } from '@/types';

interface UserFormModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    user: User | null;
}

export default function UserFormModal({ isOpen, setIsOpen, user }: UserFormModalProps) {
    const isEdit = !!user;
    
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_admin: 0,
    });

    useEffect(() => {
        if (isOpen) {
            if (isEdit && user) {
                setData({
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: '',
                    password_confirmation: '',
                    is_admin: user.is_admin ? 1 : 0,
                });
            } else {
                reset();
            }

            clearErrors();
        }
    }, [isOpen, user, isEdit, setData, reset, clearErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit && user) {
            put(adminUserRoutes.update(user.id).url, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            post(adminUserRoutes.store().url, {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Akun' : 'Tambah Akun Baru'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? 'Kosongkan kata sandi jika tidak ingin mengubahnya.' : 'Isi semua data akun yang diperlukan.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nama</Label>
                            <div className="col-span-3">
                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">Username</Label>
                            <div className="col-span-3">
                                <Input id="username" value={data.username} onChange={e => setData('username', e.target.value)} required />
                                {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <div className="col-span-3">
                                <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <div className="col-span-3">
                                <Select value={data.is_admin.toString()} onValueChange={value => setData('is_admin', parseInt(value))}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Pegawai</SelectItem>
                                        <SelectItem value="1">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.is_admin && <p className="text-sm text-destructive mt-1">{errors.is_admin}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Kata Sandi</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)} 
                                    required={!isEdit} 
                                />
                                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password_confirmation" className="text-right">Konfirmasi</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="password_confirmation" 
                                    type="password" 
                                    value={data.password_confirmation} 
                                    onChange={e => setData('password_confirmation', e.target.value)} 
                                    required={!isEdit} 
                                />
                                {errors.password_confirmation && <p className="text-sm text-destructive mt-1">{errors.password_confirmation}</p>}
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
