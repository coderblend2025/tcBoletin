import React, { useMemo } from 'react';
import { useTable } from '@tanstack/react-table';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

interface UserTableProps {
    data: User[];
    isLoading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ data, isLoading }) => {
    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Roles',
                accessor: 'roles',
                Cell: ({ value }: { value: string[] }) => value.join(', '),
            },
        ],
        []
    );

    const tableInstance = useTable({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    if (isLoading) {
        return (
            <div>
                <Skeleton count={5} height={40} />
            </div>
        );
    }

    return (
        <table {...getTableProps()} className="min-w-full border-collapse border border-gray-200">
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps()}
                                className="border border-gray-300 px-4 py-2 text-left"
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} className="hover:bg-gray-100">
                            {row.cells.map((cell) => (
                                <td
                                    {...cell.getCellProps()}
                                    className="border border-gray-300 px-4 py-2"
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default UserTable;