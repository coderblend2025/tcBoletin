import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Briefcase, Home, Menu, ShoppingBag, Users, X } from 'lucide-react';
import { useState } from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { type NavItem } from '@/types';

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    title: 'Pantalla Principal',
    href: '/dashboard',
    icon: Home,
  }
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Servicios',
    href: '/services',
    icon: ShoppingBag,
  },
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
    title: 'Librecambistas',
    href: '/traders',
    icon: Briefcase,
  }
];

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  {
    title: 'Servicios',
    href: '/services',
    icon: ShoppingBag,
  },
  {
    title: 'Mis Subscripciones',
    href: '/my-subscriptions',
    icon: BookOpen,
  }
];

const getNavItemsByRole = (roles: string[]): NavItem[] => {
  const items = [...DEFAULT_NAV_ITEMS];

  if (roles.includes('admin')) {
    items.push(...ADMIN_NAV_ITEMS);
  } else if (roles.includes('customer')) {
    items.push(...CUSTOMER_NAV_ITEMS);
  }

  return items;
};

export function AppSidebar() {
  const { auth } = usePage<{ auth: { user: { roles: string[] } } }>().props;
  const mainNavItems = getNavItemsByRole(auth.user?.roles || []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const commonLinkClasses = "flex items-center px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors";
  const iconClasses = "h-4 w-4 mr-2";

  return (
    <nav className="w-full bg-sidebar border-b border-sidebar-border/70">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" prefetch className="flex items-center">
              <span className="text-xl font-bold text-sidebar-accent-foreground">TC BOLETIN</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {mainNavItems.map(({ title, href, icon: Icon }) => (
              <Link 
                key={title} 
                href={href} 
                prefetch 
                className={commonLinkClasses}
              >
                {Icon && <Icon className={iconClasses} />}
                {title}
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
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainNavItems.map(({ title, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                prefetch
                className={commonLinkClasses}
                onClick={toggleMobileMenu}
              >
                {Icon && <Icon className={iconClasses} />}
                {title}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-sidebar-border/70">
            <div className="px-2">
              <NavUser />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}