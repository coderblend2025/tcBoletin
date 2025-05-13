import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header style={{ backgroundColor: '#03CF48' }}  className="max-w flex h-10 items-center gap-4 px-6 shadow-md">
        <div className="flex items-center gap-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
       </header>
    );
}
