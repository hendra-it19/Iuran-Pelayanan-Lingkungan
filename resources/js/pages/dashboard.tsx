import { Head, router } from '@inertiajs/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard } from '../routes/index';

interface Stats {
    total_warga: number;
    bulan: number;
    tahun: number;
    total_tagihan: number;
    lunas: number;
    belum_lunas: number;
    total_nominal: number;
    total_terbayar: number;
    total_belum_terbayar: number;
    period: string;
}

interface ChartDataItem {
    name: string;
    tagihan: number;
    lunas: number;
    belum_lunas: number;
}

interface BlokSummary {
    blok: string;
    total_warga: number;
    lunas: number;
    belum_lunas: number;
}

interface RecentPayment {
    id: number;
    warga_nama: string;
    warga_blok: string;
    warga_no_rumah: string;
    bulan: number;
    tahun: number;
    nominal: number;
    tanggal_bayar: string;
}

interface DashboardProps {
    stats: Stats;
    chartData: ChartDataItem[];
    perBlok: BlokSummary[];
    recentPayments: RecentPayment[];
}

const BULAN_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

export default function Dashboard({ stats, chartData, perBlok, recentPayments }: DashboardProps) {
    const persenLunas = stats.total_tagihan > 0 
        ? Math.round((stats.lunas / stats.total_tagihan) * 100) 
        : 0;

    const handlePeriodChange = (value: string) => {
        router.get(dashboard(), { period: value }, { preserveScroll: true, preserveState: true });
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Period heading & Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground uppercase">
                            Ringkasan {stats.period === '1_month' ? `Bulan ${BULAN_NAMES[stats.bulan - 1]} ${stats.tahun}` : stats.period.replace('_', ' ').replace('1', '1 ')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Data iuran pelayanan lingkungan periode {stats.period.replace('_', ' ').replace('1', '1 ')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium hidden sm:inline">Filter:</span>
                        <Select value={stats.period} onValueChange={handlePeriodChange}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Pilih Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1_month">Bulan Ini</SelectItem>
                                <SelectItem value="3_months">3 Bulan Terakhir</SelectItem>
                                <SelectItem value="1_year">1 Tahun Terakhir</SelectItem>
                                <SelectItem value="all">Semua Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Warga</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_warga}</div>
                            <p className="text-xs text-muted-foreground">
                                Warga terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(stats.total_nominal)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total_tagihan} tagihan bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sudah Lunas</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatRupiah(stats.total_terbayar)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.lunas} warga ({persenLunas}%)
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Belum Lunas</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-red-500"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatRupiah(stats.total_belum_terbayar)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.belum_lunas} warga ({stats.total_tagihan > 0 ? 100 - persenLunas : 0}%)
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Trends Chart */}
                <Card className="p-4">
                    <CardHeader className="px-2">
                        <CardTitle className="text-base font-bold">Tren Penagihan & Pembayaran</CardTitle>
                        <CardDescription>Grafik perbandingan status tagihan 12 bulan terakhir</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] mt-4 px-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="name" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    stroke="#6b7280"
                                />
                                <YAxis 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    stroke="#6b7280"
                                    tickFormatter={(value) => `${value}`} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Legend 
                                    verticalAlign="top" 
                                    align="right"
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '11px', paddingBottom: '20px' }} 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="tagihan" 
                                    name="Total Tagihan" 
                                    stroke="#6366f1" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }} 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="lunas" 
                                    name="Sudah Lunas" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="belum_lunas" 
                                    name="Belum Lunas" 
                                    stroke="#ef4444" 
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Progress bar */}
                {stats.total_tagihan > 0 && stats.period === '1_month' && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Progress Pembayaran Bulan Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                                        <div 
                                            className="h-full rounded-full bg-green-500 transition-all duration-500"
                                            style={{ width: `${persenLunas}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-foreground min-w-12 text-right">
                                    {persenLunas}%
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {stats.lunas} dari {stats.total_tagihan} tagihan sudah lunas
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Per-Blok Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ringkasan Per Blok</CardTitle>
                            <CardDescription>Status pembayaran per blok bulan {BULAN_NAMES[stats.bulan - 1]}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {perBlok.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">Belum ada data blok.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Blok</TableHead>
                                            <TableHead className="text-center">Warga</TableHead>
                                            <TableHead className="text-center">Lunas</TableHead>
                                            <TableHead className="text-center">Belum</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {perBlok.map((blok) => (
                                            <TableRow key={blok.blok}>
                                                <TableCell className="font-medium">Blok {blok.blok}</TableCell>
                                                <TableCell className="text-center">{blok.total_warga}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="default" className="min-w-8 justify-center">{blok.lunas}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={blok.belum_lunas > 0 ? "destructive" : "secondary"} className="min-w-8 justify-center">
                                                        {blok.belum_lunas}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Payments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Pembayaran Terbaru</CardTitle>
                            <CardDescription>10 transaksi pembayaran terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentPayments.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">Belum ada pembayaran.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentPayments.map((payment) => (
                                        <div key={payment.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-medium leading-none">{payment.warga_nama}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {payment.warga_blok}/{payment.warga_no_rumah} &middot; {BULAN_NAMES[payment.bulan - 1]} {payment.tahun}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{formatRupiah(payment.nominal)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(payment.tanggal_bayar).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
