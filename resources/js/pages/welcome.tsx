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

    const colorPrimario = '#001276'; // Azul Oscuro
    const colorFondoClaro = '#F4F6F8'; // A light, neutral background
    const colorTextoPrincipal = '#374151'; // Darker, more standard gray
    const colorTextoSecundario = '#6B7280'; // Slightly lighter secondary gray
    const colorAccent = '#3B82F6'; // A more vibrant, standard blue for links
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
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
                <div className="container mx-auto flex flex-col lg:flex-row gap-8">

              

                <motion.aside
                className="rounded-lg p-6 text-white lg:w-1/4 flex flex-col items-center justify-center shadow-lg"
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
                    {/* Main Content Section */}
                    <motion.section
                        className="flex flex-col gap-8 lg:w-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Feature Block 1 */}
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

                        {/* Feature Block 2 */}
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
                                    Variables Económicas Clave
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

                        {/* Feature Block 3 */}
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
            </MainLayout>
        </div>
    );
}