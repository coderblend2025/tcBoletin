import ConfirmationModal from '@/components/ConfirmationModal';
import Pagination from '@/components/pagination';
import SearchControlsTraders from '@/components/SearchControlsTraders';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import AddPriceModal from './pointChange/AddPriceModal';
import PriceInfoModal from './pointChange/PriceInfoModal';

interface Trader {
    id: string;
    lan: string;
    log: string;
    name: string;
    code: string;
    ubication_name: string;
    status: boolean;
}

interface PaginationData {
    data: Trader[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PageProps {
    traders: PaginationData;
    [key: string]: any;
}


// ...imports iguales

export default function TradersPage() {
  const { traders } = usePage<PageProps>().props;
  const [isAddPriceModalOpen, setIsAddPriceModalOpen] = useState(false);
  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);
  const [isPriceInfoModalOpen, setIsPriceInfoModalOpen] = useState(false);
  const [selectedInfoTraderId, setSelectedInfoTraderId] = useState<null | { id: string; ubication_name: string; lan: string; log: string }>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState<{
    id: string; name: string; code: string; ubication: string; lat: string; log: string;
  }>({ id:'', name:'', code:'', ubication:'', lat:'', log:'' });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [traderToDelete, setTraderToDelete] = useState<Trader | null>(null);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return traders.data;
    return traders.data.filter(t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [traders.data, searchTerm]);

  function handleNuevoUsuarioClick() {
    setIsPopupOpen(true);
  }

  const onDeleteTrader = (trader: Trader) => {
    setTraderToDelete(trader);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (traderToDelete) {
      router.delete(`/traders/${traderToDelete.id}`, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setTraderToDelete(null);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Puntos de Referencias Cambiarias', href: '/traders' }]}>
      <Head title="Traders" />
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div className="w-full border border-gray-200 bg-white p-3 rounded-md">
            <h4 className="text-xs font-semibold text-gray-900">Administración de Puntos de Referencias Cambiarias</h4>
            <hr className="my-2" />
            <span className="text-[11px] text-gray-600">Todos los de puntos de referencias cambiarias aparecen aquí</span>
          </div>
        </div>

        <div className="mx-auto w-4/5 max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <SearchControlsTraders
              searchTerm={searchTerm}
              actionButtonName="Nuevo"
              onActionButtonClick={handleNuevoUsuarioClick}
              onSearchChange={setSearchTerm}
              usersPerPage={traders.per_page as 5 | 10 | 20 | 50}
              onUsersPerPageChange={(perPage) => {
                window.location.href = `/traders?page=${traders.current_page}&per_page=${perPage}`;
              }}
              isPopupOpen={isPopupOpen}
              setIsPopupOpen={setIsPopupOpen}
              initialData={formData}
            />

            <UsersTable
              users={filteredUsers}
              currentPage={traders.current_page}
              usersPerPage={traders.per_page}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              isPopupOpen={isPopupOpen}
              setIsPopupOpen={setIsPopupOpen}
              onEditTrader={(trader) => {
                setFormData({
                  id: trader.id,
                  name: trader.name,
                  code: trader.code,
                  ubication: trader.ubication_name,
                  lat: trader.lan,
                  log: trader.log,
                });
                setIsPopupOpen(true);
              }}
              onDeleteTrader={onDeleteTrader}
              onOpenAddPriceModal={(traderId) => {
                setSelectedTraderId(traderId);
                setIsAddPriceModalOpen(true);
              }}
              onOpenPriceInfoModal={(traderId) => {
                // Buscar el trader en la lista y guardar el objeto completo
                const traderObj = filteredUsers.find(t => t.id === traderId);
                if (traderObj) {
                  setSelectedInfoTraderId({
                    id: traderObj.id,
                    ubication_name: traderObj.ubication_name,
                    lan: traderObj.lan,
                    log: traderObj.log,
                  });
                  setIsPriceInfoModalOpen(true);
                }
              }}
            />

            <Pagination
              currentPage={traders.current_page}
              totalPages={traders.last_page}
              totalItems={traders.total}
              itemsPerPage={traders.per_page}
              onPageChange={(page) => {
                window.location.href = `/traders?page=${page}&per_page=${traders.per_page}`;
              }}
            />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setTraderToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Librecambista"
        message={`¿Está seguro que desea eliminar el librecambista "${traderToDelete?.name}"? Esta acción no se puede deshacer.`}
      />

      {isAddPriceModalOpen && selectedTraderId && (
        <AddPriceModal
          isOpen={isAddPriceModalOpen}
          onClose={() => { setIsAddPriceModalOpen(false); setSelectedTraderId(null); }}
          traderId={selectedTraderId}
        />
      )}

      {isPriceInfoModalOpen && selectedInfoTraderId && (
              <PriceInfoModal
                isOpen={isPriceInfoModalOpen}
                onClose={() => { setIsPriceInfoModalOpen(false); setSelectedInfoTraderId(null); }}
                traderInfo={selectedInfoTraderId}
              />
            )}
    </AppLayout>
  );
}




function UsersTable({
  users,
  currentPage,
  usersPerPage,
  openMenuId,
  setOpenMenuId,
  isPopupOpen,
  setIsPopupOpen,
  onEditTrader,
  onDeleteTrader,
  onOpenAddPriceModal,
  onOpenPriceInfoModal,
}: {
  users: Trader[];
  currentPage: number;
  usersPerPage: number;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  isPopupOpen: boolean;
  setIsPopupOpen: (isOpen: boolean) => void;
  onEditTrader: (trader: Trader) => void;
  onDeleteTrader: (trader: Trader) => void;
  onOpenAddPriceModal: (traderId: string) => void;
  onOpenPriceInfoModal: (traderId: string) => void;
}) {
  const [sortField, setSortField] = useState<keyof Trader>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 🔧 mapa de refs, uno por fila
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Ref para los botones de acciones
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleSort = (field: keyof Trader) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = useMemo(() => {
    const arr = [...users];
    arr.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        if (aValue === bValue) return 0;
        return sortDirection === 'asc' ? (aValue ? -1 : 1) : (aValue ? 1 : -1);
      }
      return 0;
    });
    return arr;
  }, [users, sortField, sortDirection]);

  // 👇 Listener "outside click" sólo cuando hay un menú abierto y contra SU ref
  useEffect(() => {
    if (!openMenuId) return;

    const handler = (ev: MouseEvent) => {
      const node = menuRefs.current[openMenuId];
      if (node && ev.target instanceof Node) {
        if (!node.contains(ev.target)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId, setOpenMenuId]);

  const Th = ({
    field,
    label,
    width,
  }: { field: keyof Trader; label: string; width?: string }) => (
    <th
      className={`px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-gray-600 uppercase select-none ${width ?? ''}`}
    >
      <button
        type="button"
        onClick={() => handleSort(field)}
        className="inline-flex items-center gap-1 hover:text-gray-900"
      >
        <span>{label}</span>
        {sortField === field && (
          <span aria-hidden>{sortDirection === 'asc' ? '▲' : '▼'}</span>
        )}
      </button>
    </th>
  );

  // Detectar rol del usuario
  const { auth } = usePage<{ auth: { user: { roles: string[] } } }>().props;
  const roles = auth?.user?.roles || [];
  const isConsultor = roles.includes('consultor');
  const isAdmin = roles.includes('admin');

  return (
    <div className="mx-auto w-full overflow-x-auto overflow-y-visible">
      <table className="min-w-full divide-y divide-gray-200 rounded-md shadow-sm">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="w-[60px] px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-gray-600 uppercase">#</th>
            <Th field="name" label="Nombre" width="w-[220px]" />
            <Th field="code" label="Código" width="w-[200px]" />
            <Th field="ubication_name" label="Ubicación" width="w-[280px]" />
            <Th field="status" label="Estado" width="w-[120px]" />
            <th className="w-[120px] px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-gray-600 uppercase">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((trader, index) => {
              const rowNumber = (currentPage - 1) * usersPerPage + index + 1;
              const isOpen = openMenuId === trader.id;

              return (
                <tr key={trader.id} className="odd:bg-white even:bg-gray-50/50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{rowNumber}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{trader.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{trader.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{trader.ubication_name}</td>
                  <td className="px-4 py-3">
                    {trader.status ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        ● Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
                        ● Inactivo
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block text-left">
                        <button
                        ref={el => { buttonRefs.current[trader.id] = el; }}
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isOpen ? null : trader.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                        Acciones
                        <FaAngleDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                        <PortalMenu
                            anchorEl={buttonRefs.current[trader.id] ?? null}
                            onClose={() => setOpenMenuId(null)}
                            align="right"
                            width={224} // w-56
                        >
                            {/* Solo consultor: mostrar solo agregar precio e información */}
                            {isConsultor && !isAdmin ? (
                              <>
                                <button
                                  role="menuitem"
                                  onClick={() => { onOpenAddPriceModal(trader.id); setOpenMenuId(null); }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                                >
                                  ➕ Agregar precio del dólar
                                </button>
                                <button
                                  role="menuitem"
                                  onClick={() => { onOpenPriceInfoModal(trader.id); setOpenMenuId(null); }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50"
                                >
                                  ℹ️ Información
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  role="menuitem"
                                  onClick={() => { onEditTrader(trader); setOpenMenuId(null); }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  role="menuitem"
                                  onClick={() => { onOpenAddPriceModal(trader.id); setOpenMenuId(null); }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                                >
                                  ➕ Agregar precio del dólar
                                </button>
                                <button
                                  role="menuitem"
                                  onClick={() => { onOpenPriceInfoModal(trader.id); setOpenMenuId(null); }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50"
                                >
                                  ℹ️ Información
                                </button>
                                <button
                                  role="menuitem"
                                  onClick={() => { onDeleteTrader(trader); setOpenMenuId(null); }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
                                >
                                  🗑️ Eliminar
                                </button>
                              </>
                            )}
                        </PortalMenu>
                        )}
                    </div>
                    </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                No se encontraron resultados
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
