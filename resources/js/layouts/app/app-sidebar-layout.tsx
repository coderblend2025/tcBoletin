import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
          <div style={{ backgroundColor: '#001276' }} className="flex flex-col w-full min-h-screen">
            <AppSidebar />
                <main className="flex-1">
                    <div  style={{ backgroundColor: '#001276' }} className="mx-auto  w-full max-w ">
                        <AppSidebarHeader  breadcrumbs={breadcrumbs} />
                            {children}
                    </div>
                </main>
            </div>
        </AppShell>
    );
}
