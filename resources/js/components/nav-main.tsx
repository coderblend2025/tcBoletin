import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="w-full">
            <SidebarMenu className="flex flex-row items-center justify-start gap-2 px-4 py-2">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title} className="inline-flex">
                        <SidebarMenuButton  
                            asChild 
                            isActive={item.href === page.url}
                            className="h-10 px-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                            <Link href={item.href} prefetch className="flex items-center">
                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                <span className="text-sm font-medium">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
