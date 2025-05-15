// MainHeader.jsx
import { Link } from '@inertiajs/react';

interface MainHeaderProps {
    auth: { user: boolean };
    colorPrimario: string;
}

function AppMainHeader({ auth, colorPrimario }: MainHeaderProps) {
    const medioNegroBackground = 'bg-[#001276]';

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
                            className="inline-block rounded-sm border border-white px-5 py-1.5 text-sm leading-normal text-white hover:border-[#f7f7f7] dark:border-white dark:text-white dark:hover:border-[#f2f2f2]"
                        >
                            Administración de la Página Web
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-white px-5 py-1.5 text-sm leading-normal text-white hover:border-[#f7f7f7] dark:border-white dark:text-white dark:hover:border-[#f2f2f2]"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-sm border border-white px-5 py-1.5 text-sm leading-normal text-white hover:bg-white hover:text-[#1b1b18] dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#EDEDEC]"
                                style={{ backgroundColor: 'transparent' }}
                                onMouseOver={(e) => {
                                    const target = e.target as HTMLButtonElement;
                                    target.style.backgroundColor = 'white';
                                    target.style.color = colorPrimario;
                                }}
                                onMouseOut={(e) => {
                                    const target = e.target as HTMLButtonElement;
                                    target.style.backgroundColor = 'transparent';
                                    target.style.color = 'white';
                                }}
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
