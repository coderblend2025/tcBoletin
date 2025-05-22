import { Dialog } from '@headlessui/react';
import { FiInfo, FiDollarSign, FiCalendar, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface Plan {
    id: number;
    name: string;
    description: string | null;
    price: number;
    formatted_price: string;
    duration_in_days: number;
    created_at: string;
    updated_at: string;
    conditions?: string[];
}

interface DetailsModalProps {
    plan: Plan;
    isOpen: boolean;
    onClose: () => void;
    onConditionsUpdated?: (newConditions: string[]) => void;
}

export default function DetailsModal({ 
    plan, 
    isOpen, 
    onClose,
    onConditionsUpdated 
}: DetailsModalProps) {
    const [currentPlan, setCurrentPlan] = useState<Plan>(plan);
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

    // Sincronizar con los cambios externos
    useEffect(() => {
        setCurrentPlan(plan);
    }, [plan, isOpen]);

    // Mostrar feedback cuando se actualizan condiciones
    useEffect(() => {
        if (onConditionsUpdated) {
            setShowUpdateSuccess(true);
            const timer = setTimeout(() => setShowUpdateSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [currentPlan.conditions]);

    const hasConditions = currentPlan.conditions && 
                        currentPlan.conditions.length > 0 && 
                        currentPlan.conditions.some(c => c.trim() !== '');

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <div className="flex justify-between items-center border-b pb-2">
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                        Información del Plan
                    </Dialog.Title>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Cerrar"
                    >
                        <FiInfo size={20} />
                    </button>
                </div>

                {/* Sección de Datos Básicos */}
                <div className="mt-4 space-y-4">
                    <div className="flex items-start gap-3">
                        <FiInfo className="mt-1 flex-shrink-0 text-indigo-500" />
                        <div>
                            <p className="font-semibold text-sm text-gray-500">Nombre</p>
                            <p className="text-gray-800">{currentPlan.name}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <FiFileText className="mt-1 flex-shrink-0 text-indigo-500" />
                        <div>
                            <p className="font-semibold text-sm text-gray-500">Descripción</p>
                            <p className="text-gray-800">{currentPlan.description || 'No especificado'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <FiDollarSign className="mt-1 flex-shrink-0 text-indigo-500" />
                        <div>
                            <p className="font-semibold text-sm text-gray-500">Precio</p>
                            <p className="text-gray-800">{currentPlan.formatted_price}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <FiCalendar className="mt-1 flex-shrink-0 text-indigo-500" />
                        <div>
                            <p className="font-semibold text-sm text-gray-500">Duración</p>
                            <p className="text-gray-800">
                                {currentPlan.duration_in_days} días
                                {currentPlan.duration_in_days >= 30 && (
                                    <span className="text-gray-500 ml-2">
                                        (≈ {Math.round(currentPlan.duration_in_days/30)} meses)
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Sección de Condiciones con feedback de actualización */}
                <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <FiInfo className="text-indigo-500" />
                            <h3 className="text-lg font-bold text-gray-900">
                                Condiciones del Plan
                            </h3>
                        </div>
                        {showUpdateSuccess && (
                            <span className="flex items-center text-sm text-green-600">
                                <FiCheckCircle className="mr-1" />
                                Actualizado
                            </span>
                        )}
                    </div>
                    
                    {hasConditions ? (
                        <ul className="space-y-2 pl-6 list-disc text-gray-700">
                            {currentPlan.conditions
                                ?.filter(cond => cond.trim() !== '')
                                .map((condition, index) => (
                                    <li key={index} className="py-1">
                                        {condition}
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-gray-500 italic">
                                Este plan no tiene condiciones especificadas
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Cerrar
                    </button>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
}