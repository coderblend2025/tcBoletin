import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormEvent, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

interface Plan {
    id: number;
    name: string;
    description: string | null;
    price: number;
    duration_in_days: number;
    is_active?: boolean;
}

interface PageProps {
    plan: Plan;
    errors: Partial<Record<keyof Plan, string>>;
    flash?: {
        success?: string;
        error?: string;
    };[key: string]: any;
}

export default function PlanEdit({ plan }: PageProps) {
    const { errors, flash } = usePage<PageProps>().props;
    const [form, setForm] = useState({
        name: plan.name,
        description: plan.description || '',
        price: plan.price.toString(),
        duration_in_days: plan.duration_in_days.toString(),
        is_active: plan.is_active ?? true
    });

    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        
        router.put(`/plans/${plan.id}`, {
            ...form,
            price: parseFloat(form.price),
            duration_in_days: parseInt(form.duration_in_days),
        }, {
            onSuccess: () => {
                router.visit('/plans', {
                    onFinish: () => {
                        setProcessing(false);
                    }
                });
            },
            onError: () => {
                setProcessing(false);
            }
        });
    };

    // Mostrar mensajes flash
    useEffect(() => {
        if (flash?.success) {
            alert(flash.success);
        }
        if (flash?.error) {
            alert(flash.error);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Planes', href: '/plans' }, 
            { title: 'Editar Plan', href: `/plans/${plan.id}/edit` }
        ]}>
            <Head title="Editar Plan" />
            <div className="w-full max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6 w-full mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Editar Plan: {plan.name}</h1>
                    
                    {flash?.success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                            {flash.success}
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Descripción
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                rows={3}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Precio *
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className={`block w-full pl-7 pr-12 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                                        errors.price ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Duración (días) *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={form.duration_in_days}
                                onChange={(e) => setForm({ ...form, duration_in_days: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                                    errors.duration_in_days ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.duration_in_days && (
                                <p className="mt-1 text-sm text-red-600">{errors.duration_in_days}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                                Plan activo
                            </label>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                    processing ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                            >
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <Link
                                href="/plans"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}