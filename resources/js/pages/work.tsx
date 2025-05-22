import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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
            const binanceData = { compra: 10.50, venta: 11.87 };
            setBcvInfo(`Banco Central de Bolivia: Compra ${bcvData.compra} - Venta ${bcvData.venta}`);
            setBinanceInfo(`Binance Bs/USDT: Compra ${binanceData.compra} - Venta ${binanceData.venta} (Actualizado a horas 08:00 a.m. - 30/11/2024)`);
        };

        fetchExchangeRates();
    }, []);

    return (
        <MainLayout title="TC Boletín" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
            <Head title="Trabaja con nosotros" />
        
            <section className="container">
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <h1 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">Únete a Nuestro Equipo</h1>
                    <p className="text-gray-700 text-center mb-4">
                        En <strong>TC Boletín</strong> buscamos personas apasionadas por la economía, las finanzas y el análisis de datos. Si te entusiasma el mundo del mercado cambiario y quieres formar parte de un proyecto innovador, ¡te estamos buscando!
                    </p>
                    <p className="text-gray-700 text-center mb-8">
                        Envíanos tu <strong>currículum vitae</strong> junto con una <strong>carta de presentación</strong> explicando tu motivación y experiencia. Valoramos el compromiso, la curiosidad intelectual y la capacidad de adaptarse a un entorno dinámico.
                    </p>
        
                    <div className="bg-blue-50 rounded-xl p-6 mb-10">
                        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">¿Qué Ofrecemos?</h2>
                        <ul className="text-gray-700 space-y-4 list-disc list-inside">
                            <li>Acceso a información del mercado en tiempo real sobre el dólar y otros indicadores financieros relevantes en Bolivia.</li>
                            <li>Plataforma digital con herramientas de análisis, predicciones y visualización de datos.</li>
                            <li>Oportunidades de crecimiento profesional dentro de un equipo multidisciplinario.</li>
                            <li>Un entorno colaborativo, ágil y orientado a resultados.</li>
                        </ul>
                    </div>
        
                    <div className="rounded-xl p-6" style={{ backgroundColor: '#EBFFF2' }}>
                        <h2 className="text-xl font-semibold text-center mb-4">Planes de Membresía</h2>
                        <p className="text-center mb-6">Tendrás acceso a datos precisos y actualizados con distintos niveles de acceso según el plan que elijas.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {plans.map((plan) => (
                                <div key={plan.id} className="bg-white text-blue-900 rounded-lg p-4 shadow">
                                    <h3 className="font-bold text-xl mb-2 text-center">{plan.name}</h3>
                                    <ul className="text-sm space-y-2">
                                        {plan.conditions.map((condition, index) => (
                                            <li key={index}>{condition}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}