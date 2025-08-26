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

            
            <div className="w-full max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8"> {/* Increased py-12 for more vertical space, centered content */}
                <div className="bg-white shadow-2xl rounded-xl p-10 w-full mx-auto"> {/* Increased p-10 and shadow-2xl for deeper, more modern look, rounded-xl for softer corners */}
                    <h1 className="text-4xl font-extrabold mb-10 text-gray-800 text-center">Crear Nuevo Plan</h1> {/* Larger, bolder, and centered title with more margin */}
                    <form onSubmit={handleSubmit} className="space-y-8"> {/* Increased space-y-8 for more vertical spacing between fields */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Plan</label> {/* Bolder label, slightly more margin-bottom */}
                            <input
                                id="name"
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75 transition duration-200 ease-in-out placeholder-gray-400 text-gray-900 px-4 py-2.5" // Adjusted focus ring, transition, added placeholder color and text color, increased padding (py-2.5)
                                placeholder="Ej: Plan Premium, Plan Básico"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Descripción del Plan</label>
                            <textarea
                                id="description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                               // Slightly increased initial height for textarea
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75 transition duration-200 ease-in-out placeholder-gray-400 text-gray-900 px-4 py-2.5" // Adjusted focus ring, transition, added placeholder color and text color, increased padding (py-2.5)
                                placeholder="Detalles sobre lo que incluye este plan, características, etc."
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">Precio (Bs)</label>
                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75 transition duration-200 ease-in-out placeholder-gray-400 text-gray-900 px-4 py-2.5"
                                placeholder="Ej: 99.99"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">Duración (en días)</label>
                            <input
                                id="duration"
                                type="number"
                                value={form.duration_in_days}
                                onChange={(e) => setForm({ ...form, duration_in_days: e.target.value })}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75 transition duration-200 ease-in-out placeholder-gray-400 text-gray-900 px-4 py-2.5"
                                placeholder="Ej: 30, 365"
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105" // Larger button, more padding, bolder text, stronger shadow on hover, scale effect
                            >
                                Guardar Plan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}