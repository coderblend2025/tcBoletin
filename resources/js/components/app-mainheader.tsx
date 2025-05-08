// MainHeader.jsx
import { Link } from '@inertiajs/react';

interface MainHeaderProps {
    auth: { user: boolean };
    colorPrimario: string;
}

function AppMainHeader({ auth, colorPrimario }: MainHeaderProps) {
    return (
        <header className="w-full bg-white dark:bg-[#0a0a0a] shadow-sm">
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
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Administración de la Página Web
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border" style={{ borderColor: colorPrimario, color: colorPrimario, padding: '0.375rem 1.25rem', fontSize: '0.875rem', lineHeight: 'normal', fontWeight: 'normal', borderRadius: '0.125rem', backgroundColor: 'transparent', transition: 'background-color 0.15s, color 0.15s' }}
                                    onMouseOver={(e) => {
                                        const target = e.target as HTMLButtonElement;
                                        target.style.backgroundColor = colorPrimario;
                                        target.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        const target = e.target as HTMLButtonElement;
                                        target.style.backgroundColor = 'transparent';
                                        target.style.color = colorPrimario;
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