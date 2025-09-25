import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  startIndex,
  endIndex,
  totalItems
}) => {
  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Máximo 5 números de página visibles
    
    if (totalPages <= maxVisible) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      if (currentPage <= 3) {
        // Al inicio
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Al final
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // En el medio
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null; // No mostrar paginación si hay una página o menos
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
      {/* Información de resultados */}
      <div className="text-sm text-gray-600">
        Mostrando {startIndex} a {endIndex} de {totalItems} productos
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón anterior */}
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            canGoPrev
              ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            canGoNext
              ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;



