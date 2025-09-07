import React, { useState } from 'react';
import { Percent, Tag, X, Plus, Minus } from 'lucide-react';

interface Descuento {
  id: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number;
  descripcion: string;
}

interface DescuentosManagerProps {
  total: number;
  onDescuentoAplicado: (descuento: Descuento | null) => void;
  descuentoActual?: Descuento | null;
}

const DescuentosManager: React.FC<DescuentosManagerProps> = ({
  total,
  onDescuentoAplicado,
  descuentoActual
}) => {
  const [mostrarDescuentos, setMostrarDescuentos] = useState(false);
  const [descuentoPersonalizado, setDescuentoPersonalizado] = useState({
    tipo: 'porcentaje' as 'porcentaje' | 'fijo',
    valor: 0,
    descripcion: ''
  });

  // Descuentos predefinidos
  const descuentosPredefinidos: Descuento[] = [
    { id: '5%', tipo: 'porcentaje', valor: 5, descripcion: '5% de descuento' },
    { id: '10%', tipo: 'porcentaje', valor: 10, descripcion: '10% de descuento' },
    { id: '15%', tipo: 'porcentaje', valor: 15, descripcion: '15% de descuento' },
    { id: '20%', tipo: 'porcentaje', valor: 20, descripcion: '20% de descuento' },
    { id: '$50', tipo: 'fijo', valor: 50, descripcion: '$50 de descuento' },
    { id: '$100', tipo: 'fijo', valor: 100, descripcion: '$100 de descuento' },
    { id: '$200', tipo: 'fijo', valor: 200, descripcion: '$200 de descuento' }
  ];

  // Calcular descuento aplicado
  const calcularDescuento = (descuento: Descuento): number => {
    if (descuento.tipo === 'porcentaje') {
      return (total * descuento.valor) / 100;
    } else {
      return Math.min(descuento.valor, total);
    }
  };

  // Aplicar descuento
  const aplicarDescuento = (descuento: Descuento) => {
    onDescuentoAplicado(descuento);
    setMostrarDescuentos(false);
  };

  // Aplicar descuento personalizado
  const aplicarDescuentoPersonalizado = () => {
    if (descuentoPersonalizado.valor <= 0) return;

    const descuento: Descuento = {
      id: `custom_${Date.now()}`,
      tipo: descuentoPersonalizado.tipo,
      valor: descuentoPersonalizado.valor,
      descripcion: descuentoPersonalizado.descripcion || 
        (descuentoPersonalizado.tipo === 'porcentaje' 
          ? `${descuentoPersonalizado.valor}% de descuento`
          : `$${descuentoPersonalizado.valor} de descuento`)
    };

    onDescuentoAplicado(descuento);
    setMostrarDescuentos(false);
    setDescuentoPersonalizado({
      tipo: 'porcentaje',
      valor: 0,
      descripcion: ''
    });
  };

  // Remover descuento
  const removerDescuento = () => {
    onDescuentoAplicado(null);
  };

  // Validar descuento personalizado
  const esDescuentoValido = () => {
    if (descuentoPersonalizado.valor <= 0) return false;
    
    if (descuentoPersonalizado.tipo === 'fijo') {
      return descuentoPersonalizado.valor <= total;
    }
    
    return descuentoPersonalizado.valor <= 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Percent className="w-5 h-5 mr-2" />
          Descuentos y Promociones
        </h3>
        {descuentoActual && (
          <button
            onClick={removerDescuento}
            className="text-red-500 hover:text-red-700 p-1"
            title="Remover descuento"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {descuentoActual ? (
        // Descuento aplicado
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-green-800">
                {descuentoActual.descripcion}
              </h4>
              <p className="text-sm text-green-600">
                Descuento: ${calcularDescuento(descuentoActual).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-800">
                -${calcularDescuento(descuentoActual).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Sin descuento aplicado
        <div className="space-y-4">
          {/* Botón para mostrar descuentos */}
          <button
            onClick={() => setMostrarDescuentos(!mostrarDescuentos)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Tag className="w-4 h-4 mr-2" />
            Aplicar Descuento
          </button>

          {/* Descuentos predefinidos */}
          {mostrarDescuentos && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Descuentos Rápidos:</h4>
              <div className="grid grid-cols-2 gap-2">
                {descuentosPredefinidos.map((descuento) => (
                  <button
                    key={descuento.id}
                    onClick={() => aplicarDescuento(descuento)}
                    className="p-2 text-sm border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium">{descuento.descripcion}</div>
                    <div className="text-xs text-gray-600">
                      -${calcularDescuento(descuento).toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>

              {/* Descuento personalizado */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Descuento Personalizado:</h4>
                
                <div className="space-y-3">
                  {/* Tipo de descuento */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tipo de descuento
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setDescuentoPersonalizado({...descuentoPersonalizado, tipo: 'porcentaje'})}
                        className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                          descuentoPersonalizado.tipo === 'porcentaje'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700'
                        }`}
                      >
                        Porcentaje
                      </button>
                      <button
                        onClick={() => setDescuentoPersonalizado({...descuentoPersonalizado, tipo: 'fijo'})}
                        className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                          descuentoPersonalizado.tipo === 'fijo'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700'
                        }`}
                      >
                        Monto Fijo
                      </button>
                    </div>
                  </div>

                  {/* Valor del descuento */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Valor
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setDescuentoPersonalizado({
                          ...descuentoPersonalizado,
                          valor: Math.max(0, descuentoPersonalizado.valor - 1)
                        })}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={descuentoPersonalizado.valor}
                        onChange={(e) => setDescuentoPersonalizado({
                          ...descuentoPersonalizado,
                          valor: Math.max(0, parseFloat(e.target.value) || 0)
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={descuentoPersonalizado.tipo === 'porcentaje' ? '0-100' : '0'}
                        max={descuentoPersonalizado.tipo === 'porcentaje' ? 100 : total}
                      />
                      <button
                        onClick={() => setDescuentoPersonalizado({
                          ...descuentoPersonalizado,
                          valor: descuentoPersonalizado.valor + 1
                        })}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Descripción opcional */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Descripción (opcional)
                    </label>
                    <input
                      type="text"
                      value={descuentoPersonalizado.descripcion}
                      onChange={(e) => setDescuentoPersonalizado({
                        ...descuentoPersonalizado,
                        descripcion: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Descuento por cliente frecuente"
                    />
                  </div>

                  {/* Botón aplicar */}
                  <button
                    onClick={aplicarDescuentoPersonalizado}
                    disabled={!esDescuentoValido()}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Aplicar Descuento Personalizado
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DescuentosManager;
