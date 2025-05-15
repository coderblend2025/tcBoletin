import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Dialog } from '@headlessui/react';

interface DeletePlanProps {
    planId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function DeletePlan({ planId, isOpen, onClose }: DeletePlanProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleConfirmDelete = () => {
        setIsDeleting(true);
        router.delete(`/plans/${planId}`, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 1500); // Cierra automáticamente después de 1.5 segundos
            },
            onError: () => {
                alert('Error al eliminar el plan');
                setIsDeleting(false);
            },
        });
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl transition-all duration-300 transform scale-95 data-[enter=scale-100]">
                {!showSuccess ? (
                    <>
                        <Dialog.Title className="text-lg font-bold text-gray-900">
                            ¿Eliminar plan?
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-gray-600">
                            Esta acción no se puede deshacer. ¿Estás seguro?
                        </Dialog.Description>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded disabled:opacity-50"
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <Dialog.Title className="mt-3 text-lg font-bold text-gray-900">
                            ¡Plan eliminado!
                        </Dialog.Title>
                        <div className="mt-2 text-sm text-gray-500">
                            El plan se ha eliminado correctamente.
                        </div>
                    </div>
                )}
            </Dialog.Panel>
        </Dialog>
    );
}