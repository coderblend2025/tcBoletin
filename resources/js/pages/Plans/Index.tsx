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


import { useLayoutEffect} from 'react';
import { createPortal } from 'react-dom';

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
            <div className="mb-8 flex items-center justify-between">
                <div className="w-[100%] border border-gray-300 bg-white p-1">
                    <h4 style={{ fontSize: '12px' }} className="font-semibold text-gray-900 dark:text-gray-100">
                            Administración de Planes
                    </h4>
                    <hr></hr>
                    <span style={{ fontSize: '11px' }} className="text-gray-600">
                            Todos los planes del sistema aparecerán aquí
                    </span>
                </div>
            </div>

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
  requestSort: (key: keyof Plan) => void;
  getSortIcon: (key: keyof Plan) => React.ReactNode;
}) {
  // ref del botón por fila para anclar el portal
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const Th = ({
    field,
    label,
    width,
  }: { field: keyof Plan; label: string; width?: string }) => (
    <th
      className={`px-6 py-3 text-left text-[11px] font-semibold tracking-wider text-gray-600 uppercase select-none ${width ?? ''}`}
    >
      <button
        type="button"
        onClick={() => requestSort(field)}
        className="inline-flex items-center gap-1 hover:text-gray-900"
      >
        <span>{label}</span>
        {getSortIcon(field)}
      </button>
    </th>
  );

  return (
    <div className="mx-auto w-full overflow-x-auto overflow-y-visible">
      <table className="min-w-full divide-y divide-gray-200 rounded-md shadow-sm">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <Th field="name" label="Nombre" width="w-[260px]" />
            <Th field="description" label="Descripción" width="w-[420px]" />
            <Th field="price" label="Precio (Bs)" width="w-[160px]" />
            <Th field="duration_in_days" label="Duración (días)" width="w-[160px]" />
            {(canEdit || canDelete) && (
              <th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-600 uppercase tracking-wider w-[140px]">
                Acciones
              </th>
            )}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {plans.length > 0 ? (
            plans.map((plan) => {
              const isOpen = openMenuId === plan.id;
              return (
                <tr key={plan.id} className="odd:bg-white even:bg-gray-50/50 hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plan.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[520px] truncate">
                    {plan.description || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.formatted_price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {plan.duration_in_days} días
                  </td>

                  {(canEdit || canDelete) && (
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          ref={el => { buttonRefs.current[plan.id] = el; }}
                          type="button"
                          aria-haspopup="menu"
                          aria-expanded={isOpen}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isOpen ? null : plan.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Acciones
                          <FiArrowDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                          <PortalMenu
                            anchorEl={buttonRefs.current[plan.id] ?? null}
                            onClose={() => setOpenMenuId(null)}
                            align="right"
                            width={224}
                          >
                            {canEdit && (
                              <button
                                role="menuitem"
                                onClick={() => { onEdit(plan); setOpenMenuId(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <FiEdit /> Editar
                              </button>
                            )}
                            {canEdit && (
                              <button
                                role="menuitem"
                                onClick={() => { onEditDetails(plan); setOpenMenuId(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <FiEdit /> Condiciones
                              </button>
                            )}
                            <button
                              role="menuitem"
                              onClick={() => { onDetails(plan); setOpenMenuId(null); }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <FiEye /> Detalles
                            </button>
                            {canDelete && (
                              <button
                                role="menuitem"
                                onClick={() => { onDelete(plan.id); setOpenMenuId(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
                              >
                                <FiTrash2 /> Eliminar
                              </button>
                            )}
                          </PortalMenu>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={canEdit || canDelete ? 5 : 4} className="px-6 py-6 text-center text-sm text-gray-500">
                No se encontraron planes registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  
}

export function PortalMenu({
  anchorEl,
  onClose,
  children,
  align = 'right', // 'left' | 'right'
  gap = 8,         // separación vertical
  width = 224      // ~ w-56
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
  align?: 'left' | 'right';
  gap?: number;
  width?: number;
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const updatePosition = () => {
    if (!anchorEl) return;
    const r = anchorEl.getBoundingClientRect();
    let left = align === 'right' ? r.right - width : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    const top = Math.min(r.bottom + gap, window.innerHeight - 8);
    setPos({ top, left });
  };

  useLayoutEffect(() => {
    updatePosition();
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [anchorEl]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, anchorEl]);

  if (!anchorEl) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: 'fixed', top: pos.top, left: pos.left, width }}
      className="z-[9999] origin-top rounded-lg bg-white shadow-lg ring-1 ring-black/10 overflow-hidden"
      role="menu"
    >
      {children}
    </div>,
    document.body
  );
}
