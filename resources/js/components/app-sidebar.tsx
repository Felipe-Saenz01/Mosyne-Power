import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, Calendar, Box } from 'lucide-react';
import AppLogo from './app-logo';

const platformNavItems: NavItem[] = [
    {
        title: 'Flashcard del Día',
        href: route('dashboard'),
        icon: Calendar,
    },
    {
        title: 'Flashcards',
        href: route('flashcards.index'),
        icon: BookOpen,
    },
    {
        title: 'Cajas de Leitner',
        href: route('leitner.index'),
        icon: Box,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                                <span className="ml-2 text-lg font-semibold">Mosyne Power</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <div className="mb-4">
                    <div className="px-4 py-2">
                        <h2 className="text-xs font-semibold text-muted-foreground">Platform</h2>
                    </div>
                    <NavMain items={platformNavItems} />
                </div>
            </SidebarContent>

            <SidebarFooter>
                <div className="mb-4">
                    <div className="px-4 py-2">
                        <h2 className="text-xs font-semibold text-muted-foreground">Resources</h2>
                    </div>
                    <NavMain items={footerNavItems} />
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
