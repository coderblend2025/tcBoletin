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
            const binanceData = { compra: 14.02, venta: 14.02 };
            const today = new Date().toLocaleDateString('es-BO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            setBcvInfo(`Banco Central de Bolivia: Venta Bs ${bcvData.compra} - Compra Bs ${bcvData.venta} (${today})`);
            setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado a horas 08:00 a.m. - ${today})`);
        };

        fetchExchangeRates();
    }, []);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <MainLayout title="TC Boletín - Acerca de Nosotros" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
                <Head title="Acerca de Nosotros" />

                <motion.section 
                    className="container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Hero Section */}
                        <div className="text-center mb-16">
                            <motion.div
                                className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <img 
                                    src="/pictures/cumunidadexclusiva.png"
                                    alt="Sobre Nosotros" 
                                    className="w-24 h-24 object-contain relative z-10"
                                    style={{ 
                                        display: 'block',
                                        opacity: 1,
                                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                                        transform: 'scale(1.2)'
                                    }}
                                />
                            </motion.div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-6">Sobre Nosotros</h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-8 rounded-full"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                                En <span className="font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded">tcboletin.com</span> creemos que la información clara y actualizada puede marcar la diferencia en tu día a día.
                            </p>
                        </div>

                        {/* Grid de Características */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-1">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="relative">
                                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl text-blue-600">🎯</span>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Nuestro Objetivo</h2>
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            Comenzamos este proyecto con un objetivo simple: <strong>Mostrar el tipo de cambio que se mueve en las calles y zonas claves de la ciudad</strong>, actualizado cada día y de forma accesible para todos.
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                                <span className="text-gray-700">Información clara y confiable</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                                <span className="text-gray-700">Actualizaciones diarias</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                                <span className="text-gray-700">Acceso para todos</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <div className="relative">
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl text-blue-600">📈</span>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                                        <h2 className="text-2xl font-bold text-blue-900 mb-4">¿Por qué es importante?</h2>
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            Sabemos que en la coyuntura actual el tipo de cambio afecta tus decisiones diarias:
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                                    <span className="text-blue-600 font-bold text-sm">1</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-blue-900">Cambiar dinero</h3>
                                                    <p className="text-gray-600 text-sm">Obtén las mejores tasas del mercado</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                                    <span className="text-blue-600 font-bold text-sm">2</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-blue-900">Comprar productos</h3>
                                                    <p className="text-gray-600 text-sm">Planifica tus compras con información real</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                                    <span className="text-blue-600 font-bold text-sm">3</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-blue-900">Planificar un viaje</h3>
                                                    <p className="text-gray-600 text-sm">Presupuesta con datos actualizados</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Compromiso Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex items-center justify-center" // Añadido para centrado
                        >
                            <div className="relative">
                                <div className="bg-gradient-to-br rounded-2xl p-8 bg-transparent">
                                    <h2 className="text-1xl font-bold text-gray-700 mb-4 text-center">Con tu apoyo iremos sumando otras variables importantes que actualmente afectan tu día a día.</h2>
                                </div>
                            </div>
                        </motion.div>

                        {/* Propósito Section */}
                        <motion.div 
                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-white">💡</span>
                                </div>
                                <h2 className="text-3xl font-bold text-blue-900 mb-4">Nuestro Propósito</h2>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Lo que nos motiva cada día a seguir mejorando
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <motion.div 
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.8 }}
                                >
                                    <div className="text-center mb-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-blue-600 font-bold">📚</span>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-900 mb-2">Educar</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm text-center">Brindamos conocimiento claro sobre el mercado cambiario</p>
                                </motion.div>

                                <motion.div 
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.9 }}
                                >
                                    <div className="text-center mb-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-blue-600 font-bold">📢</span>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-900 mb-2">Informar</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm text-center">Mantenemos actualizada la información financiera relevante</p>
                                </motion.div>

                                <motion.div 
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 1.0 }}
                                >
                                    <div className="text-center mb-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-blue-600 font-bold">🤝</span>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-900 mb-2">Acompañar</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm text-center">Te ayudamos a tomar mejores decisiones económicas</p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Call to Action */}
                        <motion.div 
                            className="text-center mt-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                                <h3 className="text-2xl font-bold text-blue-900 mb-4">¡Gracias por ser parte!</h3>
                                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                    Gracias por ser parte de esta <strong className="text-blue-700">comunidad</strong> que valora la <strong className="text-blue-700">transparencia</strong>, la <strong className="text-blue-700">información</strong> y la <strong className="text-blue-700">confianza</strong>.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.section>
            </MainLayout>
        </div>
    );
}
