import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Format1 from './format-1';
import Format2 from './format-2';

interface BulkPrintProps {
    tagihans: any[];
    settings: any;
    format: 'format-1' | 'format-2';
}

export default function BulkPrint({ tagihans, settings, format }: BulkPrintProps) {
    useEffect(() => {
        if (tagihans.length > 0) {
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    }, [tagihans]);

    return (
        <>
            <Head title={`Cetak Masal - ${format === 'format-1' ? 'Model 1' : 'Model 2'}`} />
            
            <div id="print-controls" className="p-3 bg-gray-800 text-white flex justify-between items-center fixed top-0 w-full shadow z-50 text-sm print:hidden">
                <span>Cetak Masal: {tagihans.length} Tagihan ({format})</span>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-500">Cetak</button>
                    <button onClick={() => window.close()} className="px-4 py-1 bg-red-600 rounded hover:bg-red-500">Tutup</button>
                </div>
            </div>

            <div className="bg-gray-100 min-h-screen pt-14 print:pt-0">
                {tagihans.map((tagihan, index) => (
                    <div key={tagihan.id} className={index > 0 ? 'page-break' : ''}>
                        <style>{`
                            @media print {
                                .page-break { page-break-before: always; }
                                body { background: white !important; }
                            }
                        `}</style>
                        {format === 'format-1' ? (
                            <Format1 tagihan={tagihan} settings={settings} isBlank={false} autoPrint={false} />
                        ) : (
                            <Format2 tagihan={tagihan} settings={settings} isBlank={false} autoPrint={false} />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
