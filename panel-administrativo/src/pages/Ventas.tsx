import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, Eye, X } from 'lucide-react';
import BackToDashboard from '../components/BackToDashboard';

interface Venta {
  id_venta: number;
  fecha_venta: string;
  total: number;
  metodo_pago: string;
  cliente_id?: number;
  empleado_id?: number;
  estado: string;
  detalles: VentaDetalle[];
}

interface VentaDetalle {
  id_detalle_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: {
    descripcion: string;
  };
}

const Ventas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterPayment, setFilterPayment] = useState<string>('todos');
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Simular datos de ventas (en producción esto vendría de la API)
  useEffect(() => {
    const mockVentas: Venta[] = [
      {
        id_venta: 1,
        fecha_venta: '2024-01-15T10:30:00',
        total: 150.00,
        metodo_pago: 'efectivo',
        estado: 'completada',
        detalles: [
          {
            id_detalle_venta: 1,
            id_producto: 1,
            cantidad: 2,
            precio_unitario: 75.00,
            subtotal: 150.00,
            producto: { descripcion: 'Camiseta Básica' }
          }
        ]
      },
      {
        id_venta: 2,
        fecha_venta: '2024-01-15T11:15:00',
        total: 89.99,
        metodo_pago: 'tarjeta',
        estado: 'completada',
        detalles: [
          {
            id_detalle_venta: 2,
            id_producto: 2,
            cantidad: 1,
            precio_unitario: 89.99,
            subtotal: 89.99,
            producto: { descripcion: 'Pantalón Vaquero' }
          }
        ]
      },
      {
        id_venta: 3,
        fecha_venta: '2024-01-15T14:20:00',
        total: 200.00,
        metodo_pago: 'transferencia',
        estado: 'anulada',
        detalles: [
          {
            id_detalle_venta: 3,
            id_producto: 3,
            cantidad: 1,
            precio_unitario: 200.00,
            subtotal: 200.00,
            producto: { descripcion: 'Abrigo de Invierno' }
          }
        ]
      }
    ];

    setVentas(mockVentas);
    setLoading(false);
  }, []);

  // Filtrar ventas
  const filteredVentas = ventas.filter(venta => {
    const matchesSearch = venta.id_venta.toString().includes(searchTerm) ||
                         venta.metodo_pago.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || venta.estado === filterStatus;
    const matchesPayment = filterPayment === 'todos' || venta.metodo_pago === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calcular estadísticas
  const totalVentas = ventas.length;
  const totalIngresos = ventas
    .filter(v => v.estado === 'completada')
    .reduce((sum, v) => sum + v.total, 0);
  const ventasAnuladas = ventas.filter(v => v.estado === 'anulada').length;

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  // Obtener color del badge según estado
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'anulada':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener color del badge según método de pago
  const getPaymentColor = (metodo: string) => {
    switch (metodo) {
      case 'efectivo':
        return 'bg-green-100 text-green-800';
      case 'tarjeta':
        return 'bg-blue-100 text-blue-800';
      case 'transferencia':
        return 'bg-purple-100 text-purple-800';
      case 'qr':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Ventas</h1>
          <p className="text-gray-600">Administra y analiza todas las ventas del sistema</p>
        </div>
        <BackToDashboard />
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Ventas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalVentas}
                  </dd>
                  <dd className="text-sm text-gray-600 mt-1">
                    Ventas realizadas hoy
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ingresos Totales
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalIngresos.toFixed(2)}
                  </dd>
                  <dd className="text-sm text-gray-600 mt-1">
                    Ingresos del día
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ventas Anuladas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {ventasAnuladas}
                  </dd>
                  <dd className="text-sm text-gray-600 mt-1">
                    Ventas canceladas
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">🔍 Filtros de Búsqueda</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID o método de pago..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="todos">Todos los estados</option>
              <option value="completada">Completada</option>
              <option value="anulada">Anulada</option>
              <option value="pendiente">Pendiente</option>
            </select>

            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="todos">Todos los métodos</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="qr">QR</option>
            </select>

            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">📋 Lista de Ventas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Venta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método de Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVentas.map((venta) => (
                  <tr key={venta.id_venta} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{venta.id_venta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(venta.fecha_venta)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ${venta.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentColor(venta.metodo_pago)}`}>
                        {venta.metodo_pago}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(venta.estado)}`}>
                        {venta.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedVenta(venta);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Detalles
                        </button>
                        
                        {venta.estado === 'completada' && (
                          <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Anular
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredVentas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No se encontraron ventas con los filtros aplicados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedVenta && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles de Venta #{selectedVenta.id_venta}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fecha:</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedVenta.fecha_venta)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total:</label>
                    <p className="text-sm font-bold text-gray-900">${selectedVenta.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Método de Pago:</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentColor(selectedVenta.metodo_pago)}`}>
                      {selectedVenta.metodo_pago}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado:</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedVenta.estado)}`}>
                      {selectedVenta.estado}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Productos:</label>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedVenta.detalles.map((detalle) => (
                          <tr key={detalle.id_detalle_venta}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {detalle.producto?.descripcion || `Producto ${detalle.id_producto}`}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">{detalle.cantidad}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">${detalle.precio_unitario.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">${detalle.subtotal.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;
