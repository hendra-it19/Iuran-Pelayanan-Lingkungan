import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const themes = {
    zinc: { light: '0.205 0 0', dark: '0.985 0 0' },
    slate: { light: '0.208 0.042 265.755', dark: '0.984 0.003 247.858' },
    stone: { light: '0.21 0.006 285.885', dark: '0.985 0.001 106.423' },
    red: { light: '0.577 0.245 27.325', dark: '0.637 0.237 25.331' },
    rose: { light: '0.567 0.233 13.042', dark: '0.637 0.237 25.331' },
    orange: { light: '0.648 0.2 46.452', dark: '0.706 0.17 46.452' },
    green: { light: '0.527 0.154 150.069', dark: '0.627 0.194 149.215' },
    blue: { light: '0.546 0.245 262.881', dark: '0.588 0.253 259.691' },
    violet: { light: '0.488 0.243 264.376', dark: '0.588 0.253 259.691' },
};

export default function ThemeHandler() {
    const { appSettings } = usePage().props as any;
    const themeColor = appSettings?.theme_color || 'zinc';

    useEffect(() => {
        const theme = themes[themeColor as keyof typeof themes] || themes.zinc;
        const root = document.documentElement;

        // Apply light variables
        root.style.setProperty('--primary', `oklch(${theme.light})`);
        root.style.setProperty('--sidebar-primary', `oklch(${theme.light})`);
        root.style.setProperty('--sidebar-primary-foreground', 'oklch(0.985 0 0)');

        // We can't directly set ".dark" class specific vars via setProperty on root 
        // unless we use a conditional check or separate variables.
        // Tailwind v4 uses standard CSS variables. 
        // To handle dark mode reactively, we should probably set separate variables 
        // or just let the app.blade.php handle the initial load and JS handle the updates.
        
        // Actually, if we use a <style> tag in the component, it's more robust.
    }, [themeColor]);

    return (
        <style dangerouslySetInnerHTML={{ __html: `
            :root {
                --primary: oklch(${themes[themeColor as keyof typeof themes]?.light || themes.zinc.light}) !important;
                --sidebar-primary: oklch(${themes[themeColor as keyof typeof themes]?.light || themes.zinc.light}) !important;
                --sidebar-primary-foreground: oklch(0.985 0 0) !important;
            }
            .dark {
                --primary: oklch(${themes[themeColor as keyof typeof themes]?.dark || themes.zinc.dark}) !important;
                --sidebar-primary: oklch(${themes[themeColor as keyof typeof themes]?.dark || themes.zinc.dark}) !important;
                --sidebar-primary-foreground: oklch(0.205 0 0) !important;
            }
        `}} />
    );
}
