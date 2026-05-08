import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface PrintProps {
    tagihan: any | null;
    settings: any;
    isBlank: boolean;
    autoPrint?: boolean;
}

export default function Format1({ tagihan, settings, isBlank, autoPrint = true }: PrintProps) {
    useEffect(() => {
        if (autoPrint) {
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

        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const nominalFormat = (nominal?: number) => {
        if (!nominal && nominal !== 0) {
            return '';
        }

        return `Rp ` + nominal.toLocaleString('id-ID');
    };

    const WargaName = tagihan?.warga?.nama || '';
    const Nominal = tagihan?.nominal || 0;
    const NominalString = '=== ' + nominalFormat(tagihan?.nominal) + ' ===';
    const PaymentText = tagihan ? `Iuran Pelayanan Lingkungan (IPL) Bulan ${tagihan.bulan} Tahun ${tagihan.tahun}` : '';
    const companyName = settings?.company_name || 'PT KEMANG PRATAMA';
    const { appSettings } = usePage<any>().props;

    return (
        <>
            <Head title="Print Kwitansi - Format 1" />
            <style>
                {`
                @media print {
                    @page { size: 9.5in 5.5in landscape; margin: 0; }
                    body { -webkit-print-color-adjust: exact; background: white; margin: 0; padding: 0; }
                    #print-controls { display: none !important; }
                }
                body { background: #d1d5db; margin: 0; }

                .brand-name {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                    font-size: 15px;
                    font-weight: bold;
                    letter-spacing: 0.18em;
                    color: white;
                    white-space: nowrap;
                    text-align: center;
                }

                .addr-vertical {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                    font-size: 7px;
                    line-height: 1.3;
                    color: #444;
                    white-space: nowrap;
                }
                `}
            </style>

            <div id="print-controls" className="p-3 bg-gray-800 text-white flex justify-between items-center fixed top-0 w-full shadow z-50 text-sm print:hidden">
                <span>Mode Cetak: Format 1 ({isBlank ? 'KOSONG' : 'TERISI'})</span>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="px-4 py-1 bg-blue-600 rounded hover:bg-red-500">Cetak</button>
                    <button onClick={() => window.close()} className="px-4 py-1 bg-red-600 rounded hover:bg-red-500">Tutup</button>
                </div>
            </div>

            {/* Receipt — same full-width approach as format-2 */}
            <div
                className="w-[9.5in] h-[5.5in] bg-white mx-auto mt-14 print:mt-0 relative overflow-hidden box-border"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#1a1a1a' }}
            >
                {/* Full-height flex layout */}
                <div className="flex h-full">

                    {/* ===== LEFT BRANDING SECTION ===== */}

                    {/* Green company name block */}
                    <div
                        className="shrink-0 border-r-2 border-gray-700 bg-[#4A5D23] flex items-center justify-center relative overflow-hidden"
                        style={{ width: '90px' }}
                    >
                        {/* Logo at bottom */}
                        {appSettings?.company_logo && (
                            <div className="absolute bottom-5 left-2 right-2 flex items-center justify-center" style={{ height: '65px', transform: 'rotate(-90deg)' }}>
                                <img src={appSettings.company_logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                            </div>
                        )}
                        <span className="brand-name">{companyName.toUpperCase()}</span>
                    </div>

                    {/* Address column — Kantor Pusat */}
                    <div className="shrink-0 flex items-center justify-center relative" style={{ width: '24px' }}>
                        <span className="addr-vertical">
                            <strong>Kantor Pusat :</strong> {settings?.company_address_pusat} &nbsp;Telp. {settings?.company_phone} {settings?.company_wa && `WA. ${settings.company_wa}`}
                        </span>
                    </div>

                    {/* Address column — Kantor Lokasi */}
                    <div className="shrink-0 flex items-center justify-center relative" style={{ width: '24px' }}>
                        <span className="addr-vertical">
                            <strong>Kantor Lokasi :</strong> {settings?.company_address_lokasi}
                        </span>
                    </div>

                    {/* ===== RIGHT FORM CONTENT ===== */}
                    <div className="flex-1 flex flex-col min-w-0" style={{ padding: '20px 24px 12px 20px' }}>

                        {/* No. */}
                        <div className="flex justify-end mb-3">
                            <span style={{ fontSize: '11px', fontWeight: 600 }}>
                                No. <span className="border-b border-black inline-block" style={{ width: '130px' }} />
                            </span>
                        </div>

                        {/* Sudah terima dari */}
                        <div className="flex mb-3">
                            <div className="shrink-0" style={{ width: '110px', fontSize: '11px', lineHeight: '1.4' }}>
                                Sudah terima dari<br /><span className="italic" style={{ fontSize: '10px' }}>Received from</span>
                            </div>
                            <div className="flex-1 min-w-0" style={{ paddingLeft: '8px', fontSize: '12px' }}>
                                : <strong style={{ textTransform: 'uppercase' }}>{!isBlank ? WargaName : ''}</strong>
                                <div className="border-b border-black w-full" style={{ marginTop: '14px' }} />
                            </div>
                        </div>

                        {/* Banyaknya Uang */}
                        <div className="flex mb-3">
                            <div className="shrink-0" style={{ width: '110px', fontSize: '11px', lineHeight: '1.4' }}>
                                Banyaknya Uang<br /><span className="italic" style={{ fontSize: '10px' }}>The Sum of</span>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-1" style={{ paddingLeft: '8px' }}>
                                <div
                                    className="w-full border border-black flex items-center px-3"
                                    style={{ height: '22px', background: '#ccc', fontSize: '11px', fontWeight: 600, fontStyle: 'italic' }}
                                >
                                    {!isBlank ? NominalString : ''}
                                </div>
                                <div
                                    className="w-full border border-black"
                                    style={{ height: '22px', background: '#ccc' }}
                                />
                            </div>
                        </div>

                        {/* Untuk Pembayaran */}
                        <div className="flex mb-2">
                            <div className="shrink-0" style={{ width: '110px', fontSize: '11px', lineHeight: '1.4' }}>
                                Untuk Pembayaran<br /><span className="italic" style={{ fontSize: '10px' }}>In Payment of</span>
                            </div>
                            <div className="flex-1 min-w-0" style={{ paddingLeft: '8px' }}>
                                : <span style={{ fontWeight: 500, fontSize: '11px' }}>{!isBlank ? PaymentText : ''}</span>
                                <div className="border-b border-black w-full" style={{ marginTop: '12px' }} />
                                <div className="border-b border-black w-full" style={{ marginTop: '16px' }} />
                            </div>
                        </div>

                        {/* Footer: disclaimer + total + city/date */}
                        <div className="mt-auto flex justify-between items-end pr-10" style={{ paddingBottom: '4px' }}>
                            {/* Left: disclaimer + total box */}
                            <div style={{ maxWidth: '260px' }}>
                                <div style={{ fontSize: '8px', lineHeight: '1.3', color: '#555', marginBottom: '6px' }}>
                                    Pembayaran dengan Cek/Giro dsb, adalah syah sesudah ada clearance dari Bank ybs.<br />
                                    <em>Payment by cheque etc. is subject to final clearance of the bank</em>
                                </div>
                                <div className="flex" style={{ border: '2px solid #555' }}>
                                    <div
                                        className="flex flex-col justify-center"
                                        style={{ width: '65px', padding: '4px 6px', fontSize: '10px', fontWeight: 'bold', borderRight: '1px solid #555' }}
                                    >
                                        <span>Jumlah Rp.</span>
                                        <span>Total</span>
                                    </div>
                                    <div
                                        className="flex-1 flex items-center justify-end"
                                        style={{ background: '#ccc', padding: '4px 8px', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.5px', minWidth: '100px' }}
                                    >
                                        {!isBlank ? nominalFormat(Nominal) : ''}
                                    </div>
                                </div>
                            </div>

                            {/* Right: city + date */}
                            <div className="flex flex-col items-center" style={{ fontSize: '11px', textAlign: 'center' }}>
                                <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{settings?.company_city || 'BEKASI'}</span>
                                <span
                                    className="border-b border-dotted border-black inline-block text-center mt-1"
                                    style={{ width: '120px', fontWeight: 'bold' }}
                                >
                                    {!isBlank ? formatDate(tagihan?.tanggal_bayar) : '.......................'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
