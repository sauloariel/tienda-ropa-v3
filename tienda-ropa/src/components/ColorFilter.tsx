import React from 'react';
import { Palette, X } from 'lucide-react';

interface ColorFilterProps {
  colores: string[];
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({
  colores,
  selectedColors,
  onColorChange
}) => {
  const handleColorClick = (color: string) => {
    if (selectedColors.includes(color)) {
      // Remover color si ya está seleccionado
      onColorChange(selectedColors.filter(c => c !== color));
    } else {
      // Agregar color si no está seleccionado
      onColorChange([...selectedColors, color]);
    }
  };

  const clearColorFilters = () => {
    onColorChange([]);
  };

  // Mapear nombres de colores a códigos de color
  const getColorCode = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'rojo': '#ef4444',
      'azul': '#3b82f6',
      'verde': '#10b981',
      'amarillo': '#f59e0b',
      'negro': '#1f2937',
      'blanco': '#f9fafb',
      'gris': '#6b7280',
      'rosa': '#ec4899',
      'morado': '#8b5cf6',
      'naranja': '#f97316',
      'celeste': '#06b6d4',
      'marrón': '#a3a3a3',
      'beige': '#f5f5dc',
      'violeta': '#8b5cf6',
      'turquesa': '#14b8a6',
      'coral': '#ff7f7f',
      'lila': '#d8b4fe',
      'dorado': '#fbbf24',
      'plateado': '#9ca3af'
    };
    return colorMap[colorName.toLowerCase()] || '#6b7280';
  };

  // Obtener colores únicos
  const uniqueColors = [...new Set(colores)].sort();

  if (uniqueColors.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header del filtro */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Colores</h3>
        </div>
        
        {selectedColors.length > 0 && (
          <button
            onClick={clearColorFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <X className="h-3 w-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Colores disponibles */}
      <div className="space-y-3">
        <div className="text-sm text-gray-600 mb-3">
          {selectedColors.length > 0 
            ? `${selectedColors.length} color${selectedColors.length !== 1 ? 'es' : ''} seleccionado${selectedColors.length !== 1 ? 's' : ''}`
            : 'Selecciona colores para filtrar'
          }
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {uniqueColors.map((color) => {
            const isSelected = selectedColors.includes(color);
            
            return (
              <button
                key={color}
                onClick={() => handleColorClick(color)}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: getColorCode(color) }}
                />
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {color}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Colores seleccionados */}
      {selectedColors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Colores seleccionados:</div>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((color) => (
              <div
                key={color}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColorCode(color) }}
                />
                <span>{color}</span>
                <button
                  onClick={() => handleColorClick(color)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorFilter;





