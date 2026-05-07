import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function terbilang(n: number): string {
    if (n === 0) {
        return 'Nol Rupiah';
    }

    const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    let hasil = "";

    const generate = (n: number): string => {
        let temp = "";
        if (n < 12) {
            temp = " " + angka[n];
        } else if (n < 20) {
            temp = generate(n - 10) + " Belas";
        } else if (n < 100) {
            temp = generate(Math.floor(n / 10)) + " Puluh" + generate(n % 10);
        } else if (n < 200) {
            temp = " Seratus" + generate(n - 100);
        } else if (n < 1000) {
            temp = generate(Math.floor(n / 100)) + " Ratus" + generate(n % 100);
        } else if (n < 2000) {
            temp = " Seribu" + generate(n - 1000);
        } else if (n < 1000000) {
            temp = generate(Math.floor(n / 1000)) + " Ribu" + generate(n % 1000);
        } else if (n < 1000000000) {
            temp = generate(Math.floor(n / 1000000)) + " Juta" + generate(n % 1000000);
        } else if (n < 1000000000000) {
            temp = generate(Math.floor(n / 1000000000)) + " Miliar" + generate(n % 1000000000);
        }
        return temp;
    };

    hasil = generate(n);
    return (hasil.trim() + " Rupiah").replace(/\s+/g, ' ');
}
