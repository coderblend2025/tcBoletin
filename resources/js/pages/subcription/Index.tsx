
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useRef, useState, useEffect, useMemo } from 'react';
import Pagination from '@/components/pagination';
import { Head, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SearchControls from '@/components/SearchControls';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface Subscription {
    id: number;
    start_date: string;
    end_date: string | null;
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
        role?: string;
    };
    plan: {
        id: number;
        name: string;
        description: string;
        price: string;
        duration_in_days: number;
    };
}

function SubscriptionsTable({
  subscriptions,
  currentPage,
  subscriptionsPerPage,
  onEdit,
  onDelete,
}: {
  subscriptions: Subscription[];
  currentPage: number;
  subscriptionsPerPage: number;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}) {
  const [sortField, setSortField] = useState<string>('start_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // refs de botones por fila para anclar el portal
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleSort = (field: string) => {
    if (sortField === field) setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const sortedSubscriptions = useMemo(() => {
    const arr = [...subscriptions];
    arr.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      switch (sortField) {
        case 'user.name':  aValue = a.user.name; bValue = b.user.name; break;
        case 'user.email': aValue = a.user.email; bValue = b.user.email; break;
        case 'user.role':  aValue = a.user.role || ''; bValue = b.user.role || ''; break;
        case 'plan.name':  aValue = a.plan.name; bValue = b.plan.name; break;
        case 'plan.price': aValue = parseFloat(a.plan.price); bValue = parseFloat(b.plan.price); break;
        default:           aValue = (a as any)[sortField] ?? ''; bValue = (b as any)[sortField] ?? '';
      }
      if (typeof aValue === 'string' && typeof bValue === 'string')
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      if (typeof aValue === 'number' && typeof bValue === 'number')
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      return 0;
    });
    return arr;
  }, [subscriptions, sortField, sortDirection]);

  const Th = ({ field, label, width }: { field: string; label: string; width?: string }) => (
    <th className={`px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-gray-600 uppercase select-none ${width ?? ''}`}>
      <button type="button" onClick={() => handleSort(field)} className="inline-flex items-center gap-1 hover:text-gray-900">
        <span>{label}</span>
        {sortField === field ? (sortDirection === 'asc' ? <FaAngleUp/> : <FaAngleDown/>) : <span className="opacity-30"><FaAngleUp/></span>}
      </button>
    </th>
  );

  const fmtDate = (d?: string | null) => d ? new Date(d).toLocaleDateString() : '-';
  const fmtPrice = (p: string) => {
    const n = Number(p);
    return isNaN(n) ? p : n.toFixed(2);
  };

  return (
    <div className="mx-auto w-full overflow-x-auto overflow-y-visible">
      <table className="min-w-full divide-y divide-gray-200 rounded-md shadow-sm">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-gray-600 uppercase w-[60px]">#</th>
            <Th field="start_date" label="Inicio" width="w-[140px]" />
            <Th field="end_date" label="Fin" width="w-[140px]" />
            <Th field="status" label="Estado" width="w-[140px]" />
            <Th field="user.name" label="Usuario" width="w-[220px]" />
            <Th field="user.email" label="Email" width="w-[260px]" />
            <Th field="user.role" label="Rol" width="w-[160px]" />
            <Th field="plan.name" label="Plan" width="w-[220px]" />
            <Th field="plan.price" label="Precio" width="w-[140px]" />
            <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-600 uppercase tracking-wider w-[140px]">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {sortedSubscriptions.length > 0 ? (
            sortedSubscriptions.map((s, index) => {
              const rowNumber = (currentPage - 1) * subscriptionsPerPage + index + 1;
              const isOpen = openMenuId === s.id;

              return (
                <tr key={s.id} className="odd:bg-white even:bg-gray-50/50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{rowNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{fmtDate(s.start_date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{fmtDate(s.end_date)}</td>
                  <td className="px-4 py-3">
                    {s.status?.toLowerCase() === 'activo' ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        ● Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
                        ● Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{s.user.email}</td>
                  <td className="px-4 py-3">
                    {s.user.role ? (
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                        {s.user.role}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                        Sin rol
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.plan.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{fmtPrice(s.plan.price)}</td>

                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        ref={el => { buttonRefs.current[s.id] = el; }}
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(isOpen ? null : s.id); }}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Acciones
                        <FaAngleDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <PortalMenu
                          anchorEl={buttonRefs.current[s.id] ?? null}
                          onClose={() => setOpenMenuId(null)}
                          align="right"
                          width={224}
                        >
                          <button
                            role="menuitem"
                            onClick={() => { onEdit(s); setOpenMenuId(null); }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FiEdit /> Editar
                          </button>
                          <button
                            role="menuitem"
                            onClick={() => { onDelete(s); setOpenMenuId(null); }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
                          >
                            <FiTrash2 /> Eliminar
                          </button>
                        </PortalMenu>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={10} className="px-6 py-6 text-center text-sm text-gray-500">
                No se encontraron suscripciones
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

}




import { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

function PortalMenu({
  anchorEl,
  onClose,
  children,
  align = 'right', // 'left' | 'right'
  gap = 8,         // separación vertical en px
  width = 224      // ancho del menú (Tailwind w-56 ≈ 224px)
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

  // Calcula y actualiza la posición (fixed) respecto al botón
  const updatePosition = () => {
    if (!anchorEl) return;
    const r = anchorEl.getBoundingClientRect();
    let left = align === 'right' ? r.right - width : r.left;
    // corrige si se sale del viewport
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    const top = Math.min(r.bottom + gap, window.innerHeight - 8); // no se salga por abajo
    setPos({ top, left });
  };

  useLayoutEffect(() => {
    updatePosition();
    // Reposiciona al hacer scroll/resize o cuando cambia el layout
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener('scroll', onScroll, true);  // true: captura scrolls dentro de contenedores
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [anchorEl]);

  // Cerrar con click fuera o Esc
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && anchorEl && !anchorEl.contains(e.target as Node)) {
        onClose();
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, anchorEl]);

  // No renderizar si no hay ancla
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


// También necesitas actualizar el componente padre SubscriptionsIndex
// para pasar las funciones onEdit y onDelete a SubscriptionsTable.

// Ejemplo de cómo se vería la actualización en SubscriptionsIndex:
interface PageProps {
    subcriptions: {
        data: Subscription[];
        per_page: number;
        current_page: number;
        last_page: number;
        total: number;
    };
    [key: string]: unknown; // Add index signature to satisfy Inertia's PageProps constraint
}


export default function SubscriptionsIndex() {
    const { subcriptions, users , plans} = usePage<PageProps & { users: any[], plans: any[] }>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        id_user: '',
        id_plan: '',
        status: '',
    });

    const filteredSubscriptions = useMemo(() => {
        if (!searchTerm) return subcriptions.data;
        return subcriptions.data.filter(
            (s) =>
                s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.plan.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [subcriptions.data, searchTerm]);

    function handleNuevaSubClick(): void {
        setIsEditing(false);
        reset();
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && selectedSub) {
            put(`/subscriptions/${selectedSub.id}`, {
                onSuccess: () => {
                    closePopup();
                },
            });
        } else {
            post('/subscriptions', {
                onSuccess: () => {
                    closePopup();
                },
            });
        }
    };

    const handleEdit = (sub: Subscription) => {
        setSelectedSub(sub);
        setData({
            id_user: String(sub.user.id),
            id_plan: String(sub.plan.id),
            status: sub.status || '',
        });
        setIsEditing(true);
        setIsPopupOpen(true);
    };

    const handleDelete = (sub: Subscription) => {
        setSelectedSub(sub);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedSub) {
            destroy(`/subscriptions/${selectedSub.id}`, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedSub(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Suscripciones', href: '/subscriptions' }]}> 
            <Head title="Suscripciones" />

              <div className="mb-8 flex items-center justify-between">
                    <div className="w-[100%] border border-gray-300 bg-white p-1">
                        <h4 style={{ fontSize: '12px' }} className="font-semibold text-gray-900 dark:text-gray-100">
                            Administración de Usuarios
                        </h4>
                        <hr></hr>
                        <span style={{ fontSize: '11px' }} className="text-gray-600">
                            Todos los usuarios del sistema aparecerán aquí
                        </span>
                    </div>
                </div>
            <div className="mx-auto w-4/5 max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto w-full rounded-lg bg-white p-6 shadow">
                    <SearchControls
                        searchTerm={searchTerm}
                        actionButtonName="Nueva Suscripción"
                        onActionButtonClick={handleNuevaSubClick}
                        onSearchChange={setSearchTerm}
                        itemsPerPage={subcriptions.per_page as 5 | 10 | 20 | 50}
                        onItemsPerPageChange={(perPage) => {
                            window.location.href = `/subscriptions?page=${subcriptions.current_page}&per_page=${perPage}`;
                        }}
                    />

                    <SubscriptionsTable
                        subscriptions={filteredSubscriptions}
                        currentPage={subcriptions.current_page}
                        subscriptionsPerPage={subcriptions.per_page}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        currentPage={subcriptions.current_page}
                        totalPages={subcriptions.last_page}
                        totalItems={subcriptions.total}
                        itemsPerPage={subcriptions.per_page}
                        onPageChange={(page) => {
                            window.location.href = `/subscriptions?page=${page}&per_page=${subcriptions.per_page}`;
                        }}
                    />
                </div>
            </div>

            {/* Modal para crear/editar suscripción */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold">{isEditing ? 'Editar Suscripción' : 'Crear Nueva Suscripción'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                                <select
                                    value={data.id_user}
                                    onChange={(e) => setData('id_user', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2"
                                    required
                                >
                                    <option value="">Seleccione un usuario</option>
                                    {users.map((u: any) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.id_user && <div className="mt-1 text-sm text-red-600">{errors.id_user}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Plan</label>
                                <select
                                    value={data.id_plan}
                                    onChange={(e) => setData('id_plan', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2"
                                    required
                                >
                                    <option value="">Seleccione un plan</option>
                                    {plans.map((p: any) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} - {p.price}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_plan && <div className="mt-1 text-sm text-red-600">{errors.id_plan}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Estado</label>
                                <select
                                    value={data.status || ''}
                                    onChange={e => setData('status', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2"
                                    required
                                >
                                    <option value="">Seleccione estado</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                                {errors.status && <div className="mt-1 text-sm text-red-600">{errors.status}</div>}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closePopup}
                                    className="mr-2 cursor-pointer rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isEditing ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="w-[400px] rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Eliminar Suscripción</h2>
                        <p className="mb-6 text-sm text-gray-600">
                            ¿Está seguro que desea eliminar la suscripción de "{selectedSub?.user.name}" al plan "{selectedSub?.plan.name}"? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setSelectedSub(null);
                                }}
                                className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}