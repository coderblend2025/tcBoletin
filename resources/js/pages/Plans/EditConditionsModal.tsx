import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

interface Plan {
    id: number;
    name: string;
    conditions?: string[];
}

interface EditConditionsModalProps {
    plan: Plan;
    isOpen: boolean;
    onClose: () => void;
    onSave: (conditions: string[]) => Promise<void> | void;
}

export default function EditConditionsModal({ 
    plan, 
    isOpen, 
    onClose, 
    onSave 
}: EditConditionsModalProps) {
    const [conditions, setConditions] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            setConditions(plan.conditions?.length ? [...plan.conditions] : ['']);
            setError('');
        }
    }, [isOpen, plan]);

    const handleAddCondition = () => {
        setConditions([...conditions, '']);
    };

    const handleRemoveCondition = (index: number) => {
        if (conditions.length > 1) {
            const newConditions = [...conditions];
            newConditions.splice(index, 1);
            setConditions(newConditions);
        }
    };

    const handleConditionChange = (index: number, value: string) => {
        const newConditions = [...conditions];
        newConditions[index] = value;
        setConditions(newConditions);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError('');
            
            const validConditions = conditions
                .map(cond => cond.trim())
                .filter(cond => cond !== '');
            
            if (validConditions.length === 0) {
                setError('Debe agregar al menos una condición válida');
                return;
            }

            await onSave(validConditions);
            onClose();
        } catch (err) {
            setError('Error al guardar las condiciones');
            console.error('Error saving conditions:', err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                        Editar Condiciones - {plan.name}
                    </Dialog.Title>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Cerrar"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md">
                            {error}
                        </div>
                    )}

                    <p className="text-sm text-gray-600">Agrega o edita las condiciones del plan:</p>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {conditions.map((condition, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={condition}
                                    onChange={(e) => handleConditionChange(index, e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={`Condición ${index + 1}`}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCondition(index)}
                                    className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                                    disabled={isSubmitting || conditions.length <= 1}
                                    aria-label="Eliminar condición"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddCondition}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        <FiPlus /> Agregar otra condición
                    </button>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            'Guardando...'
                        ) : (
                            <>
                                <FiSave />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
}