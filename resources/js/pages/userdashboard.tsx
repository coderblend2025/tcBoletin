import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import GoogleMapWithUI from './GoogleMapWithUI';
import { Head } from '@inertiajs/react';
import AppInfoBar from '@/components/app-infobar';

export default function UserDashboard() {
  const [bcvInfo, setBcvInfo] = useState('');
  const [binanceInfo, setBinanceInfo] = useState('');
  const colorPrimario = "#1D4ED8"; // azul por ejemplo

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const bcvData = { compra: 6.86, venta: 6.96 };
      const binanceData = { compra: 13.16, venta: 11.97 };
      const today = new Date().toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setBcvInfo(`Banco Central de Bolivia: Venta Bs ${bcvData.venta} - Compra Bs ${bcvData.compra} (${today})`);
      setBinanceInfo(`Binance P2P Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado ${today} horas 08:00 a.m.)`);
    };
    fetchExchangeRates();
  }, []);

  return (
    <AppLayout breadcrumbs={[{ title: 'Mapa de Cambio', href: '/dashboard' }]}>
      <Head title="Dashboard" />
      <div className="flex-1 h-[80vh] relative">
        <GoogleMapWithUI />
      </div>
    </AppLayout>
  );
}
