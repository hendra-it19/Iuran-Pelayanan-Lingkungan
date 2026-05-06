import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { appSettings } = usePage<{ appSettings: { company_name: string; company_logo: string | null } }>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md bg-white border border-sidebar-border shadow-sm">
                {appSettings?.company_logo ? (
                    <img src={appSettings.company_logo} alt="Logo" className="size-full object-contain p-0.5" />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-zinc-900" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {appSettings?.company_name || 'Laravel Starter Kit'}
                </span>
            </div>
        </>
    );
}
