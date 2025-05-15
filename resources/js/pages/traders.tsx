import Pagination from '@/components/pagination';
import SearchControlsTraders from '@/components/SearchControlsTraders';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

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

export default function traders() {
    const { traders } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return traders.data;

        return traders.data.filter(
            (trader) => trader.name.toLowerCase().includes(searchTerm.toLowerCase()) || trader.code.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [traders.data, searchTerm]);

    function handleNuevoUsuarioClick(): void {
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Traders', href: '/traders' }]}>
            <Head title="Traders" />

            <div className="">
                <div className="mb-8 flex items-center justify-between">
                    <div className="w-[100%] border border-gray-300 bg-white p-1">
                        <h4 style={{ fontSize: '12px' }} className="font-semibold text-gray-900 dark:text-gray-100">
                            Administración de Librecambistas
                        </h4>
                        <hr></hr>
                        <span style={{ fontSize: '11px' }} className="text-gray-600">
                            Todos los librecambistas del sistema aparecerán aquí
                        </span>
                    </div>
                </div>
                <div className="mx-auto w-4/5 max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full rounded-lg bg-white p-6 shadow">
                        <SearchControlsTraders
                            searchTerm={searchTerm}
                            actionButtonName="Nuevo"
                            onActionButtonClick={handleNuevoUsuarioClick}
                            onSearchChange={setSearchTerm}
                            usersPerPage={traders.per_page as 5 | 10 | 20 | 50}
                            onUsersPerPageChange={(perPage) => {
                                window.location.href = `/traders?page=${traders.current_page}&per_page=${perPage}`;
                            }}
                        />

                        <UsersTable
                            users={filteredUsers}
                            currentPage={traders.current_page}
                            usersPerPage={traders.per_page}
                            openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
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

            {isPopupOpen && (
                <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
                    <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold">Crear Nuevo Usuario</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                    <option>Admin</option>
                                    <option>Editor</option>
                                    <option>Viewer</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closePopup}
                                    className="mr-2 rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
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
    users: Trader[];
    currentPage: number;
    usersPerPage: number;
    openMenuId: string | null;
    setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
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
        const aValue = a[sortField as keyof Trader];
        const bValue = b[sortField as keyof Trader];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
            return sortDirection === 'asc' ? (aValue === bValue ? 0 : aValue ? -1 : 1) : aValue === bValue ? 0 : aValue ? 1 : -1;
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
                            className="w-[120px] cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-200"
                            onClick={() => handleSort('name')}
                        >
                            <div className="inline-flex cursor-pointer items-center gap-x-2">
                                <span>Nombre</span>
                                {sortField === 'name' && (sortDirection === 'asc' ? <FaAngleUp /> : <FaAngleDown />)}
                            </div>
                        </th>
                        <th
                            className="w-[250px] cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-200"
                            onClick={() => handleSort('code')}
                        >
                            <div className="inline-flex items-center gap-x-2">
                                <span>Código</span>
                                {sortField === 'code' && (sortDirection === 'asc' ? <FaAngleUp /> : <FaAngleDown />)}
                            </div>
                        </th>
                        <th
                            className="w-[350px] cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-200"
                            onClick={() => handleSort('ubication_name')}
                        >
                            <div className="inline-flex cursor-pointer items-center gap-x-2">
                                <span>Ubicación</span>
                                {sortField === 'ubication_name' && (sortDirection === 'asc' ? <FaAngleUp /> : <FaAngleDown />)}
                            </div>
                        </th>
                        <th
                            className="w-[100px] cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-200"
                            onClick={() => handleSort('status')}
                        >
                            <div className="inline-flex cursor-pointer items-center gap-x-2">
                                <span>Estado</span>
                                {sortField === 'status' && (sortDirection === 'asc' ? <FaAngleUp /> : <FaAngleDown />)}
                            </div>
                        </th>
                        <th className="w-[100px] px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {sortedUsers.length > 0 ? (
                        sortedUsers.map((trader, index) => (
                            <tr key={trader.id} className="hover:bg-gray-50">
                                <td className="w-[50px] px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    {(currentPage - 1) * usersPerPage + index + 1}
                                </td>
                                <td className="w-[250px] px-4 py-3 text-left text-sm font-medium text-gray-700">{trader.name}</td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">{trader.code}</td>
                                <td className="w-[120px] px-4 py-3 text-left text-sm text-gray-700">{trader.ubication_name}</td>
                                <td className="w-[120px] px-4 py-3 text-left text-sm text-gray-700">{trader.status ? 'ACTIVO' : 'INACTIVO'}</td>
                                <td className="relative w-[100px] px-4 py-3 text-right text-sm font-medium">
                                    <button
                                        onClick={() => setOpenMenuId(openMenuId === trader.id ? null : trader.id)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                        </svg>
                                    </button>

                                    {openMenuId === trader.id && (
                                        <div
                                            ref={menuRef}
                                            className="absolute right-0 z-50 mt-2 w-32 rounded border border-gray-200 bg-white shadow-md"
                                        >
                                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Ver</button>
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
