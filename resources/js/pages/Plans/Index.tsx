import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    formatted_price: string;
    duration_in_days: number;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    plans: Plan[];
    can: {
        edit: boolean;
        delete: boolean;
    };
    [key: string]: any;
}

export default function PlansIndex({ plans, can }: PageProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este plan?')) {
            router.delete(`/plans/${id}`, {
                onSuccess: () => {
                    alert('Plan eliminado correctamente.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Planes', href: '/plans' }]}>
            <Head title="Planes" />
            <div className="w-full max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6 w-full mx-auto">
                    <div className="mb-4">
                        {can.edit && (
                            <Link
                                href="/plans/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Crear Nuevo Plan
                            </Link>
                        )}
                    </div>
                    <PlansTable
                        plans={plans}
                        canEdit={can.edit}
                        canDelete={can.delete}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function PlansTable({
    plans,
    canEdit,
    canDelete,
    openMenuId,
    setOpenMenuId,
    onDelete,
}: {
    plans: Plan[];
    canEdit: boolean;
    canDelete: boolean;
    openMenuId: number | null;
    setOpenMenuId: React.Dispatch<React.SetStateAction<number | null>>;
    onDelete: (id: number) => void;
}) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="mx-auto w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-md shadow-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración (días)</th>
                        {(canEdit || canDelete) && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {plans.length > 0 ? (
                        plans.map((plan) => (
                            <tr key={plan.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {plan.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {plan.description || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {plan.formatted_price}
                                </td>
                                <td className="px-12 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {plan.duration_in_days} días
                                </td>
                                {(canEdit || canDelete) && (
                                    <td className="px-7 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative" ref={menuRef}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === plan.id ? null : plan.id);
                                                }}
                                                className="px-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                                            >
                                                •••
                                            </button>
                                            {openMenuId === plan.id && (
                                                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-50">
                                                    {canEdit && (
                                                        <Link
                                                            href={`/plans/${plan.id}/edit`}
                                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            Editar
                                                        </Link>

                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => onDelete(plan.id)}
                                                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={canEdit || canDelete ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                                No se encontraron planes registrados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}