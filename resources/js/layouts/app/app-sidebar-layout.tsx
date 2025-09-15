import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AppInfoBar from '@/components/app-infobar'; // <-- IMPORTA ESTO
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState, type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  const [bcvInfo, setBcvInfo] = useState('');
  const [binanceInfo, setBinanceInfo] = useState('');
  const colorPrimario = '#1D4ED8';

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const bcvData = { compra: 6.86, venta: 6.96 };
      const binanceData = { compra: 13.16, venta: 11.97 };
      const today = new Date().toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      setBcvInfo(
        `Banco Central de Bolivia: Venta Bs ${bcvData.venta} - Compra Bs ${bcvData.compra} (${today})`
      );
      setBinanceInfo(
        `Binance P2P Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado ${today} horas 08:00 a.m.)`
      );
    };
    fetchExchangeRates();
  }, []);

  return (
    
    <AppShell variant="sidebar">
      <AppInfoBar bcvInfo={bcvInfo} binanceInfo={binanceInfo} colorPrimario={colorPrimario} />
      <div style={{ backgroundColor: '#001276' }} className="flex flex-col w-full min-h-screen">
        <AppSidebar />
        <main className="flex-1">
          {/* Muestra la barra de info dentro del layout */}
          <div style={{ backgroundColor: '#001276' }} className="mx-auto w-full max-w">
            <AppSidebarHeader breadcrumbs={breadcrumbs} />
            {children}
          </div>
        </main>
      </div>
    </AppShell>
  );
}
