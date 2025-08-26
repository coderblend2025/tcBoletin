import Pagination from '@/components/pagination';
import SearchControls from '@/components/SearchControls';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface User {
    id: string;
    name: string;
    role: string | null;
    email: string;
}

interface PaginationData {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PageProps {
    users: PaginationData;
    roles: string[];
    [key: string]: any;
}

export default function UsersIndex() {
    const { users, roles } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);

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
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users.data;

        return users.data.filter(
            (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [users.data, searchTerm]);

    function handleNuevoUsuarioClick(): void {
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
        if (isEditing && selectedUser) {
            put(`/users/${selectedUser.id}`, {
                onSuccess: () => {
                    closePopup();
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    closePopup();
                },
            });
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role || '',
        });
        setIsEditing(true);
        setIsPopupOpen(true);
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedUser) {
            destroy(`/users/${selectedUser.id}`, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/users' }]}>
            <Head title="Users" />

            <div className="">
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
                            actionButtonName="Nuevo Usuario"
                            onActionButtonClick={handleNuevoUsuarioClick}
                            onSearchChange={setSearchTerm}
                            itemsPerPage={users.per_page as 5 | 10 | 20 | 50}
                            onItemsPerPageChange={(perPage) => {
                                window.location.href = `/users?page=${users.current_page}&per_page=${perPage}`;
                            }}
                        />

                        <UsersTable
                            users={filteredUsers}
                            currentPage={users.current_page}
                            usersPerPage={users.per_page}
                            openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        <Pagination
                            currentPage={users.current_page}
                            totalPages={users.last_page}
                            totalItems={users.total}
                            itemsPerPage={users.per_page}
                            onPageChange={(page) => {
                                window.location.href = `/users?page=${page}&per_page=${users.per_page}`;
                            }}
                        />
                    </div>
                </div>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold">{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />

                                {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                            </div>
                            {!isEditing && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                    {errors.password && <div className="mt-1 text-sm text-red-600">{errors.password}</div>}
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">Seleccione un rol</option>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <div className="mt-1 text-sm text-red-600">{errors.role}</div>}
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

            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-[400px] rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Eliminar Usuario</h2>
                        <p className="mb-6 text-sm text-gray-600">
                            ¿Está seguro que desea eliminar el usuario "{selectedUser?.name}"? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setSelectedUser(null);
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


function UsersTable({
  users,
  currentPage,
  usersPerPage,
  openMenuId,
  setOpenMenuId,
  onEdit,
  onDelete,
}: {
  users: User[];
  currentPage: number;
  usersPerPage: number;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleSort = (field: keyof User) => {
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
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
    return arr;
  }, [users, sortField, sortDirection]);

  const Th = ({ field, label, width }: { field: keyof User; label: string; width?: string }) => (
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

  return (
    <div className="mx-auto w-full overflow-x-auto overflow-y-visible">
      <table className="min-w-full divide-y divide-gray-200 rounded-md shadow-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="w-[60px] px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-gray-600 uppercase">#</th>
            <Th field="name" label="Nombre" width="w-[220px]" />
            <Th field="email" label="Email" width="w-[280px]" />
            <Th field="role" label="Rol" width="w-[180px]" />
            <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-600 uppercase tracking-wider w-[140px]">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user, index) => {
              const rowNumber = (currentPage - 1) * usersPerPage + index + 1;
              const isOpen = openMenuId === user.id;
              return (
                <tr key={user.id} className="odd:bg-white even:bg-gray-50/50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{rowNumber}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.role ? (
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                        {user.role}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                        Sin rol
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        ref={el => { buttonRefs.current[user.id] = el; }}
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isOpen ? null : user.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Acciones
                        <FaAngleDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <PortalMenu
                          anchorEl={buttonRefs.current[user.id] ?? null}
                          onClose={() => setOpenMenuId(null)}
                          align="right"
                          width={192}
                        >
                          <button
                            role="menuitem"
                            onClick={() => { onEdit(user); setOpenMenuId(null); }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            role="menuitem"
                            onClick={() => { onDelete(user); setOpenMenuId(null); }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
                          >
                            🗑️ Eliminar
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
              <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                No se encontraron usuarios
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
