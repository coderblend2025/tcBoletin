import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Pagos() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Pagos', href: '/pagos' }]}> 
      <Head title="Pagos" />
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4">Sección Pagos</h1>
          <p className="text-lg text-gray-600">Esta sección está siendo construida 🚧</p>
        </div>
      </div>
    </AppLayout>
  );
}
