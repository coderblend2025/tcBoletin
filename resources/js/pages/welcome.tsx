import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [bcvInfo, setBcvInfo] = useState('');
    const [binanceInfo, setBinanceInfo] = useState('');

    const colorPrimario = '#001276'; // Azul Oscuro
    const colorFondoClaro = '#E8EBF3'; // Una tonalidad muy clara del azul oscuro

    useEffect(() => {
        // Simulación de llamada a una API para obtener la información de las tasas
        // Reemplaza esto con tu lógica real para obtener los datos
        const fetchExchangeRates = async () => {
            // Aquí iría tu llamada real a la API
            // Ejemplo de datos simulados:
            const bcvData = { compra: 6.86, venta: 6.96 };
            const binanceData = { compra: 10.50, venta: 11.87 };

            setBcvInfo(`Banco Central de Bolivia: Compra ${bcvData.compra} - Venta ${bcvData.venta}`);
            setBinanceInfo(`Binance Bs/USDT: Compra ${binanceData.compra} - Venta ${binanceData.venta} (Actualizado a horas 08:00 a.m. - 30/11/2024)`);
        };

        fetchExchangeRates();
    }, []);

    return (
        <>
            <Head title="TC Boletín">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] text-[#1b1b18] lg:justify-start dark:bg-[#0a0a0a]">
                {/* Top Announcement Bar */}
                <div className="w-full text-sm text-white py-1 text-center" style={{ backgroundColor: colorPrimario }}>
                    {bcvInfo} - {binanceInfo}
                </div>

                {/* Main Header */}
                <header className="w-full bg-white dark:bg-[#0a0a0a] shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <nav className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-lg" style={{ backgroundColor: colorPrimario }}>
                                    TCB
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

                {/* Navigation Header */}
                <header className="w-full" style={{ backgroundColor: colorPrimario, color: 'white' }}>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <nav className="flex h-12 items-center justify-center">
                            <ul className="flex items-center space-x-8">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-sm font-medium hover:text-opacity-80 transition-colors"
                                        style={{ color: 'white' }}
                                    >
                                        INICIO
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-sm font-medium hover:text-opacity-80 transition-colors"
                                        style={{ color: 'white' }}
                                    >
                                        SOBRE NOSOTROS
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/work"
                                        className="text-sm font-medium hover:text-opacity-80 transition-colors"
                                        style={{ color: 'white' }}
                                    >
                                        TRABAJA CON NOSOTROS
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="text-sm font-medium hover:text-opacity-80 transition-colors"
                                        style={{ color: 'white' }}
                                    >
                                        CONTACTO
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8" style={{ backgroundColor: colorFondoClaro }}>
                    {/* Left Sidebar */}
                    <div className="lg:w-1/4 p-6 rounded-md text-white" style={{ backgroundColor: colorPrimario }}>
                        <h2 className="text-xl font-semibold mb-4">SUSCRÍBETE</h2>
                        <p className="mb-2">Accede a nuestra red de consultores y aprovecha el contenido exclusivo e ilimitado diseñado para ti.</p>
                        {/* Aquí podrías agregar un formulario de suscripción */}
                    </div>

                    {/* Center Content */}
                    <div className="lg:w-1/2 flex flex-col gap-6">
                        <div className="p-6 rounded-md" style={{ backgroundColor: colorFondoClaro, color: colorPrimario }}>
                            <h3 className="text-lg font-semibold mb-2">Diferencia entre especulación e información</h3>
                            <p className="text-sm">• Radica principalmente en el propósito y la acción involucrada en cada uno de estos conceptos. Aquí te explico:</p>
                            {/* Aquí podrías agregar más contenido o un enlace */}
                        </div>
                        <div className="p-6 rounded-md" style={{ backgroundColor: colorFondoClaro, color: colorPrimario }}>
                            <h3 className="text-lg font-semibold mb-2">Variables económicas</h3>
                            <p className="text-sm">• Aprende acerca de las principales variables económicas que tienen un impacto en tu día</p>
                            {/* Aquí podrías agregar más contenido o un enlace */}
                            <img src="https://via.placeholder.com/150" alt="Variables Económicas" className="mt-4 rounded-md" />
                        </div>
                        <div className="p-6 rounded-md" style={{ backgroundColor: colorFondoClaro, color: colorPrimario }}>
                            <h3 className="text-lg font-semibold mb-2">Principales noticias económicas</h3>
                            <p className="text-sm">• Noticias económicas en los principales periódicos y publicaciones destacadas</p>
                            {/* Aquí podrías agregar más contenido o un enlace */}
                            <img src="https://via.placeholder.com/150/0000FF/FFFFFF?Text=News" alt="Noticias Económicas" className="mt-4 rounded-md" />
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:w-1/4 p-6 rounded-md text-white" style={{ backgroundColor: colorPrimario }}>
                        <h2 className="text-xl font-semibold mb-4">SUSCRÍBETE</h2>
                        <p className="mb-2">Te ofrecemos información actualizada del mercado con transparencia.</p>
                        {/* Aquí podrías agregar un formulario de suscripción */}
                    </div>
                </main>

                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}