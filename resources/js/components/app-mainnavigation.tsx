// MainHeader.jsx (o .tsx si usas TS)
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Home, Users, Handshake, Phone, Menu as MenuIcon, X } from 'lucide-react';

interface AppMainNavigationProps {
  colorPrimario: string;
}

function AppMainNavigation({ colorPrimario }: AppMainNavigationProps) {
  const { url } = usePage();
  const isActive = (routePath: string) => url === routePath;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  useEffect(() => {
    // Cerrar menú al navegar
    setIsMenuOpen(false);
  }, [url]);

  return (
    <header className="w-full shadow-md" style={{ backgroundColor: 'white', color: 'black' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Barra superior */}
        <div className="flex h-12 items-center justify-between">
          {/* Placeholder para centrar (puedes poner tu logo aquí si quieres, no altera el diseño actual) */}
          <div className="w-6 h-6 md:hidden" aria-hidden />

          {/* Nav centrado en desktop (idéntico diseño) */}
          <nav className="hidden md:flex h-12 items-center justify-center mx-auto">
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  href="/"
                  className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('home')) ? 'underline' : ''}`}
                  style={{ color: '#001276' }}
                >
                  <span className="inline-flex items-center gap-1">
                    <Home size={16} className="mb-0.5" />
                    Inicio
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('about')) ? 'underline' : ''}`}
                  style={{ color: '#001276' }}
                >
                  <span className="inline-flex items-center gap-1">
                    <Users size={16} className="mb-0.5" />
                    Sobre nosotros
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/work"
                  className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('work')) ? 'underline' : ''}`}
                  style={{ color: '#001276' }}
                >
                  <span className="inline-flex items-center gap-1">
                    <Handshake size={16} className="mb-0.5" />
                    Trabaja con nosotros
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`text-sm font-medium hover:text-opacity-80 transition-colors ${isActive(route('contact')) ? 'underline' : ''}`}
                  style={{ color: '#001276' }}
                >
                  <span className="inline-flex items-center gap-1">
                    <Phone size={16} className="mb-0.5" />
                    Contacto
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Botón hamburguesa en móviles (no cambia el diseño en desktop) */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001276]"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>

        {/* Menú móvil desplegable (mismo contenido y estilo de links) */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="pb-3">
            <ul className="flex flex-col space-y-2 pt-2">
              <li>
                <Link
                  href="/"
                  className={`block w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-black/5 transition-colors ${
                    isActive(route('home')) ? 'underline' : ''
                  }`}
                  style={{ color: '#001276' }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Home size={16} />
                    Inicio
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`block w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-black/5 transition-colors ${
                    isActive(route('about')) ? 'underline' : ''
                  }`}
                  style={{ color: '#001276' }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Users size={16} />
                    Sobre nosotros
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/work"
                  className={`block w-full px-2 py-2 text-sm font-medium rounded-md hover:bg.black/5 transition-colors ${
                    isActive(route('work')) ? 'underline' : ''
                  }`}
                  style={{ color: '#001276' }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Handshake size={16} />
                    Trabaja con nosotros
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`block w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-black/5 transition-colors ${
                    isActive(route('contact')) ? 'underline' : ''
                  }`}
                  style={{ color: '#001276' }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Phone size={16} />
                    Contacto
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default AppMainNavigation;
