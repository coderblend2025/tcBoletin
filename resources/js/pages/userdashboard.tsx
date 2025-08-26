import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import GoogleMapWithUI from './GoogleMapWithUI';
import { Head } from '@inertiajs/react';

export default function UserDashboard() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Mapa de Cambio', href: '/dashboard' }]}>
         <Head title="Dashboard" />
      <div className="flex-1 h-[80vh] relative">
        <GoogleMapWithUI />
      </div>
    </AppLayout>
  );
}
