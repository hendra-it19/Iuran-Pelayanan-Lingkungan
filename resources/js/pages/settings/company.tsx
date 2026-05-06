import { Head, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import * as company from '../../routes/company/index';

interface Setting {
    company_name: string;
    company_address_pusat?: string;
    company_address_lokasi?: string;
    company_phone?: string;
    company_wa?: string;
    company_city?: string;
    company_leader?: string;
    company_logo?: string;
    theme_color?: string;
    bank_name?: string;
    bank_account?: string;
    bank_holder?: string;
}

export default function CompanySettings({ setting, logoUrl }: { setting: Setting; logoUrl: string | null }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl);

    const { data, setData, post, processing, errors } = useForm({
        company_name: setting?.company_name || '',
        company_address_pusat: setting?.company_address_pusat || '',
        company_address_lokasi: setting?.company_address_lokasi || '',
        company_phone: setting?.company_phone || '',
        company_wa: setting?.company_wa || '',
        company_city: setting?.company_city || '',
        company_leader: setting?.company_leader || '',
        company_logo: null as File | null,
        theme_color: setting?.theme_color || 'zinc',
        bank_name: setting?.bank_name || '',
        bank_account: setting?.bank_account || '',
        bank_holder: setting?.bank_holder || '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('company_logo', file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreviewUrl(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(company.update().url, {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handleDeleteLogo = () => {
        if (confirm('Yakin ingin menghapus logo?')) {
            router.delete(company.deleteLogo().url, {
                preserveScroll: true,
                onSuccess: () => {
                    setPreviewUrl(null);

                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
            });
        }
    };

    return (
        <>
            <Head title="Pengaturan Perusahaan" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Pengaturan Perusahaan & Kuitansi"
                    description="Sesuaikan identitas pengelola IPL untuk pencetakan nota/kuitansi fisik."
                />

                <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                    {/* Logo Upload Section */}
                    <div className="space-y-3">
                        <Label>Logo Perusahaan</Label>
                        <div className="flex items-start gap-4">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Logo" className="h-full w-full object-contain p-1" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-muted-foreground/50">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Input
                                    ref={fileInputRef}
                                    id="company_logo"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                                    onChange={handleFileChange}
                                    className="max-w-[260px]"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: PNG, JPG, SVG, WebP. Maks 2MB.
                                </p>
                                {previewUrl && logoUrl && (
                                    <Button type="button" variant="destructive" size="sm" className="w-fit" onClick={handleDeleteLogo}>
                                        Hapus Logo
                                    </Button>
                                )}
                                {errors.company_logo && <p className="text-sm text-red-500">{errors.company_logo}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Tema Aplikasi</Label>
                        <div className="grid grid-cols-5 gap-2 max-w-sm">
                            {[
                                { name: 'zinc', color: 'bg-zinc-900' },
                                { name: 'slate', color: 'bg-slate-900' },
                                { name: 'stone', color: 'bg-stone-900' },
                                { name: 'red', color: 'bg-red-600' },
                                { name: 'rose', color: 'bg-rose-600' },
                                { name: 'orange', color: 'bg-orange-500' },
                                { name: 'green', color: 'bg-green-600' },
                                { name: 'blue', color: 'bg-blue-600' },
                                { name: 'violet', color: 'bg-violet-600' },
                            ].map((theme) => (
                                <button
                                    key={theme.name}
                                    type="button"
                                    onClick={() => setData('theme_color', theme.name)}
                                    className={`group relative flex h-10 items-center justify-center rounded-md border-2 transition-all ${
                                        data.theme_color === theme.name ? 'border-primary bg-primary/5' : 'border-muted bg-muted/20 hover:border-muted-foreground/30'
                                    }`}
                                >
                                    <span className={`h-5 w-5 rounded-full ${theme.color}`} title={theme.name} />
                                    {data.theme_color === theme.name && (
                                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground border-2 border-background">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pilih warna utama yang akan digunakan di seluruh aplikasi.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company_name">Nama Pengelola / Perusahaan</Label>
                        <Input
                            id="company_name"
                            value={data.company_name}
                            onChange={e => setData('company_name', e.target.value)}
                            placeholder="PT Kemang Pratama"
                            required
                        />
                        {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company_address_pusat">Alamat Pusat (Opsional)</Label>
                        <Textarea
                            id="company_address_pusat"
                            value={data.company_address_pusat}
                            onChange={e => setData('company_address_pusat', e.target.value)}
                            placeholder="Jl. Pemuda No..."
                        />
                        {errors.company_address_pusat && <p className="text-sm text-red-500">{errors.company_address_pusat}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company_address_lokasi">Alamat Lokasi / Cabang Operasional</Label>
                        <Textarea
                            id="company_address_lokasi"
                            value={data.company_address_lokasi}
                            onChange={e => setData('company_address_lokasi', e.target.value)}
                            placeholder="Jl. Kemang Raya..."
                        />
                        {errors.company_address_lokasi && <p className="text-sm text-red-500">{errors.company_address_lokasi}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_phone">Telepon / Fax</Label>
                            <Input
                                id="company_phone"
                                value={data.company_phone}
                                onChange={e => setData('company_phone', e.target.value)}
                                placeholder="Telp: 021..."
                            />
                            {errors.company_phone && <p className="text-sm text-red-500">{errors.company_phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company_wa">WhatsApp (WA)</Label>
                            <Input
                                id="company_wa"
                                value={data.company_wa}
                                onChange={e => setData('company_wa', e.target.value)}
                                placeholder="WA: 081..."
                            />
                            {errors.company_wa && <p className="text-sm text-red-500">{errors.company_wa}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_city">Kota Pengesahan (Tanda Tangan)</Label>
                            <Input
                                id="company_city"
                                value={data.company_city}
                                onChange={e => setData('company_city', e.target.value)}
                                placeholder="Bekasi"
                            />
                            {errors.company_city && <p className="text-sm text-red-500">{errors.company_city}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company_leader">Pimpinan Pengelola (Penanda tangan)</Label>
                            <Input
                                id="company_leader"
                                value={data.company_leader}
                                onChange={e => setData('company_leader', e.target.value)}
                                placeholder="Indra Wahyudi"
                            />
                            {errors.company_leader && <p className="text-sm text-red-500">{errors.company_leader}</p>}
                        </div>
                    </div>
                        <div className="space-y-4 pt-4">
                        <Heading
                            variant="small"
                            title="Informasi Pembayaran (Transfer Bank)"
                            description="Informasi ini akan ditampilkan pada bagian bawah kuitansi cetak."
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bank_name">Nama Bank</Label>
                                <Input
                                    id="bank_name"
                                    value={data.bank_name}
                                    onChange={e => setData('bank_name', e.target.value)}
                                    placeholder="BNI / Mandiri / BCA"
                                />
                                {errors.bank_name && <p className="text-sm text-red-500">{errors.bank_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bank_account">Nomor Rekening</Label>
                                <Input
                                    id="bank_account"
                                    value={data.bank_account}
                                    onChange={e => setData('bank_account', e.target.value)}
                                    placeholder="1234567890"
                                />
                                {errors.bank_account && <p className="text-sm text-red-500">{errors.bank_account}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank_holder">Atas Nama (Account Holder)</Label>
                            <Input
                                id="bank_holder"
                                value={data.bank_holder}
                                onChange={e => setData('bank_holder', e.target.value)}
                                placeholder="PT KEMANG PRATAMA"
                            />
                            {errors.bank_holder && <p className="text-sm text-red-500">{errors.bank_holder}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Simpan Perubahan</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CompanySettings.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Perusahaan',
            href: company.edit().url,
        },
    ],
};
