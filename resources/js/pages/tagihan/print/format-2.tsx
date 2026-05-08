import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

// Custom interface
interface PrintProps {
    tagihan: any | null; // null if isBlank
    settings: any;
    isBlank: boolean;
    autoPrint?: boolean;
}

const BULAN_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function Format2({ tagihan, settings, isBlank, autoPrint = true }: PrintProps) {
    useEffect(() => {
        if (autoPrint) {
            // Auto print dialog when loaded
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [autoPrint]);

    const formatDate = (dateString?: string) => {
        if (!dateString) {
return '';
}

        const date = new Date(dateString);

        return `${date.getDate().toString().padStart(2, '0')} ${BULAN_NAMES[date.getMonth()]} ${date.getFullYear()}`;
    };

    const nominalFormat = (nominal?: number) => {
        if (nominal === undefined || nominal === null) {
return '';
}

        return nominal.toLocaleString('id-ID');
    };

    const WargaName = tagihan?.warga?.nama || '';
    const BlokKav = tagihan?.warga ? `${tagihan.warga.blok} - ${tagihan.warga.no_rumah}` : '';
    const RekBulan = tagihan ? `${BULAN_NAMES[tagihan.bulan - 1]} ${tagihan.tahun}` : '';
    const Nominal = tagihan?.nominal || 0;
    const { auth, appSettings } = usePage().props as any;

    const getNoKwitansi = () => {
        if (isBlank) {
            return '';
        }

        const date = tagihan?.tanggal_bayar ? new Date(tagihan.tanggal_bayar) : new Date();
        const dmy = `${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getFullYear()}`;

        return `${dmy}${tagihan?.warga_id || ''}`;
    };
    
    return (
        <>
            <Head title="Print Kwitansi - Format 2" />
            <style>
                {`
                @media print {
                    @page { size: 9.5in 5.5in landscape; margin: 0; }
                    body { -webkit-print-color-adjust: exact; background: white; margin: 0; padding: 0; }
                    #print-controls { display: none !important; }
                }
                body { background: #f3f4f6; }
                `}
            </style>

            <div id="print-controls" className="p-4 bg-gray-800 text-white flex justify-between fixed top-0 w-full shadow z-50">
                <span>Mode Cetak: Format 2 (Nota Rincian) - {isBlank ? 'KOSONG' : 'TERISI'}</span>
                <button onClick={() => window.close()} className="px-4 py-1 bg-red-600 rounded hover:bg-red-500">Tutup</button>
            </div>

            <div className="w-[9.5in] h-[5.5in] bg-white mx-auto mt-16 print:mt-0 relative text-black overflow-hidden box-border p-4 pt-2 flex flex-col gap-2" style={{ fontFamily: '"Arial", sans-serif' }}>
                
                {/* Header */}
                <div className="flex px-4 mb-0">
                    <div className="w-32 h-32 flex items-center justify-center mr-4 overflow-hidden shrink-0">
                        {appSettings?.company_logo ? (
                            <img src={appSettings.company_logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
                        ) : (
                            <div className="text-center font-bold text-[10px] border-2 border-black p-1">LOGO</div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold tracking-wider m-0 p-0 leading-none">{settings?.company_name?.toUpperCase() || 'KEMANG PRATAMA'}</h1>
                        <h2 className="text-sm font-bold tracking-widest mt-1 mb-1">IURAN PEMELIHARAAN LINGKUNGAN (IPL)</h2>
                        <div className="text-[11px] font-semibold leading-tight mb-1">
                            wilayah : {settings?.company_address_lokasi}
                        </div>
                        <hr className="border-black border-t-2" />
                        <div className="mt-1 text-[11px] leading-tight">
                            kantor : {settings?.company_address_pusat}<br/>
                            Telp. {settings?.company_phone} / WA. {settings?.company_wa}
                        </div>
                    </div>
                </div>

                {/* Info Boxes */}
                <div className="px-4 flex gap-4 text-xs font-semibold uppercase mb-4">
                    <div className="flex-1 border-2 border-black p-2 flex flex-col gap-1">
                        <div className="flex"><span className="w-[120px]">VA Pelanggan</span>: {!isBlank ? `V${tagihan?.warga_id?.toString().padStart(6, '0')}` : ''}</div>
                        <div className="flex"><span className="w-[120px]">Nama Pelanggan</span>: {!isBlank ? WargaName : ''}</div>
                        <div className="flex items-baseline">
                            <span className="w-[120px] shrink-0">Blok - Kav.</span>: 
                            <span className="ml-1">
                                {!isBlank ? BlokKav : ''} 
                                {tagihan?.warga?.alamat && (
                                    <span className="ml-1 text-[11px] font-normal lowercase italic text-gray-600 truncate inline-block max-w-[250px] align-bottom">- {tagihan.warga.alamat}</span>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 border-2 border-black p-2 flex flex-col gap-1">
                        <div className="flex"><span className="w-[120px]">No. Kwitansi</span>: {getNoKwitansi()}</div>
                        <div className="flex"><span className="w-[120px]">Rek. Bulan</span>: {!isBlank ? RekBulan : ''}</div>
                        <div className="flex"><span className="w-[120px]">Complex Service</span>: IURAN PEMELIHARAAN LINGKUNGAN (IPL)</div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="px-4">
                    <table className="w-full text-xs font-semibold border-2 border-black border-collapse text-center">
                        <thead>
                            <tr className="border-b-2 border-black bg-gray-200">
                                <th className="border-r border-black p-1 w-12">No</th>
                                <th className="border-r border-black p-1">Rincian Pembayaran</th>
                                <th className="border-r border-black p-1">Tarif Standar</th>
                                <th className="border-r border-black p-1">Volume</th>
                                <th className="p-1">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-r border-black p-2">1</td>
                                <td className="border-r border-black p-2 text-left">IPL Periode {RekBulan}</td>
                                <td className="border-r border-black p-2 text-right">{!isBlank ? nominalFormat(Nominal) : ''}</td>
                                <td className="border-r border-black p-2">1 Bulan</td>
                                <td className="p-2 text-right">{!isBlank ? nominalFormat(Nominal) : ''}</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black p-2">2</td>
                                <td className="border-r border-black p-2 text-left">Denda / Biaya Lainnya</td>
                                <td className="border-r border-black p-2 text-right">0</td>
                                <td className="border-r border-black p-2">-</td>
                                <td className="p-2 text-right">0</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-black bg-gray-200">
                                <td colSpan={4} className="border-r border-black p-1 text-right pr-4 font-bold uppercase">
                                    Total Kewajiban Pembayaran
                                </td>
                                <td className="p-1 text-right font-bold pr-2">
                                    {!isBlank ? nominalFormat(Nominal) : ''}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer Totals */}
                <div className="flex px-4 mt-auto pr-8">
                        <div className="flex-1 text-sm font-bold flex flex-col justify-end pb-2">
                        {/* Payment Instructions */}
                        <div className="text-[11px] font-normal normal-case leading-relaxed text-gray-700">
                            <p className="font-bold underline mb-0.5">Informasi Pembayaran:</p>
                            <p>1. Tunai / Pembayaran langsung melalui Loket Pembayaran.</p>
                            <p>2. Transfer via {settings?.bank_name || 'Bank BNI'} No. {settings?.bank_account || '16492971'} a/n {settings?.bank_holder || 'PT. KEMANG PRATAMA'}</p>
                        </div>
                    </div>
                    
                    <div className="w-[250px] relative flex flex-col items-center justify-end text-center text-xs">
                        {/* Lunas Stamp Mock */}
                        {!isBlank && tagihan?.status === 'Lunas' && (
                            <div className="absolute top-2 left-0 right-0 transform -rotate-12 pointer-events-none opacity-40">
                                <div className="text-green-600 font-extrabold text-4xl tracking-widest border-4 border-green-600 rounded p-1 inline-block">
                                    LUNAS
                                </div>
                                <div className="text-green-600 text-[10px] font-bold mt-1">
                                    {formatDate(tagihan.tanggal_bayar)}
                                </div>
                            </div>
                        )}
                        
                        <div className="mb-14 font-semibold">
                            {settings?.company_city || 'Bekasi'}, {formatDate(!isBlank ? (tagihan?.tanggal_bayar || new Date().toISOString()) : undefined) || '.....'} <br/>
                            {settings?.company_name || 'Unit Pengelola'}
                        </div>
                        
                        <div className="font-bold border-t border-black inline-block px-4 min-w-[150px]">
                            {auth.user?.name || 'Pimpinan Unit'}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
