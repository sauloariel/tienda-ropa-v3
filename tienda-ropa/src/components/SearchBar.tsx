import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useProductSearch } from '../hooks/useProductSearch';
import type { Producto } from '../types/productos.types';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  
  const {
    query,
    setQuery,
    resultados,
    cargando,
    buscarProductos,
    limpiarBusqueda
  } = useProductSearch();

  // Debounce para evitar muchas llamadas a la API
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        buscarProductos(query.trim());
        setMostrarResultados(true);
      } else {
        setMostrarResultados(false);
      }
    }, 300); // Esperar 300ms después de que el usuario deje de escribir

    return () => clearTimeout(timeoutId);
  }, [query, buscarProductos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // También actualizar el filtro local
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    limpiarBusqueda();
    setMostrarResultados(false);
    onSearch('');
  };

  const handleProductoClick = (producto: Producto) => {
    setQuery(producto.descripcion);
    onSearch(producto.descripcion);
    setMostrarResultados(false);
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Icono de búsqueda */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          {/* Input de búsqueda */}
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay para permitir clics en resultados
              setTimeout(() => setIsFocused(false), 200);
            }}
            placeholder="Buscar productos, marcas, categorías..."
            className="w-full pl-10 pr-12 py-3 text-lg bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
          />

          {/* Botón de limpiar */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {/* Resultados de búsqueda */}
      {isFocused && (query.length >= 2 || resultados.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {cargando ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Buscando en la base de datos...</p>
            </div>
          ) : resultados.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Resultados de búsqueda ({resultados.length})
              </div>
              {resultados.map((producto) => (
                <button
                  key={producto.id_producto}
                  onClick={() => handleProductoClick(producto)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {producto.descripcion}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Código: {producto.id_producto} | Stock: {producto.stock}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-blue-600">
                        ${parseFloat(producto.precio_venta).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No se encontraron productos</p>
              <p className="text-xs">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-3">Escribe al menos 2 caracteres para buscar</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;