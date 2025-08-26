import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, BrickWall, Briefcase, BriefcaseBusiness, Home, Menu, ShoppingBag, Users, X, BarChart3 } from 'lucide-react';
import { useState } from 'react';

const colorPrimario = '#001276';

const getNavItemsByRole = (roles: string[]) => {
    const items: NavItem[] = [
        {
            title: 'Pantalla Principal',
            href: '/dashboard',
            icon: Home,
        }
    ];

    // Menús para administradores
    if (roles.includes('admin')) {
        items.push(
            {
                title: 'Subscripciones',
                href: '/subscriptions',
                icon: BookOpen,
            },
            {
                title: 'Usuarios',
                href: '/users',
                icon: Users,
            },
            {
                title: 'Pagos',
                href: '/pagos',
                icon: Users,
            },
            {
                title: 'Punto de Cambio',
                href: '/traders',
                icon: Briefcase,
            },
            {
                title: 'Planes',
                href: '/plans',
                icon: BriefcaseBusiness,
            }
        );
    }
    
    // Menús para clientes
    if (roles.includes('customer')) {
        items.push(
            {
                title: 'Mis Subscripciones',
                href: '/my-subscriptions',
                icon: BookOpen,
            }
        );
    }

    // Menús para invitados (guest) - Solo Punto de Cambio
    if (roles.includes('guest')) {
        items.push(
            {
                title: 'Punto de Cambio',
                href: '/traders',
                icon: Briefcase,
            }
        );
    }

    // Menús para consultores - Dashboard Admin y Punto de Cambio
    if (roles.includes('consultor')) {
        items.push(
            {
                title: 'Punto de Cambio',
                href: '/traders',
                icon: Briefcase,
            }
        );
    }

    return items;
};

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { roles: string[] } } }>().props;
    const mainNavItems = getNavItemsByRole(auth.user?.roles || []);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    console.log('Usuario actual:', auth.user);
    console.log('Roles del usuario:', auth.user?.roles);
    
    return (
        <nav    style={{ backgroundColor: colorPrimario }} className="w-full bg-sidebar border-b border-sidebar-border/70">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/dashboard" prefetch className="flex items-center">
                            <img src="/pictures/logo.png" alt="TC Boletín Logo" className="h-12 w-auto" />
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {mainNavItems.map((item) => (
                            <Link 
                                key={item.title} 
                                href={item.href} 
                                prefetch 
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                            >
                                {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu (Desktop) */}
                    <div className="hidden md:flex items-center">
                        <NavUser />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            prefetch
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        >
                            {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                            {item.title}
                        </Link>
                    ))}
                </div>
                <div className="pt-4 pb-3 border-t border-sidebar-border/70">
                    <div className="px-2">
                        <NavUser />
                    </div>
                </div>
            </div>
        </nav>
    );
}
