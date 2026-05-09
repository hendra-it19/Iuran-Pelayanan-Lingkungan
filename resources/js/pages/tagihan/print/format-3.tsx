import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { terbilang } from '@/lib/utils';

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

export default function Format3({ tagihan, settings, isBlank, autoPrint = true }: PrintProps) {
    useEffect(() => {
        if (autoPrint) {
            // Auto print dialog when loaded
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [autoPrint]);


    const formatDateFull = () => {
        const date = new Date();

        return `${date.getDate().toString().padStart(2, '0')} ${BULAN_NAMES[date.getMonth()]} ${date.getFullYear()}`;
    };

    const nominalFormat = (nominal?: number) => {
        if (nominal === undefined || nominal === null) {
            return '0';
        }

        return nominal.toLocaleString('id-ID');
    };

    const WargaName = tagihan?.warga?.nama || '';
    const WargaNoRumah = tagihan?.warga?.no_rumah || '';
    const WargaBlok = tagihan?.warga?.blok || '';
    const RekBulan = tagihan ? `${BULAN_NAMES[tagihan.bulan - 1]} - ${tagihan.tahun.toString().substring(2)}` : '';
    const Nominal = tagihan?.nominal || 0;
    const { auth, appSettings } = usePage().props as any;

    const formatCompanyName = (name: string) => {
        return name.split(' ').map((word, wordIndex) => {
            if (!word) {
                return null;
            }

            const firstChar = word.charAt(0);
            const rest = word.slice(1);

            return (
                <span key={wordIndex} className="inline-flex items-baseline mr-2 last:mr-0">
                    <span className="text-[1.5em] font-[1000] leading-none relative" style={{ top: '0.12em', textShadow: '0.7px 0 currentColor, -0.7px 0 currentColor' }}>{firstChar}</span>
                    <span className="underline decoration-1 underline-offset-[2px] font-black text-[0.95em]" style={{ textShadow: '0.6px 0 currentColor' }}>{rest}</span>
                </span>
            );
        });
    };

    return (
        <>
            <Head title="Print Kwitansi - Format 3" />
            <style>
                {`
                @media print {
                    @page { size: 9.5in 5in landscape; margin: 0; }
                    body { -webkit-print-color-adjust: exact; background: white; margin: 0; padding: 0; }
                    #print-controls { display: none !important; }
                }
                body { background: #f3f4f6; }
                `}
            </style>

            <div id="print-controls" className="p-4 bg-gray-800 text-white flex justify-between fixed top-0 w-full shadow z-50">
                <span>Mode Cetak: Format Baru (Bukti Pembayaran) - {isBlank ? 'KOSONG' : 'TERISI'}</span>
                <button onClick={() => window.close()} className="px-4 py-1 bg-red-600 rounded hover:bg-red-500">Tutup</button>
            </div>

            <div className="w-[9.5in] h-[5in] bg-white mx-auto mt-16 print:mt-0 relative text-black overflow-hidden box-border p-6 border border-gray-300 print:border-0" style={{ fontFamily: '"Arial", sans-serif' }}>

                {/* Border Outer */}
                <div className="absolute inset-4 border border-black pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 shrink-0">
                                {appSettings?.company_logo ? (
                                    <img src={appSettings.company_logo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full border border-black flex items-center justify-center font-bold text-[8px]">LOGO</div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <div className="text-[10px] font-black text-gray-800 leading-tight -mb-1" style={{ fontFamily: '"Times New Roman", Times, serif', textShadow: '0.6px 0 currentColor' }}>COMPLEX SERVICE</div>
                                <h1 className="text-xl leading-none text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                                    {formatCompanyName(settings?.company_name || 'KEMANG PRATAMA')}
                                </h1>
                                <div className="text-[10px] font-medium text-gray-700 mt-1 leading-tight">
                                    Kantor : {settings?.company_address_pusat || 'Jl. Kemang Pratama Raya Blok A No.01'}<br />
                                    Telp. {settings?.company_phone || '8240-6129'} / WA. {settings?.company_wa || '0813-9970-098'}
                                </div>
                            </div>
                        </div>
                        <div className="text-right flex flex-col gap-1 pr-4">
                            <div className="flex gap-2 text-xs font-bold">
                                <span className="w-12">No</span>
                                <span>: {!isBlank ? (tagihan?.id?.toString().padStart(6, '0')) : '.......................'}</span>
                            </div>
                            <div className="flex gap-2 text-xs font-bold">
                                <span className="w-12">Bulan</span>
                                <span>: {!isBlank ? RekBulan : '.......................'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 text-left px-4">
                        <h2 className="text-lg font-black tracking-wide" style={{ fontFamily: '"Times New Roman", Times, serif' }}>BUKTI PEMBAYARAN</h2>
                    </div>

                    {/* Content Section */}
                    <div className="mt-2 flex flex-col gap-0.5 px-4 text-sm">
                        <div className="flex">
                            <div className="w-40 font-bold shrink-0">Sudah Terima Dari</div>
                            <div className="w-4 shrink-0">:</div>
                            <div className={`flex-1 font-bold text-blue-700 min-h-[20px] ${isBlank ? 'border-b border-dotted border-gray-400' : ''}`}>
                                {!isBlank ? `Bp/Ibu ${WargaName}` : ''}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-40 font-bold shrink-0">Alamat</div>
                            <div className="w-4 shrink-0">:</div>
                            <div className={`flex-1 font-bold text-blue-700 min-h-[20px] ${isBlank ? 'border-b border-dotted border-gray-400' : ''}`}>
                                {!isBlank ? `Blok ${WargaBlok}.${WargaNoRumah}` : ''}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-40 font-bold shrink-0">Zona</div>
                            <div className="w-4 shrink-0">:</div>
                            <div className={`flex-1 font-bold text-blue-700 min-h-[20px] ${isBlank ? 'border-b border-dotted border-gray-400' : ''}`}>
                                {!isBlank ? (settings?.company_address_lokasi || 'Ruko KP.1/KP. Golf/Ruko KP Golf/Magnolia') : ''}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-40 font-bold shrink-0">Untuk Pembayaran</div>
                            <div className="w-4 shrink-0">:</div>
                            <div className={`flex-1 font-bold text-blue-700 min-h-[20px] ${isBlank ? 'border-b border-dotted border-gray-400' : ''}`}>
                                {!isBlank ? 'Iuran Pemeliharaan Lingkungan' : ''}
                            </div>
                        </div>
                    </div>

                    {/* Amount Section */}
                    <div className="mt-4 px-4 flex items-center gap-6">
                        <div className="text-sm font-bold w-40 shrink-0">Uang Sejumlah</div>
                        {!isBlank ? (
                            <div className="border-2 border-black px-8 py-0.5 font-black text-lg bg-gray-50 min-w-[200px] text-center">
                                Rp. {nominalFormat(Nominal)},-
                            </div>
                        ) : (
                            <div className="flex-1 font-black text-lg border-b border-dotted border-gray-400">
                                Rp. ................................................................
                            </div>
                        )}
                    </div>

                    {/* Terbilang Section */}
                    <div className="mt-1 px-4 flex items-start gap-6">
                        <div className="text-[11px] italic font-bold w-40 shrink-0">Terbilang</div>
                        <div className="flex-1 text-[11px] italic font-bold text-gray-800 capitalize border-b border-dotted border-gray-400 min-h-[16px]">
                            {!isBlank ? terbilang(Nominal) : ''}
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-4 grid grid-cols-2 px-4 pb-1">
                        <div className="text-[10px] leading-relaxed">
                            <p className="font-bold mb-1">Pembayaran dapat dilakukan :</p>
                            <p>1. Transfer via {settings?.bank_name || 'Bank BNI'} No. {settings?.bank_account || '16492971'} a/n {settings?.bank_holder || 'PT. Kemang Pratama'}</p>
                            <p>2. Pembayaran Tunai langsung di Loket Pembayaran</p>

                            <p className="mt-4 font-bold italic leading-tight text-[11px]">
                                Kedisiplinan membayar iuran sangat membantu kelancaran<br />
                                pelaksanaan pekerjaan pemeliharaan untuk kepentingan bersama
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-end text-sm pr-12">
                            <div className="text-center">
                                <p className="font-bold">{settings?.company_city || 'Bekasi'}, {!isBlank ? formatDateFull() : '.......................'}</p>
                                <p className="font-black text-xs mt-0" style={{ fontFamily: '"Times New Roman", Times, serif', textShadow: '0.6px 0 currentColor' }}>COMPLEX SERVICE</p>

                                <div className="mt-12">
                                    <p className="font-bold underline leading-none">{!isBlank ? auth.user?.name : '.......................'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lunas Stamp Mock */}
                {!isBlank && tagihan?.status === 'Lunas' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-20">
                        <div className="text-green-600 font-extrabold text-7xl tracking-widest border-8 border-green-600 rounded-xl p-4 inline-block">
                            LUNAS
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
