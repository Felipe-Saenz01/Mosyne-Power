import React from 'react';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { ReviewHUD } from '@/components/review-hud';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

interface SharedData {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    reviewStats: {
        cardsToReview: number;
        completedToday: number;
        totalCards: number;
        successRate: number;
    };
    [key: string]: any; // Add index signature for PageProps compatibility
}

export default function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
    const { reviewStats } = usePage<SharedData>().props;

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <div className="flex-1">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="relative">
                    {children}
                    <ReviewHUD {...reviewStats} />
                </div>
            </div>
        </AppShell>
    );
}
