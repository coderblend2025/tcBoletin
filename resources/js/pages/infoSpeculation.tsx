import MainLayout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaBookOpen, FaCheckCircle, FaInfoCircle, FaShieldAlt, FaTimesCircle, FaTrophy } from 'react-icons/fa';

const Work = () => {
    const { auth } = usePage<SharedData>().props;

    const [bcvInfo, setBcvInfo] = useState<string>('');
    const [binanceInfo, setBinanceInfo] = useState<string>('');

    useEffect(() => {
        const fetchExchangeRates = () => {
            const bcvData = { compra: 6.86, venta: 6.96 };
            const binanceData = { compra: 10.5, venta: 11.87 };
            const fecha = new Date().toLocaleDateString('es-BO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            setBcvInfo(`Banco Central de Bolivia: Compra Bs ${bcvData.compra} - Venta Bs ${bcvData.venta}`);
            setBinanceInfo(
                `Binance Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado a horas 08:00 a.m. - ${fecha})`,
            );
        };

        fetchExchangeRates();
    }, []);

    return (
        <MainLayout title="Diferencia entre Especulación e Información" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
            <Head title="Diferencia entre Especulación e Información" />

            <motion.div className="container mx-auto px-4 py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <motion.div
                    className="rounded-2xl bg-white p-6 shadow-lg md:p-10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="mb-8 text-center text-3xl font-bold text-blue-900">Diferencia entre Especulación e Información</h1>

                    <section className="mb-10">
                        <h2 className="mb-4 text-2xl font-semibold text-blue-800">Especulación</h2>
                        <p className="mb-4 text-gray-700 text-justify">
                            <FaInfoCircle className="mr-2 inline text-blue-600" />
                            <strong>Propósito:</strong> El objetivo principal de la especulación es obtener ganancias a partir de las fluctuaciones en
                            el precio de un activo, bien o divisa. Se basa en anticipar movimientos de precios futuros y tomar decisiones para
                            aprovechar esos cambios, generalmente en un horizonte temporal corto o mediano.
                        </p>
                        <p className="mb-4 text-gray-700 text-justify">
                            <FaCheckCircle className="mr-2 inline text-green-600" />
                            <strong>Acción:</strong> Implica la compra o venta activa de activos con el fin de beneficiarse de los cambios en su
                            valor. Los especuladores asumen riesgos significativos, ya que los precios pueden moverse en direcciones inesperadas,
                            resultando en posibles pérdidas.
                        </p>
                        <p className="text-gray-700 text-justify">
                            <FaBookOpen className="mr-2 inline text-purple-600" />
                            <strong>Ejemplo:</strong> Comprar acciones de una empresa con la expectativa de que su precio aumentará rápidamente, para
                            luego venderlas a un precio más alto.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4 text-2xl font-semibold text-blue-800">Información</h2>
                        <p className="mb-4 text-gray-700 text-justify">
                            <FaInfoCircle className="mr-2 inline text-blue-600" />
                            <strong>Propósito:</strong> La información tiene como objetivo proporcionar datos, hechos o análisis de manera objetiva,
                            sin buscar influir directamente en el mercado o en las decisiones de compra o venta de activos.
                        </p>
                        <p className="mb-4 text-gray-700 text-justify">
                            <FaTimesCircle className="mr-2 inline text-red-600" />
                            <strong>Acción:</strong> No implica la realización de transacciones o la toma de decisiones basadas en expectativas de
                            cambios en el precio. Puede incluir noticias, análisis, datos estadísticos, y su propósito es educar, informar o
                            proporcionar contexto.
                        </p>
                        <p className="text-gray-700 text-justify">
                            <FaBookOpen className="mr-2 inline text-purple-600" />
                            <strong>Ejemplo:</strong> Publicar un informe sobre el estado actual del mercado de divisas, detallando las tasas de
                            cambio, sin sugerir acciones específicas como comprar o vender.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4 text-2xl font-semibold text-blue-800">Resumen de las diferencias</h2>
                        <p className="mb-4 text-gray-700 text-justify">
                            <FaCheckCircle className="mr-2 inline text-green-600" />
                            <strong>Especulación:</strong> Es una acción orientada a obtener ganancias mediante la anticipación y explotación de
                            cambios en los precios de mercado. Implica un nivel de riesgo alto y busca resultados financieros.
                        </p>
                        <p className="text-gray-700 text-justify">
                            <FaInfoCircle className="mr-2 inline text-blue-600" />
                            <strong>Información:</strong> Es la provisión de datos o análisis con el objetivo de educar o informar. No busca influir
                            en las decisiones de mercado directamente, sino ofrecer una base objetiva sobre la cual los usuarios puedan tomar sus
                            propias decisiones.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4 text-2xl font-semibold text-blue-800">En el contexto de esta página web</h2>
                        <p className="text-gray-700 text-justify">
                            <FaInfoCircle className="mr-2 inline text-blue-600" />
                            Se enfoca en proporcionar <strong>información</strong>. Esto significa que nuestro objetivo es ofrecer a los usuarios
                            datos confiables y transparentes sobre variables económicas, para que puedan tomar decisiones informadas, sin incentivar
                            la especulación. Al centrarse en la información y no en la especulación, la página ayuda a educar y guiar a los usuarios
                            en un entorno económico complejo, promoviendo la transparencia y la responsabilidad.
                        </p>
                    </section>

                    <section className="mt-10 rounded-2xl p-6" style={{ backgroundColor: '#EBFFF2' }}>
                        <h2 className="mb-4 text-center text-2xl font-bold text-blue-900">¿Qué nos diferencia de los demás?</h2>
                        <p className="mb-6 text-center text-gray-700">Somos la mejor y más segura plataforma de pronósticos deportivos.</p>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center text-blue-900 shadow-md">
                                <FaShieldAlt className="mb-4 text-4xl text-blue-700" />
                                <h3 className="mb-2 text-lg font-bold">Somos de Confianza</h3>
                                <p className="text-sm text-gray-600">
                                    Transparencia, seguridad y trayectoria nos avalan como una plataforma confiable en el mercado.
                                </p>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center text-blue-900 shadow-md">
                                <FaCheckCircle className="mb-4 text-4xl text-green-600" />
                                <h3 className="mb-2 text-lg font-bold">Somos los Mejores</h3>
                                <p className="text-sm text-gray-600">
                                    Contamos con un equipo experto y análisis precisos que nos posicionan como líderes.
                                </p>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center text-blue-900 shadow-md">
                                <FaTrophy className="mb-4 text-4xl text-yellow-500" />
                                <h3 className="mb-2 text-lg font-bold">Entrega de Recompensas</h3>
                                <p className="text-sm text-gray-600">
                                    Reconocemos tu fidelidad con premios constantes y beneficios exclusivos para nuestros usuarios.
                                </p>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </motion.div>
        </MainLayout>
    );
};

export default Work;
