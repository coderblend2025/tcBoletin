import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUsers, FaChartLine, FaGraduationCap, FaArrowRight, FaCheckCircle, FaRocket, FaLightbulb } from 'react-icons/fa';

interface Plan {
    id: number;
    name: string;
    conditions: string[];
}

export default function Work() {
    const { auth, plans } = usePage<SharedData & { plans: Plan[] }>().props;
  
    const [bcvInfo, setBcvInfo] = useState('');
    const [binanceInfo, setBinanceInfo] = useState('');

    const colorPrimario = '#001276'; // Azul Oscuro
    const colorFondoClaro = '#E8EBF3';

    useEffect(() => {
        const fetchExchangeRates = async () => {
            const bcvData = { compra: 6.86, venta: 6.96 };
            const binanceData = { compra: 13.16, venta: 11.97};
            setBcvInfo(`Banco Central de Bolivia: Compra ${bcvData.compra} - Venta ${bcvData.venta}`);
            setBinanceInfo(`Binance Bs/USDT: Compra ${binanceData.compra} - Venta ${binanceData.venta} (Actualizado a horas 08:00 a.m. - 30/11/2024)`);
        };

        fetchExchangeRates();
    }, []);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <MainLayout title="TC Boletín" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
                <Head title="Trabaja con nosotros" />
            
                <motion.section 
                    className="container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className="bg-white rounded-2xl shadow-xl p-8 lg:p-12"
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
                                    src="/pictures/trabajaconnosotros.png"
                                    alt="Únete al Equipo" 
                                    className="w-24 h-24 object-contain relative z-10"
                                    style={{ 
                                        display: 'block',
                                        opacity: 1,
                                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                                        transform: 'scale(1.2)'
                                    }}
                                />
                            </motion.div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-6">Únete a Nuestro Equipo</h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-8 rounded-full"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                                ¿Te apasiona la <span className="font-bold text-blue-800">economía</span>, la <span className="font-bold text-blue-800">tecnología</span> y la <span className="font-bold text-blue-800">comunicación</span>? En nuestra plataforma buscamos personas talentosas, creativas y comprometidas que quieran marcar la diferencia al brindar información confiable y transparente a la sociedad.
                            </p>
                        </div>

                        {/* Grid de Características */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="relative">
                                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FaRocket className="text-2xl text-blue-600" />
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                                        <h2 className="text-2xl font-bold text-blue-900 mb-4">¿Cómo aplicar?</h2>
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            Si estás interesado/a en formar parte de nuestro equipo, envíanos tu <strong>currículum</strong> y una breve <strong>carta de presentación</strong> a <span className="font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded">tcboletin@gmail.com</span>
                                        </p>
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            Cuéntanos sobre tu experiencia, tus habilidades y por qué quieres unirte a nuestro proyecto.
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <FaCheckCircle className="text-blue-600 mr-3" />
                                                <span className="text-gray-700">Trabajo remoto flexible</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaCheckCircle className="text-blue-600 mr-3" />
                                                <span className="text-gray-700">Crecimiento profesional acelerado</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaCheckCircle className="text-blue-600 mr-3" />
                                                <span className="text-gray-700">Equipo joven y dinámico</span>
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
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <FaUsers className="text-2xl text-green-600" />
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                                        <h2 className="text-2xl font-bold text-green-900 mb-4">Colaboraciones</h2>
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            ¿Eres <strong>consultor independiente</strong>, <strong>periodista económico</strong> o <strong>analista</strong>? También estamos abiertos a colaboraciones y alianzas estratégicas.
                                        </p>
                                        <p className="text-gray-700 leading-relaxed">
                                            Escríbenos a <span className="font-bold text-green-800 bg-green-50 px-2 py-1 rounded">tcboletin@gmail.com</span> para explorar posibilidades.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <div className="relative">
                                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FaLightbulb className="text-2xl text-blue-600" />
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Perfil que buscamos</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                                    <span className="text-blue-600 font-bold text-sm">1</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-blue-900">Pasión por las finanzas</h3>
                                                    <p className="text-gray-600 text-sm">Interés genuino en mercados y análisis económico</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                                    <span className="text-blue-600 font-bold text-sm">2</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-blue-900">Capacidad analítica</h3>
                                                    <p className="text-gray-600 text-sm">Habilidad para interpretar datos complejos</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                                    <span className="text-blue-600 font-bold text-sm">3</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-blue-900">Adaptabilidad</h3>
                                                    <p className="text-gray-600 text-sm">Flexibilidad en entorno dinámico y cambiante</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        {/* Sección de Beneficios */}
                        
                        {/* Sección de Planes */}
                        <motion.div 
                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaGraduationCap className="text-2xl text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-blue-900 mb-4">Planes de Membresía</h2>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Como parte del equipo, tendrás acceso a datos precisos y actualizados con distintos niveles según tu rol
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {plans.map((plan, index) => (
                                    <motion.div 
                                        key={plan.id} 
                                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                                    >
                                        <div className="text-center mb-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-blue-600 font-bold">{index + 1}</span>
                                            </div>
                                            <h3 className="font-bold text-xl text-blue-900 mb-2">{plan.name}</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            {plan.conditions.map((condition, condIndex) => (
                                                <li key={condIndex} className="flex items-start text-sm text-gray-600">
                                                    <FaCheckCircle className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
                                                    <span>{condition}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                       
                    </motion.div>
                </motion.section>
            </MainLayout>
        </div>
    );
}