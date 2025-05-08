import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AboutUs() {
    const { auth } = usePage<SharedData>().props;

    const [bcvInfo, setBcvInfo] = useState('');
    const [binanceInfo, setBinanceInfo] = useState('');

    useEffect(() => {
        const fetchExchangeRates = async () => {
            const bcvData = { compra: 6.86, venta: 6.96 };
            const binanceData = { compra: 10.50, venta: 11.87 };
            setBcvInfo(`Banco Central de Bolivia: Compra Bs ${bcvData.compra} - Venta Bs ${bcvData.venta}`);
            setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado a horas 08:00 a.m. - 30/11/2024)`);
        };

        fetchExchangeRates();
    }, []);

    return (
        <MainLayout title="TC Boletín - Acerca de Nosotros" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
            <Head title="Acerca de Nosotros" />

            <motion.section 
                className="container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div 
                    className="bg-white rounded-2xl shadow-md p-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-extrabold text-blue-900 mb-6">¿Quiénes Somos?</h1>

                    <p className="text-gray-700 mb-4">
                        En <span className="font-semibold text-blue-800">TC Boletín</span>, somos una plataforma digital que brinda información clara, confiable y actualizada sobre el <strong>tipo de cambio del dólar estadounidense</strong> y su comportamiento frente al <strong>boliviano (BOB)</strong>.
                    </p>

                    <p className="text-gray-700 mb-4">
                        Nuestra misión es ayudarte a tomar mejores decisiones financieras, ya seas un ciudadano común, un comerciante, un inversionista o un viajero. Nos basamos en fuentes oficiales como el <strong>Banco Central de Bolivia (BCB)</strong> y plataformas de intercambio como <strong>Binance</strong> para entregarte datos en tiempo real.
                    </p>

                    <p className="text-gray-700 mb-4">
                        Sabemos que en tiempos de incertidumbre económica, la información es poder. Por eso, TC Boletín se compromete a mantenerte informado con noticias relevantes, análisis de mercado, y tasas de cambio verificadas.
                    </p>

                    <motion.div 
                        className="mt-8 border-l-4 border-blue-700 p-4 rounded-md"  
                        style={{ backgroundColor: '#EBFFF2' }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-xl font-bold text-blue-900 mb-2">¿Qué ofrecemos?</h2>
                        <ul className="list-disc list-inside text-gray-700">
                            <li>Tasas oficiales de cambio (BCB)</li>
                            <li>Valores en plataformas como Binance (USDT)</li>
                            <li>Actualizaciones diarias y horarios de publicación</li>
                            <li>Diseño accesible desde dispositivos móviles</li>
                            <li>Una experiencia rápida, segura y sin publicidad invasiva</li>
                        </ul>
                    </motion.div>

                    <p className="mt-8 text-gray-700">
                        Gracias por confiar en nosotros. Seguiremos trabajando para ser tu aliado financiero digital en Bolivia.
                    </p>
                </motion.div>
            </motion.section>
        </MainLayout>
    );
}
