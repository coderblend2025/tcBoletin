import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormEvent, useState } from 'react';

export default function PlanCreate() {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        duration_in_days: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.post('/plans', form);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Planes', href: '/plans' }, { title: 'Crear Plan', href: '/plans/create' }]}>
            <Head title="Crear Plan" />
            <div className="w-full max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6 w-full mx-auto">
                    <h1 className="text-2xl font-bold mb-6 cursor-pointer">Crear Nuevo Plan</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duración (días)</label>
                            <input
                                type="number"
                                value={form.duration_in_days}
                                onChange={(e) => setForm({ ...form, duration_in_days: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}