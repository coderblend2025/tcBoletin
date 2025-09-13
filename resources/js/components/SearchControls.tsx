import React from 'react';

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  itemsPerPage: 5 | 10 | 20 | 50;
  onItemsPerPageChange: (value: 5 | 10 | 20 | 50) => void;
  onActionButtonClick: () => void;
  actionButtonName: string;
}

export default function SearchControls({
  searchTerm,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  onActionButtonClick,
  actionButtonName,
}: SearchControlsProps) {

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10) as 5 | 10 | 20 | 50;
    onItemsPerPageChange(value);
  };

  return (
    <div className="mb-3 px-3 sm:px-6">
      {/* Contenedor responsive: columna en móvil, fila en >= sm */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Grupo izquierda: buscador + selector */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          {/* Buscador */}
          <div className="relative w-full sm:w-64 md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-400 focus:border-[#005A26] focus:outline-none focus:ring-[#005A26] text-sm"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Buscar"
            />
          </div>

          {/* Selector items por página */}
          <div className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white sm:w-auto sm:justify-start">
            <span className="px-3 py-2 text-sm text-gray-700">Mostrar:</span>
            <select
              className="w-28 rounded-md border border-transparent px-2 py-2 text-sm focus:border-[#005A26] focus:outline-none focus:ring-[#005A26] bg-white"
              value={itemsPerPage}
              onChange={handlePerPageChange}
              aria-label="Items por página"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="px-3 py-2 text-sm text-gray-700 hidden xs:inline">por página</span>
          </div>
        </div>

        {/* Botón de acción: full width en móvil, auto en >= sm */}
        <button
          onClick={onActionButtonClick}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#001276] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00471E] focus:outline-none focus:ring-2 focus:ring-[#00471E] focus:ring-offset-2 sm:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm7 14a1 1 0 110-2 1 1 0 010 2zm1-4H8a1 1 0 010-2h5a1 1 0 010 2z" />
          </svg>
          <span className="truncate">{actionButtonName}</span>
        </button>
      </div>
    </div>
  );
}
