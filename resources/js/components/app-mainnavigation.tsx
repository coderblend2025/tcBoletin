// MainHeader.jsx
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface AppMainNavigationProps {
    colorPrimario: string;
}

function AppMainNavigation({ colorPrimario }: AppMainNavigationProps) {
    const { url } = usePage();
    const isActive = (routePath: string) => url === routePath;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        setIsMenuOpen(false); // Cierra el menú al cambiar de ruta
    }, [url]);

    return (
        <header className="w-full" style={{ backgroundColor: colorPrimario, color: 'white' }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex h-12 items-center justify-center">
                    <ul className="flex items-center space-x-8">
                        <li>
                            <Link
                                href="/"
                                className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('home')) ? 'underline' : ''}`}
                                style={{ color: 'white' }}
                            >
                                INICIO
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('about')) ? 'underline' : ''}`}
                                style={{ color: 'white' }}
                            >
                                SOBRE NOSOTROS
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/work"
                                className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('work')) ? 'underline' : ''}`}
                                style={{ color: 'white' }}
                            >
                                TRABAJA CON NOSOTROS
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('contact')) ? 'underline' : ''}`}
                                style={{ color: 'white' }}
                            >
                                CONTACTO
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default AppMainNavigation;
