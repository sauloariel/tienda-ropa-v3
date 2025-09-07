import React from 'react';
import { Receipt, Clock, User, Percent } from 'lucide-react';

interface FacturaSessionInfoProps {
  numeroFactura: string | null;
  cliente: any | null;
  descuento: any | null;
  total: number;
  itemCount: number;
}

const FacturaSessionInfo: React.FC<FacturaSessionInfoProps> = ({
  numeroFactura,
  cliente,
  descuento,
  total,
  itemCount
}) => {
  if (!numeroFactura) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Receipt className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-800">Factura en Progreso</h3>
        </div>
        <div className="text-sm text-blue-600 font-medium">
          {numeroFactura}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {/* Información del cliente */}
        <div className="flex items-center">
          <User className="w-4 h-4 text-blue-600 mr-2" />
          <div>
            <p className="text-blue-700 font-medium">
              {cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente no seleccionado'}
            </p>
            <p className="text-blue-600 text-xs">
              {cliente ? cliente.telefono || cliente.mail : 'Selecciona un cliente'}
            </p>
          </div>
        </div>

        {/* Descuento aplicado */}
        <div className="flex items-center">
          <Percent className="w-4 h-4 text-blue-600 mr-2" />
          <div>
            <p className="text-blue-700 font-medium">
              {descuento ? descuento.descripcion : 'Sin descuento'}
            </p>
            <p className="text-blue-600 text-xs">
              {descuento ? 
                (descuento.tipo === 'porcentaje' ? `${descuento.valor}%` : `$${descuento.valor}`) : 
                'Aplica descuento si es necesario'
              }
            </p>
          </div>
        </div>

        {/* Resumen de la venta */}
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-blue-600 mr-2" />
          <div>
            <p className="text-blue-700 font-medium">
              {itemCount} producto{itemCount !== 1 ? 's' : ''}
            </p>
            <p className="text-blue-600 text-xs">
              Total: ${total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-600 text-center">
          Esta factura mantendrá el mismo número durante toda la sesión de venta
        </p>
      </div>
    </div>
  );
};

export default FacturaSessionInfo;
