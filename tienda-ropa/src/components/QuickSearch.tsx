import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, X, Clock, TrendingUp } from 'lucide-react';
import { useProductSearch } from '../hooks/useProductSearch';
import type { Producto } from '../types/productos.types';

interface QuickSearchProps {
  onProductoSeleccionado: (producto: Producto) => void;
  placeholder?: string;
}

const QuickSearch: React.FC<QuickSearchProps> = ({ 
  onProductoSeleccionado, 
  placeholder = "Buscar productos por nombre o código..." 
}) => {
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [busquedasRecientes, setBusquedasRecientes] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query: busqueda,
    setQuery: setBusqueda,
    resultados,
    cargando,
    buscarProductos,
    limpiarBusqueda
  } = useProductSearch();

  // Cargar búsquedas recientes al montar el componente
  useEffect(() => {
    cargarBusquedasRecientes();
  }, []);

  // Cargar búsquedas recientes desde localStorage
  const cargarBusquedasRecientes = () => {
    const recientes = localStorage.getItem('busquedasRecientes');
    if (recientes) {
      setBusquedasRecientes(JSON.parse(recientes));
    }
  };

  // Guardar búsqueda reciente
  const guardarBusquedaReciente = (query: string) => {
    if (!query.trim()) return;
    
    const nuevasBusquedas = [query, ...busquedasRecientes.filter(b => b !== query)].slice(0, 5);
    setBusquedasRecientes(nuevasBusquedas);
    localStorage.setItem('busquedasRecientes', JSON.stringify(nuevasBusquedas));
  };

  // Búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (busqueda.trim()) {
        buscarProductos(busqueda.trim());
        setMostrarResultados(true);
      } else {
        setMostrarResultados(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [busqueda, buscarProductos]);

  // Manejar cambio en la búsqueda
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    console.log('📝 QuickSearch - Cambio en búsqueda:', query);
    setBusqueda(query);
  };

  // Manejar selección de producto
  const handleProductoSeleccionado = (producto: Producto) => {
    onProductoSeleccionado(producto);
    setBusqueda('');
    setMostrarResultados(false);
    guardarBusquedaReciente(producto.descripcion);
  };

  // Manejar búsqueda reciente
  const handleBusquedaReciente = (query: string) => {
    setBusqueda(query);
    buscarProductos(query);
  };

  // Limpiar búsqueda
  const limpiarBusquedaLocal = () => {
    limpiarBusqueda();
    setMostrarResultados(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Manejar teclas especiales
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMostrarResultados(false);
    }
  };

  // Obtener el estado del stock
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', text: 'Sin stock' };
    if (stock <= 5) return { color: 'text-yellow-600', text: 'Stock bajo' };
    return { color: 'text-green-600', text: 'Disponible' };
  };

  return (
    <div className="relative w-full">
      {/* Input de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={busqueda}
          onChange={handleBusquedaChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setMostrarResultados(true)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {busqueda && (
          <button
            onClick={limpiarBusquedaLocal}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {mostrarResultados && busqueda && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {cargando ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Buscando en la base de datos...</p>
            </div>
          ) : (
            // Resultados de búsqueda
            <div>
              {resultados.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Resultados de búsqueda ({resultados.length})
                  </div>
                  {resultados.map((producto) => {
                    const stockStatus = getStockStatus(producto.stock);
                    return (
                      <div
                        key={producto.id_producto}
                        onClick={() => handleProductoSeleccionado(producto)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {producto.descripcion}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              Código: {producto.id_producto}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-semibold text-blue-600">
                              ${parseFloat(producto.precio_venta).toFixed(2)}
                            </p>
                            <p className={`text-xs ${stockStatus.color}`}>
                              {stockStatus.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No se encontraron productos</p>
                  <p className="text-xs">Intenta con otros términos de búsqueda</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickSearch;