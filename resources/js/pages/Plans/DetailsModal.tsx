import { Dialog } from '@headlessui/react';
import { FiInfo, FiDollarSign, FiCalendar, FiFileText } from 'react-icons/fi';

interface Plan {
    id: number;
    name: string;
    description: string | null;
    price: number;
    formatted_price: string;
    duration_in_days: number;
    created_at: string;
    updated_at: string;
}

interface DetailsModalProps {
    plan: Plan;
    isOpen: boolean;
    onClose: () => void;
}
export default function DetailsModal({ plan, isOpen, onClose }: DetailsModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <Dialog.Title className="text-xl font-bold text-gray-900 border-b pb-2">
                    Información del Plan
                </Dialog.Title>
                
                {/* Sección de Datos Básicos */}
                <div className="mt-4 space-y-3">
                    <div className="flex items-start">
                        <FiInfo className="mt-1 mr-2 text-indigo-500" />
                        <div>
                            <p className="font-semibold">Nombre</p>
                            <p className="text-gray-600">{plan.name}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start">
                        <FiFileText className="mt-1 mr-2 text-indigo-500" />
                        <div>
                            <p className="font-semibold">Descripción</p>
                            <p className="text-gray-600">{plan.description || 'No especificado'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start">
                        <FiDollarSign className="mt-1 mr-2 text-indigo-500" />
                        <div>
                            <p className="font-semibold">Precio</p>
                            <p className="text-gray-600">{plan.formatted_price}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start">
                        <FiCalendar className="mt-1 mr-2 text-indigo-500" />
                        <div>
                            <p className="font-semibold">Duración</p>
                            <p className="text-gray-600">{plan.duration_in_days} días</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <FiInfo className="mr-2 text-indigo-500" />
                        Detalles del Plan
                    </h3>
                    <div className="mt-2 text-gray-600 space-y-2">
                        <p>• Aquí puedes incluir información adicional sobre el plan.</p>
                        <p>• Características especiales o condiciones.</p>
                        <p>• Estadísticas de uso o métricas relevantes.</p>
                        <p className="text-sm text-gray-400 mt-2">(Este contenido es de ejemplo)</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
}