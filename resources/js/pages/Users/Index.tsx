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
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [sortField, setSortField] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
        const aValue = a[sortField as keyof User];
        const bValue = b[sortField as keyof User];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return 0;
    });

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
                        <th className="w-[50px] px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">#</th>
                        <th
                            className="w-[250px] cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-200"
                            onClick={() => handleSort('name')}
                        >
                            <div className="inline-flex cursor-pointer items-center gap-x-2">
                                <span>Nombre</span>
                                {sortField === 'name' && (sortDirection === 'asc' ? <FaAngleUp /> : <FaAngleDown />)}
                            </div>
                        </th>
                        <th
                            className="cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-200"
                            onClick={() => handleSort('email')}
                        >
                            <div className="inline-flex cursor-pointer items-center gap-x-2">
                                <span>Email</span>
                                {sortField === 'email' && (sortDirection === 'asc' ? <FaAngleUp /> : <FaAngleDown />)}
                            </div>
                        </th>
                        <th
                            className="w-[120px] cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-200"
                            onClick={() => handleSort('role')}
                        >
                            <div className="inline-flex cursor-pointer items-center gap-x-2">
                                <span>Rol</span>
                                {sortField === 'role' && (sortDirection === 'asc' ? <FaAngleUp /> : <FaAngleDown />)}
                            </div>
                        </th>
                        <th className="w-[100px] px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {sortedUsers.length > 0 ? (
                        sortedUsers.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="w-[50px] px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    {(currentPage - 1) * usersPerPage + index + 1}
                                </td>
                                <td className="w-[250px] px-4 py-3 text-left text-sm font-medium text-gray-700">{user.name}</td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">{user.email}</td>
                                <td className="w-[120px] px-4 py-3 text-left text-sm text-gray-700">{user.role || 'Sin rol'}</td>
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
                                            className="absolute right-0 z-50 mt-2 w-32 rounded border border-gray-200 bg-white shadow-md"
                                        >
                                            <button
                                                onClick={() => {
                                                    onEdit(user);
                                                    setOpenMenuId(null);
                                                }}
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDelete(user);
                                                    setOpenMenuId(null);
                                                }}
                                                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                                No se encontraron usuarios
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
