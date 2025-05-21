import React from 'react';

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onActionButtonClick: () => void;
  actionButtonName: string;
}

export default function SearchControls({
  searchTerm,
  onSearchChange,
  onActionButtonClick,
  actionButtonName,
}: SearchControlsProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4 px-6">
      <div className="flex items-center gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-[#005A26] focus:border-[#005A26] sm:text-sm"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar"
          />
        </div>
      </div>

      <button
        onClick={onActionButtonClick}
        className="px-4 py-2 bg-[#001276] text-white rounded-md hover:bg-[#00471E] text-sm font-semibold flex items-center gap-2 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm7 14a1 1 0 110-2 1 1 0 010 2zm1-4H8a1 1 0 010-2h5a1 1 0 010 2z" />
        </svg>
        {actionButtonName}
      </button>
    </div>
  );
}