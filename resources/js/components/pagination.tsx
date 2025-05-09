interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
}: PaginationProps) {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="px-6 py-1 border-t0-4 border-gray-200 flex flex-col gap-4 items-center">
            {/* Texto de "Mostrando X de X usuarios" dentro de un cuadro */}
            <div className="bg-white border border-gray-300 rounded-md px-4 py-2 shadow-sm">
                <span className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                    <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span> de{' '}
                    <span className="font-medium">{totalItems}</span> usuarios
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-1 border rounded-md text-sm font-medium 
                        ${currentPage === 1
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    Anterior
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1 border rounded-md text-sm font-medium 
                                    ${currentPage === pageNum
                                        ? 'bg-[#005A26] text-white border-[#00471E]'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className={`px-3 py-1 border rounded-md text-sm font-medium 
                                ${currentPage === totalPages
                                    ? 'bg-[#005A26] text-white border-[#00471E]'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {totalPages}
                        </button>
                    )}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 border rounded-md text-sm font-medium 
                        ${currentPage === totalPages
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}