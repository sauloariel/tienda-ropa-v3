import React from 'react';
import { Filter, X } from 'lucide-react';
import type { Categoria } from '../types/productos.types';

interface CategoryFilterProps {
  categorias: Categoria[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categorias,
  selectedCategory,
  onCategoryChange
}) => {
  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      onCategoryChange(null); // Deseleccionar si ya está seleccionada
    } else {
      onCategoryChange(categoryId);
    }
  };

  const clearFilters = () => {
    onCategoryChange(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header del filtro */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        
        {selectedCategory && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <X className="h-3 w-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Categorías */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 mb-3">Categorías</h4>
        
        {/* Opción "Todas las categorías" */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="font-medium">Todas las categorías</span>
          <span className="text-sm text-gray-500 ml-2">
            ({categorias.length})
          </span>
        </button>

        {/* Lista de categorías */}
        {categorias.map((categoria) => (
          <button
            key={categoria.id_categoria}
            onClick={() => handleCategoryClick(categoria.id_categoria)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === categoria.id_categoria
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{categoria.nombre_categoria}</span>
              {categoria.descripcion && (
                <span className="text-xs text-gray-500">
                  {categoria.descripcion}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Filtros adicionales (placeholder para futuras funcionalidades) */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Precio</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1000"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>
      </div>

      {/* Filtros de talles (placeholder) */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Talles</h4>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((talle) => (
            <button
              key={talle}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {talle}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros de colores (placeholder) */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Colores</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Negro', color: 'bg-black' },
            { name: 'Blanco', color: 'bg-white border border-gray-300' },
            { name: 'Azul', color: 'bg-blue-500' },
            { name: 'Rojo', color: 'bg-red-500' },
            { name: 'Verde', color: 'bg-green-500' },
            { name: 'Amarillo', color: 'bg-yellow-400' }
          ].map((colorOption) => (
            <button
              key={colorOption.name}
              className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`w-4 h-4 rounded-full ${colorOption.color}`}></div>
              <span>{colorOption.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
