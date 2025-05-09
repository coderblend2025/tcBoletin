interface SearchControlsProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    usersPerPage: 5 | 10 | 20 | 50;
    onUsersPerPageChange: (value: 5 | 10 | 20 | 50) => void;
}

export default function SearchControls({
    searchTerm,
    onSearchChange,
    usersPerPage,
    onUsersPerPageChange
}: SearchControlsProps) {
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value) as 5 | 10 | 20 | 50;
        onUsersPerPageChange(value);
    };

    return (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#005A26]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#005A26] focus:border-[#005A26] sm:text-sm"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Buscar usuarios"
                />
            </div>

            <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2 bg-white">
                <span className="text-sm text-[#005A26]">Mostrar:</span>
                <select
                    className="block w-20 pl-0.3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#005A26] focus:border-[#005A26] sm:text-sm rounded-md"
                    value={usersPerPage}
                    onChange={handlePerPageChange}
                    aria-label="Usuarios por página"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <span className="text-sm text-[#005A26]">por página</span>
            </div>
        </div>
    );
}