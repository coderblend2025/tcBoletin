import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaPalette } from 'react-icons/fa';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Información',
        href: '/settings/profile',
        icon: null,
    },
    {
        title: 'Contraseña',
        href: '/settings/password',
        icon: null,
    },
    {
        title: 'Apariencia',
        href: '/settings/appearance',
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    const getIcon = (href: string) => {
        if (href.includes('profile')) return FaUser;
        if (href.includes('password')) return FaLock;
        if (href.includes('appearance')) return FaPalette;
        return null;
    };

    return (
        <div style={{ backgroundColor: '#001276', minHeight: '100vh' }}>
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl shadow-xl p-8 lg:p-12"
                >
                    {/* Header con diseño mejorado */}
                    <div className="text-center mb-12">
                        <motion.div
                            className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <FaPalette className="text-3xl text-blue-600" />
                        </motion.div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-4">Configuración</h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Administra tu perfil y personaliza la configuración de tu cuenta
                        </p>
                    </div>

                    <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                        {/* Sidebar mejorado */}
                        <motion.aside 
                            className="w-full lg:w-80"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">Opciones</h3>
                                <nav className="flex flex-col space-y-2">
                                    {sidebarNavItems.map((item, index) => {
                                        const Icon = getIcon(item.href);
                                        const isActive = currentPath === item.href;
                                        
                                        return (
                                            <motion.div
                                                key={`${item.href}-${index}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                            >
                                                <Button
                                                    size="lg"
                                                    variant="ghost"
                                                    asChild
                                                    className={cn(
                                                        'w-full justify-start text-left p-4 h-auto rounded-xl transition-all duration-200 hover:scale-105',
                                                        {
                                                            'bg-blue-600 text-white shadow-lg hover:bg-blue-700': isActive,
                                                            'hover:bg-white hover:shadow-md text-gray-700': !isActive,
                                                        }
                                                    )}
                                                >
                                                    <Link href={item.href} prefetch className="flex items-center space-x-3">
                                                        {Icon && (
                                                            <Icon className={cn('text-lg', {
                                                                'text-white': isActive,
                                                                'text-blue-600': !isActive,
                                                            })} />
                                                        )}
                                                        <span className="font-semibold">{item.title}</span>
                                                    </Link>
                                                </Button>
                                            </motion.div>
                                        );
                                    })}
                                </nav>
                            </div>
                        </motion.aside>

                        <Separator className="my-6 lg:hidden" />

                        {/* Contenido principal mejorado */}
                        <motion.div 
                            className="flex-1"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
                                <section className="space-y-8">{children}</section>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
