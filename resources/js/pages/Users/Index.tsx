import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import SearchControls from '@/components/SearchControls';
import { useRef, useEffect } from 'react';

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
    [key: string]: any;
}

export default function UsersIndex() {
    const { users } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users.data;

        return users.data.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users.data, searchTerm]);

    function handleNuevoUsuarioClick(): void {
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/users' }]}>
            <Head title="Users" />

            <div className="">
                <div className="mb-8 flex items-center justify-between">
                    <div className="bg-white border border-gray-300 w-[100%] p-1">
                        <h4 style={{ fontSize: '12px' }} className="font-semibold text-gray-900 dark:text-gray-100">Administración de Usuarios</h4>
                        <hr></hr>
                        <span style={{ fontSize: '11px' }} className="text-gray-600">Todos los usuarios del sistema aparecerán aquí</span>
                    </div>
                </div>
                <div className="w-4/5 max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6 w-full mx-auto">
                        <SearchControls
                            searchTerm={searchTerm}
                            actionButtonName="Nuevo Usuario"
                            onActionButtonClick={handleNuevoUsuarioClick}
                            onSearchChange={setSearchTerm}
                            usersPerPage={users.per_page as 5 | 10 | 20 | 50}
                            onUsersPerPageChange={(perPage) => {
                                window.location.href = `/users?page=${users.current_page}&per_page=${perPage}`;
                            }}
                        />

                        <UsersTable
                            users={filteredUsers}
                            currentPage={users.current_page}
                            usersPerPage={users.per_page}
                            openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Crear Nuevo Usuario</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option>Admin</option>
                                    <option>Editor</option>
                                    <option>Viewer</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closePopup}
                                    className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
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
}: {
    users: User[],
    currentPage: number,
    usersPerPage: number,
    openMenuId: string | null,
    setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>
}
) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="mx-auto w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-[50px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="w-[250px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="w-[50px] px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td className="w-[250px] px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="w-[120px] px-4 py-3 text-left text-sm text-gray-700">
                    {user.role || 'Sin rol'}
                  </td>
                  <td className="relative w-[100px] px-4 py-3 text-right text-sm font-medium">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
      
                    {openMenuId === user.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-50"
                      >
                        <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                          Editar
                        </button>
                        <button className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
}