import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { WelcomeModal } from '@/components/modals/welcomeModal';
import { motion } from 'framer-motion';
import { FaUsers, FaInfoCircle, FaChartBar, FaNewspaper, FaArrowRight } from 'react-icons/fa'; // Import Font Awesome icons

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [bcvInfo, setBcvInfo] = useState('');
    const [binanceInfo, setBinanceInfo] = useState('');
    type Bank = { name: string; compra: string; venta: string };
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);

    const colorPrimario = '#001276'; // Azul Oscuro
    const colorFondoClaro = '#F4F6F8'; // A light, neutral background
    const colorTextoPrincipal = '#374151'; // Darker, more standard gray
    const colorTextoSecundario = '#6B7280'; // Slightly lighter secondary gray
    const colorAccent = '#3B82F6'; // A more vibrant, standard blue for links
    const [isModalOpen, setIsModalOpen] = useState(false);

    const banks = [
      { name: 'Banco BCP', compra: '6.85', venta: '6.95' },
      { name: 'Banco Bisa', compra: '6.84', venta: '6.94' },
      { name: 'Banco BNB', compra: '6.83', venta: '6.93' },
      { name: 'Banco Economico', compra: '6.82', venta: '6.92' },
      { name: 'Banco FIE', compra: '6.81', venta: '6.91' },
      { name: 'Banco Ganadero', compra: '6.80', venta: '6.90' },
      { name: 'Banco Mercantil Santa Cruz', compra: '6.79', venta: '6.89' },
      { name: 'Banco Sol', compra: '6.78', venta: '6.88' },
      { name: 'Banco Union', compra: '6.77', venta: '6.87' },
      { name: 'Banco Fortaleza', compra: '6.76', venta: '6.86' },
      { name: 'Banco Ecofuturo', compra: '6.75', venta: '6.85' },
    ];

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        // Incrementar el contador de visitas
        const visitCount = localStorage.getItem('visitCount');
        const newVisitCount = visitCount ? parseInt(visitCount) + 1 : 1;
        localStorage.setItem('visitCount', newVisitCount.toString());

        if (!hasVisited) {
            setIsModalOpen(true);
            localStorage.setItem('hasVisited', 'true');
        } else {
            setIsModalOpen(false);
        }
    }, []);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            const bcvData = { compra: 6.86, venta: 6.96 };
            const binanceData = { compra: 10.5, venta: 11.87 };
            setBcvInfo(`BCV: Compra ${bcvData.compra} - Venta ${bcvData.venta}`);
            setBinanceInfo(`Binance: Compra ${binanceData.compra} - Venta ${binanceData.venta} (Actualizado 30/11/24)`);
        };

        fetchExchangeRates();
    }, []);

    return (
       <div style={{ backgroundColor: colorFondoClaro, minHeight: '100vh'}}>
    <MainLayout title="TC Boletín" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
        <div className="flex flex-col items-center justify-center">
            {/* Sección Superior */}
            {/* Sección Inferior */}
            <div className="container flex flex-col lg:flex-row justify-center gap-6 mb-8">
                <motion.aside
                    className="rounded-lg p-6 text-white flex flex-col items-center justify-center shadow-lg lg:w-1/4"
                    style={{ backgroundColor: colorPrimario , boxShadow: '2px 35px 150px -1px rgba(0, 0, 0, 0.3)' }}
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaUsers className="text-4xl mb-3" />
                    <h2 className="text-xl font-semibold mb-4 text-center">Comunidad Exclusiva</h2>
                    <p className="text-sm text-gray-200 mb-4 leading-relaxed text-center">
                        Accede a contenido premium y análisis de expertos.
                    </p>
                    <Link href="#" className="inline-flex items-center bg-white text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-blue-100">
                        Únete <FaArrowRight className="ml-2" />
                    </Link>
                </motion.aside>

                <motion.section
                    className="flex flex-col gap-8 lg:w-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.article
                        className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow duration-300 flex items-start gap-4"
                        style={{ color: colorTextoPrincipal }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FaInfoCircle className="text-2xl text-blue-500" />
                        <div>
                            <h3 className="text-lg font-semibold mb-2" style={{ color: colorPrimario }}>
                                Especulación vs. Información
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Entiende la diferencia clave y toma decisiones informadas.
                            </p>
                            <Link
                                href="/infoSpeculation"
                                className="mt-2 text-blue-500 hover:underline font-semibold inline-flex items-center"
                            >
                                Leer más <FaArrowRight className="ml-1 text-sm" />
                            </Link>
                        </div>
                    </motion.article>

                    <motion.article
                        className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start gap-4"
                        style={{ color: colorTextoPrincipal }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <FaChartBar className="text-2xl text-green-500" />
                        <div>
                            <h3 className="text-lg font-semibold mb-2" style={{ color: colorPrimario }}>
                                Clave
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Descubre los indicadores que impactan tu economía diaria.
                            </p>
                            <Link
                                href="/economicVariables"
                                className="mt-2 text-blue-500 hover:underline font-semibold inline-flex items-center"
                            >
                                Explorar <FaArrowRight className="ml-1 text-sm" />
                            </Link>
                        </div>
                    </motion.article>

                    <motion.article
                        className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start gap-4"
                        style={{ color: colorTextoPrincipal }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <FaNewspaper className="text-2xl text-indigo-500" />
                        <div>
                            <h3 className="text-lg font-semibold mb-2" style={{ color: colorPrimario }}>
                                Noticias Económicas Relevantes
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Mantente al tanto de los acontecimientos económicos más importantes.
                            </p>
                            <Link href="/news" className="mt-2 text-blue-500 hover:underline font-semibold inline-flex items-center">
                                Ver Noticias <FaArrowRight className="ml-1 text-sm" />
                            </Link>
                        </div>
                    </motion.article>
                </motion.section>

                <motion.aside
                    className="rounded-lg p-6 text-white lg:w-1/4 flex flex-col items-center justify-center"
                    style={{ backgroundColor: colorPrimario , boxShadow: '2px 35px 150px -1px rgba(0, 0, 0, 0.3)' }}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaArrowRight className="text-4xl mb-3" />
                    <h2 className="text-xl font-semibold mb-4 text-center">¡SÉ PARTE!</h2>
                    <p className="text-sm text-gray-200 mb-4 leading-relaxed text-center">
                        Información transparente y actualizada al alcance de tu mano.
                    </p>
                    <Link href="#" className="inline-flex items-center bg-white text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-blue-100">
                        Explorar <FaArrowRight className="ml-2" />
                    </Link>
                </motion.aside>

                <motion.div
                    className="hidden h-14.5 lg:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </motion.div>
            </div>


            <motion.div
    className="container flex flex-col items-center justify-center mb-8" // ← Agrega mb-8 aquí
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
>
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-7xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {banks.map((bank, idx) => (
            <button
                key={bank.name}
                className="bg-[#001276] text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center transition-transform duration-200 hover:scale-105"
                onClick={() => { setSelectedBank(bank); setIsBankModalOpen(true); }}
            >
                <FaChartBar className="mr-2" /> {bank.name}
            </button>
        ))}
    </div>
    {/* Modal de banco */}
    {isBankModalOpen && selectedBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative animate-fade-in">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
                    onClick={() => setIsBankModalOpen(false)}
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4 text-blue-900 text-center">{selectedBank.name}</h2>
                <div className="flex flex-col gap-2 text-center">
                    <span className="text-lg text-gray-700">Compra: <span className="font-semibold text-green-600">{selectedBank.compra}</span></span>
                    <span className="text-lg text-gray-700">Venta: <span className="font-semibold text-red-600">{selectedBank.venta}</span></span>
                </div>
                <p className="mt-4 text-gray-500 text-sm text-center">Tipo de cambio simulado</p>
            </div>
        </div>
    )}
</motion.div>
            <motion.div
                className="container flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                >
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-7xl flex flex-col items-center justify-center">
                    {/* Simulación de gráfica */}
                    <div className="w-full max-w-md h-48 flex items-center justify-center mb-4">
                    <div className="w-full h-full bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 rounded-lg flex items-end relative overflow-hidden">
                        {/* Barras simuladas */}
                        <div className="absolute bottom-0 left-6 w-6 h-24 bg-blue-600 rounded-t"></div>
                        <div className="absolute bottom-0 left-20 w-6 h-32 bg-blue-400 rounded-t"></div>
                        <div className="absolute bottom-0 left-36 w-6 h-16 bg-blue-300 rounded-t"></div>
                        <div className="absolute bottom-0 left-52 w-6 h-40 bg-blue-500 rounded-t"></div>
                        <div className="absolute bottom-0 left-64 w-6 h-28 bg-blue-700 rounded-t"></div>
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-gray-500 text-sm font-semibold">Cargando gráfica...</span>
                    </div>
                    </div>
                    <p className="text-gray-500 text-center">Gráfica de ejemplo (simulada)</p>
                </div>
            </motion.div>
        </div>

        
    </MainLayout>
</div>
    );
}