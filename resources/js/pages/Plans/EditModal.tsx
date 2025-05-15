import { Dialog } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import { FiX, FiDollarSign, FiCalendar, FiInfo, FiFileText, FiCheckCircle, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_in_days: number;
    is_active?: boolean;
    formatted_price?: string;
}

interface EditModalProps {
    plan: Plan;
    isOpen: boolean;
    onClose: () => void;
    errors?: Partial<Record<keyof Plan, string>>;
}

export default function EditModal({ plan, isOpen, onClose, errors }: EditModalProps) {
    // Estado del formulario con valores iniciales del plan
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        duration_in_days: '',
        is_active: true
    });

    const [processing, setProcessing] = useState(false);

    // Actualizar el estado cuando cambia el plan
    useEffect(() => {
        if (plan) {
            setForm({
                name: plan.name,
                description: plan.description || '',
                price: plan.price.toString(),
                duration_in_days: plan.duration_in_days.toString(),
                is_active: plan.is_active ?? true
            });
        }
    }, [plan]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        
        router.put(`/plans/${plan.id}`, {
            ...form,
            price: parseFloat(form.price),
            duration_in_days: parseInt(form.duration_in_days),
        }, {
            onSuccess: () => {
                setTimeout(onClose, 500);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl transition-all duration-300">
                {/* Encabezado */}
                <div className="flex justify-between items-start">
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                        Editar Plan: {plan.name}
                    </Dialog.Title>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Cerrar"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Campo Nombre */}
                    <div className="space-y-1">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FiInfo className="mr-2 text-indigo-500" />
                            Nombre *
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                errors?.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors?.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Campo Descripción */}
                    <div className="space-y-1">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FiFileText className="mr-2 text-indigo-500" />
                            Descripción
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                errors?.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors?.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {/* Campo Precio */}
                    <div className="space-y-1">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FiDollarSign className="mr-2 text-indigo-500" />
                            Precio *
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">$</span>
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className={`block w-full pl-7 pr-12 rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                    errors?.price ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                        </div>
                        {errors?.price && (
                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                        )}
                    </div>

                    {/* Campo Duración */}
                    <div className="space-y-1">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FiCalendar className="mr-2 text-indigo-500" />
                            Duración (días) *
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={form.duration_in_days}
                            onChange={(e) => setForm({ ...form, duration_in_days: e.target.value })}
                            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                errors?.duration_in_days ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors?.duration_in_days && (
                            <p className="mt-1 text-sm text-red-600">{errors.duration_in_days}</p>
                        )}
                    </div>

                    {/* Campo Estado */}
                    <div className="flex items-center pt-2">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, is_active: !form.is_active })}
                            className="relative inline-flex items-center mr-2"
                        >
                            {form.is_active ? (
                                <FiToggleRight className="h-6 w-6 text-indigo-600" />
                            ) : (
                                <FiToggleLeft className="h-6 w-6 text-gray-400" />
                            )}
                        </button>
                        <label className="block text-sm text-gray-700">
                            {form.is_active ? 'Activo' : 'Inactivo'}
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                processing ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle className="-ml-1 mr-2" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Dialog.Panel>
        </Dialog>
    );
}