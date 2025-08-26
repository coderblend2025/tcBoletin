// pages/dashboard/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { DollarSign, Globe, Users, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import ExchangeRateChart from '@/components/charts/exchangeRateChart';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisWeek: 0,
    activeSellersToday: 0,
    totalPageViews: 0,
    uniqueVisitsToday: 0,
    totalExchangePoints: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    axios.get('/dashboard-stats')
      .then(res => setStats({
        totalUsers: res.data.total_users,
        newUsersThisWeek: res.data.new_users_this_week,
        activeSellersToday: res.data.active_sellers_today,
        totalPageViews: res.data.total_page_views,
        uniqueVisitsToday: res.data.unique_visits_today,
        totalExchangePoints: res.data.total_exchange_points
      }))
      .catch(console.error)
      .finally(() => setLoadingStats(false));
  }, []);

  if (loadingStats) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ title: 'Dasboard', href: '/dashboard' }]}>
      <Head title="Panel de Administración" />

       <div className="mb-8 flex items-center justify-between">
                    <div className="w-[100%] border border-gray-300 bg-white p-1">
                        <h4 style={{ fontSize: '12px' }} className="font-semibold text-gray-900 dark:text-gray-100">
                            Administración de Usuarios
                        </h4>
                        <hr></hr>
                        <span style={{ fontSize: '11px' }} className="text-gray-600">
                            Todos los usuarios del sistema aparecerán aquí
                        </span>
                    </div>
                </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-4 ">
        <StatCard icon={<Users />} title="Usuarios Registrados" value={stats.totalUsers.toLocaleString()} subtitle={`Nuevos esta semana: ${stats.newUsersThisWeek}`} />
        <StatCard icon={<DollarSign />} title="Consultores Activos" value={stats.activeSellersToday.toLocaleString()} subtitle="Activos hoy" />
        <StatCard icon={<BarChart3 />} title="Visitas Totales" value={`${stats.totalPageViews}`} subtitle={`Visitas únicas hoy: ${stats.uniqueVisitsToday}`} />
        <StatCard icon={<Globe />} title="Puntos de Cambio" value={stats.totalExchangePoints.toLocaleString()} subtitle="Registrados" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-center mb-4">Gráfica del Tipo de Cambio</h3>
          <ExchangeRateChart />
        </Card>
        <Card className="p-6">
          {/* Aquí puedes mantener la tabla de tipos de cambio externos */}
        </Card>
      </div>
    </AppLayout>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  buttonLink,
  buttonText
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  buttonLink?: string;
  buttonText?: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md p-5 transition-shadow hover:shadow-lg duration-200">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
          <div className="text-indigo-600 dark:text-indigo-300 h-6 w-6">{icon}</div>
        </div>
        <h3 className="text-md font-semibold text-gray-800 dark:text-white text-center">{title}</h3>
        <p className="text-3xl font-bold text-center text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{subtitle}</p>
      </div>

      {buttonLink && (
        <div className="mt-4 text-center">
          <a
            href={buttonLink}
            className="inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
          >
            {buttonText || 'Ver más'}
          </a>
        </div>
      )}
    </div>
  );
}
