import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, CreditCard, LayoutGrid, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import * as adminUserRoutes from '@/routes/admin/users';
import * as tagihan from '@/routes/tagihan';
import * as tunggakan from '@/routes/tunggakan';
import * as warga from '@/routes/warga';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Data Warga',
            href: warga.index(),
            icon: Users,
        },
        {
            title: 'Pembayaran IPL',
            href: tagihan.index(),
            icon: CreditCard,
        },
        {
            title: 'Tunggakan',
            href: tunggakan.index(),
            icon: AlertTriangle,
        },
    ];

    if (auth.user?.is_admin) {
        mainNavItems.push({
            title: 'Manajemen Akun',
            href: adminUserRoutes.index().url,
            icon: Users, // Using same icon for now, or maybe UserCog if available
        });
    }

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
