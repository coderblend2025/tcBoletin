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

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users.data;

        return users.data.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users.data, searchTerm]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/users' }]}>
            <Head title="Users" />

            <div className="p-6 max-w-6xl mx-1">
            <header className="mb-6">
                <div className="bg-white border border-gray-300 rounded-md p- shadow-sm w-[35%]">
                    <h1 className="text-2xl font-bold text-gray-900">Administración de Usuarios</h1>
                    <p className="text-gray-600">Todos los usuarios del sistema aparecerán aquí</p>
                </div>
            </header>

                <SearchControls
                    searchTerm={searchTerm}
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
        <div className="mx-1 w-[150%]">
            <div className="w-full max-w-screen-xl px-4 bg-white shadow rounded-lg relative mb-4">
                <table className="w-full divide-y divide-gray-200 text-lg table-fixed">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="w-[50px] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">#</th>
                            <th className="w-[400px] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-8 py-5 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="w-[150px] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Rol</th>
                            <th className="w-[100px] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="w-[50px] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                        {(currentPage - 1) * usersPerPage + index + 1}
                                    </td>
                                    <td className="w-[400px] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                        {user.name}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="w-[150px] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                        {user.role || 'Sin rol'}
                                    </td>
                                    <td className="relative w-[100px] px-9 py-3 text-sm text-gray-900">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
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
                                <td colSpan={5} className="px-20 py-4 text-center text-sm text-gray-500">
                                    No se encontraron usuarios
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}