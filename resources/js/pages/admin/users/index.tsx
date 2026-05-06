import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User } from '@/types';
import * as adminUserRoutes from '../../../routes/admin/users/index';
import DeleteUserModal from './partials/delete-user-modal';
import UserFormModal from './partials/user-form-modal';

interface PaginatedLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface IndexProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        links: PaginatedLink[];
    };
    filters: {
        search?: string;
    };
}

export default function UserIndex({ users, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    
    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters(search);
    };

    const applyFilters = (searchVal: string) => {
        router.get(adminUserRoutes.index().url, {
            search: searchVal,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const openForCreate = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const openForEdit = (item: User) => {
        setSelectedUser(item);
        setIsFormOpen(true);
    };

    const openForDelete = (item: User) => {
        setSelectedUser(item);
        setIsDeleteOpen(true);
    };

    return (
        <>
            <Head title="Manajemen Akun" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                        <Input 
                            placeholder="Cari nama / username / email..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            className="w-full sm:w-64"
                        />
                        <Button type="submit" variant="secondary">Cari</Button>
                    </form>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button onClick={openForCreate}>Tambah Akun</Button>
                    </div>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Data akun tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">{u.name}</TableCell>
                                        <TableCell>{u.username}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>
                                            {u.is_admin ? (
                                                <Badge variant="default">Admin</Badge>
                                            ) : (
                                                <Badge variant="secondary">Pegawai</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => openForEdit(u)}>Edit</Button>
                                                <Button size="sm" variant="destructive" onClick={() => openForDelete(u)} disabled={u.is_admin}>Hapus</Button>
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
                        Halaman {users.current_page} dari {users.last_page}
                    </div>
                    <div className="flex gap-1">
                        {users.links.map((link, i) => {
                            const isFirst = i === 0;
                            const isLast = i === users.links.length - 1;

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

            <UserFormModal 
                isOpen={isFormOpen} 
                setIsOpen={setIsFormOpen} 
                user={selectedUser} 
            />
            
            <DeleteUserModal 
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                user={selectedUser}
            />
        </>
    );
}

UserIndex.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Akun',
            href: adminUserRoutes.index().url,
        },
    ],
};
