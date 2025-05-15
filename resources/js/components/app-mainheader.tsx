// MainHeader.jsx
import { Link } from '@inertiajs/react';

interface MainHeaderProps {
    auth: { user: boolean };
    colorPrimario: string;
}

function AppMainHeader({ auth, colorPrimario }: MainHeaderProps) {
    const medioNegroBackground = 'bg-[#333333] dark:bg-[#1a1a1a]';

    return (
        <header className={`w-full shadow-sm ${medioNegroBackground}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex h-15 w-15 items-center justify-center rounded-full">
                            <img src="/pictures/logo.png" alt="Logo" className="h-full w-full object-contain" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                         {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-white px-5 py-1.5 text-sm leading-normal text-white hover:border-gray-200 dark:border-white dark:text-white dark:hover:border-gray-800"
                            >
                                Administración de la Página Web
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-white hover:border-gray-200 dark:text-white dark:hover:border-gray-800"
                                    style={{ backgroundColor: 'white', color: '#1b1b18' }}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-white px-5 py-1.5 text-sm leading-normal text-white hover:bg-white hover:text-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"

                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default AppMainHeader;
