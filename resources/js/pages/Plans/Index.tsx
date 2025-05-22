import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import DeletePlan from './DeletePlansModal';
import EditModal from './EditPlanModal';
import DetailsModal from './DetailsModal';
import EditConditionsModal from './EditConditionsModal';
import { FiEdit, FiTrash2, FiEye, FiArrowUp, FiArrowDown } from "react-icons/fi";
import SearchControls from '@/components/SearchControls';

interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    formatted_price: string;
    duration_in_days: number;
    created_at: string;
    updated_at: string;
    conditions?: string[];
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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [plansPerPage, setPlansPerPage] = useState<5 | 10 | 20 | 50>(10);
    const [filteredPlans, setFilteredPlans] = useState<Plan[]>(plans);
    const [editDetailsModalOpen, setEditDetailsModalOpen] = useState(false);

    // Nuevo estado para el ordenamiento
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Plan;
        direction: 'asc' | 'desc';
    } | null>(null);

    // Función para ordenar los planes
    const sortedPlans = useMemo(() => {
        const sortablePlans = [...plans];
        const filtered = searchTerm 
            ? sortablePlans.filter(plan => 
                plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false))
            : sortablePlans;

        if (sortConfig) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? '';
                const bValue = b[sortConfig.key] ?? '';

                // Manejo de números (price, duration_in_days)
                if (sortConfig.key === 'price' || sortConfig.key === 'duration_in_days') {
                    return sortConfig.direction === 'asc' 
                        ? Number(aValue) - Number(bValue)
                        : Number(bValue) - Number(aValue);
                }

                // Manejo de strings (name, description)
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                // Manejo de arrays (conditions)
                if (Array.isArray(aValue) && Array.isArray(bValue)) {
                    const aStr = aValue.join(', ');
                    const bStr = bValue.join(', ');
                    return sortConfig.direction === 'asc'
                        ? aStr.localeCompare(bStr)
                        : bStr.localeCompare(aStr);
                }

                // Caso por defecto: convertir a string para comparación
                return sortConfig.direction === 'asc'
                    ? String(aValue).localeCompare(String(bValue))
                    : String(bValue).localeCompare(String(aValue));
            });
        }

        return filtered;
    }, [plans, searchTerm, sortConfig]);

    // Función para manejar el ordenamiento
    const requestSort = (key: keyof Plan) => {
        // Si ya está ordenado por esta columna, alternar dirección
        if (sortConfig && sortConfig.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
            });
        } else {
            // Primera vez que se ordena esta columna (ascendente por defecto)
            setSortConfig({ key, direction: 'asc' });
        }
    };

    // Función para obtener el icono correcto
    const getSortIcon = (key: keyof Plan) => {
        // Si no hay ordenamiento o es otra columna, mostrar ↑ (por defecto)
        if (!sortConfig || sortConfig.key !== key) {
            return <FiArrowUp className="ml-1 text-gray-400" />;
        }
        // Mostrar ↓ si está ordenado descendente
        return sortConfig.direction === 'desc' 
            ? <FiArrowDown className="ml-1 text-gray-700" /> 
            : <FiArrowUp className="ml-1 text-gray-700" />;
    };
    
    const handleDeleteClick = (id: number) => {
        setSelectedPlanId(id);
        setDeleteModalOpen(true);
    };

    const handleEditClick = (plan: Plan) => {
        setSelectedPlan(plan);
        setEditModalOpen(true);
    };
    
    const handleDetailsClick = (plan: Plan) => {
        setSelectedPlan(plan);
        setDetailsModalOpen(true);
    };

    const handleEditDetailsClick = (plan: Plan) => {
        setSelectedPlan(plan);
        setEditDetailsModalOpen(true);
    };

    const handleSaveConditions = async (newConditions: string[]) => {
        if (!selectedPlan) return;

        try {
            await router.put(`/plans/${selectedPlan.id}`, {
                name: selectedPlan.name,
                description: selectedPlan.description,
                price: selectedPlan.price,
                duration_in_days: selectedPlan.duration_in_days,
                conditions: newConditions,
            });

            // Actualizar estado local
            setFilteredPlans(prev =>
                prev.map(p =>
                    p.id === selectedPlan.id
                        ? { ...p, conditions: newConditions }
                        : p
                )
            );
            setSelectedPlan(prev =>
                prev ? { ...prev, conditions: newConditions } : null
            );
            setEditDetailsModalOpen(false);
        } catch (error) {
            console.error('Error al guardar condiciones:', error);
        }
    };


    const handleConditionsUpdate = (planId: number, newConditions: string[]) => {
        setFilteredPlans(prev => prev.map(p => 
            p.id === planId 
                ? { ...p, conditions: newConditions } 
                : p
        ));
        if (selectedPlan?.id === planId) {
            setSelectedPlan(prev => prev ? { ...prev, conditions: newConditions } : null);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Planes', href: '/plans' }]}>
            <Head title="Planes" />
            <div className="w-full max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6 w-full mx-auto">
                    <SearchControls 
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        itemsPerPage={plansPerPage}
                        onItemsPerPageChange={setPlansPerPage}
                        onActionButtonClick={() => router.visit('/plans/create')}
                        actionButtonName="Nuevo Plan"
                    />
                    <PlansTable
                        plans={sortedPlans}
                        canEdit={can.edit}
                        canDelete={can.delete}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                        onDelete={handleDeleteClick}
                        onEdit={handleEditClick}
                        onDetails={handleDetailsClick}
                        onEditDetails={handleEditDetailsClick}
                        requestSort={requestSort}
                        getSortIcon={getSortIcon}
                        sortConfig={sortConfig}
                    />
                </div>
            </div>
             {selectedPlanId && (
                <DeletePlan
                    planId={selectedPlanId}
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                />
            )}
            {selectedPlan && (
                <EditModal
                    plan={selectedPlan}
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                />
            )}
            {selectedPlan && (
                    <DetailsModal
                        plan={selectedPlan}
                        isOpen={detailsModalOpen}
                        onClose={() => setDetailsModalOpen(false)}
                        onConditionsUpdated={(newConditions) => {
                            // Actualiza el estado local si es necesario
                            setSelectedPlan(prev => prev ? { ...prev, conditions: newConditions } : null);
                            setFilteredPlans(prev => prev.map(p => 
                                p.id === selectedPlan.id 
                                    ? { ...p, conditions: newConditions } 
                                    : p
                            ));
                        }}
                    />
                )}
                {selectedPlan && (
                    <EditConditionsModal
                        plan={selectedPlan}
                        isOpen={editDetailsModalOpen}
                        onClose={() => setEditDetailsModalOpen(false)}
                        onSave={handleSaveConditions}
                    />
                )}
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
    onEdit,
    onDetails,
    onEditDetails,
    requestSort,
    getSortIcon,
    sortConfig,
}: {
    plans: Plan[];
    canEdit: boolean;
    canDelete: boolean;
    openMenuId: number | null;
    setOpenMenuId: React.Dispatch<React.SetStateAction<number | null>>;
    onDelete: (id: number) => void;
    onEdit: (plan: Plan) => void;
    onDetails: (plan: Plan) => void;
    onEditDetails: (plan: Plan) => void;
    onConditionsUpdated?: (newConditions: string[]) => void;
    requestSort: (key: keyof Plan) => void;
    getSortIcon: (key: keyof Plan) => React.ReactNode;
    sortConfig: { key: keyof Plan; direction: 'asc' | 'desc' } | null;
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
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('name')}
                        >
                            <div className="flex items-center">
                                Nombre
                                {getSortIcon('name')}
                            </div>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('description')}
                        >
                            <div className="flex items-center">
                                Descripción
                                {getSortIcon('description')}
                            </div>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('price')}
                        >
                            <div className="flex items-center">
                                Precio
                                {getSortIcon('price')}
                            </div>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('duration_in_days')}
                        >
                            <div className="flex items-center">
                                Duración (días)
                                {getSortIcon('duration_in_days')}
                            </div>
                        </th>
                        {(canEdit || canDelete) && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 relative">
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
                                                className="px-6 text-gray-500 hover:text-gray-700 cursor-pointer relative"
                                                ref={(el) => {
                                                    if (el && openMenuId === plan.id) {
                                                        const rect = el.getBoundingClientRect();
                                                        const menu = document.getElementById(`menu-${plan.id}`);
                                                        if (menu) {
                                                            menu.style.top = `${rect.bottom + window.scrollY}px`;
                                                            menu.style.left = `${rect.left + window.scrollX - 100}px`;
                                                        }
                                                    }
                                                }}
                                            >
                                                •••
                                            </button>
                                            {openMenuId === plan.id && (
                                                <div 
                                                    id={`menu-${plan.id}`}
                                                    className="fixed w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                                                >
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => {
                                                                onEdit(plan);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiEdit className="mr-2" />
                                                            Editar
                                                        </button>
                                                    )}
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => {
                                                                onEditDetails(plan);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiEdit className="mr-2" />
                                                            Condiciones
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            onDetails(plan);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <FiEye className="mr-2" />
                                                        Detalles
                                                    </button>
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => {
                                                                onDelete(plan.id);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        >
                                                            <FiTrash2 className="mr-2" />
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