import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Pagos() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Consulta el estado actual al cargar
  useEffect(() => {
    fetch('/payment/is-enabled')
      .then(res => res.json())
      .then(data => {
        setEnabled(data.enabled);
        setLoading(false);
      });
  }, []);

  // Cambia el estado
  const handleToggle = async () => {
  setSaving(true);
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  await fetch('/payment/set-enabled', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token || ''
    },
    body: JSON.stringify({ enabled: !enabled })
  })
    .then(res => res.json())
    .then(data => {
      setEnabled(data.enabled);
      setSaving(false);
    });
};

  return (
    <AppLayout breadcrumbs={[{ title: 'Pagos', href: '/pagos' }]}> 
      <Head title="Pagos" />
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4">Sección Pagos</h1>
          <p className="text-lg text-gray-600 mb-6">Esta sección está siendo construida 🚧</p>
          <div className="mb-4">
            {loading ? (
              <span className="text-gray-500">Cargando estado…</span>
            ) : (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Pagos {enabled ? 'habilitados' : 'deshabilitados'}
              </span>
            )}
          </div>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-white transition ${enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} disabled:opacity-50`}
            onClick={handleToggle}
            disabled={loading || saving}
          >
            {saving ? 'Guardando…' : enabled ? 'Deshabilitar pagos' : 'Habilitar pagos'}
          </button>
        </div>
          </div>
        </AppLayout>
      );
    }
