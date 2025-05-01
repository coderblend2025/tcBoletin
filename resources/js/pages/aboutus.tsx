import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react'

import { type PropsWithChildren } from 'react';

export default function AboutUs() {
    const { auth } = usePage<SharedData>().props;
  
    const [bcvInfo, setBcvInfo] = useState('');
    const [binanceInfo, setBinanceInfo] = useState('');

    const colorPrimario = '#001276'; // Azul Oscuro
    const colorFondoClaro = '#E8EBF3'; // Una tonalidad muy clara del azul oscuro

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
            <Head title="Acerca de Nosotros" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Acerca de Nosotros</h1>
                <p className="mb-4">Bienvenido a TC Boletín, tu fuente confiable de información económica y financiera.</p>
                <p className="mb-4">Nuestro objetivo es brindarte datos precisos y actualizados sobre el mercado cambiario y las variables económicas que impactan tu vida diaria.</p>
                <p className="mb-4">Contamos con un equipo de expertos en economía y finanzas que trabajan arduamente para ofrecerte contenido relevante y útil.</p>
            </div>
        </MainLayout>
    );
}