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
        setIsMenuOpen(false);
    }, [url]);

    return (
        <header className="w-full shadow-md" style={{ backgroundColor: 'white', color: 'black' }}>
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
   <nav className="flex h-12 items-center justify-center">
  <ul className="flex items-center space-x-8">
    <li>
      <Link
        href="/"
        className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('home')) ? 'underline' : ''}`}
        style={{ color: '#001276' }}
      >
        INICIO
      </Link>
    </li>
    <li>
      <Link
        href="/about"
        className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('about')) ? 'underline' : ''}`}
        style={{ color: '#001276' }}
      >
        SOBRE NOSOTROS
      </Link>
    </li>
    <li>
      <Link
        href="/work"
        className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('work')) ? 'underline' : ''}`}
        style={{ color: '#001276' }}
      >
        TRABAJA CON NOSOTROS
      </Link>
    </li>
    <li>
      <Link
        href="/contact"
        className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('contact')) ? 'underline' : ''}`}
        style={{ color: '#001276' }}
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
