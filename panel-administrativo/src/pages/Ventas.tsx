import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, Eye, X, FileText } from 'lucide-react';
import { facturasAPI, type Factura } from '../services/facturas';


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
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterPayment, setFilterPayment] = useState<string>('todos');
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar facturas desde la API
  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await facturasAPI.getFacturas();
        
        // Asegurar que siempre tengamos un array
        if (Array.isArray(data)) {
          console.log('📊 Facturas cargadas:', data.length);
          console.log('🔍 Primera factura:', data[0]);
          setFacturas(data);
        } else {
          console.warn('⚠️ Datos de facturas no son un array:', data);
          setFacturas([]);
        }
      } catch (error) {
        console.error('Error cargando facturas:', error);
        setError('Error al cargar las facturas');
        setFacturas([]);
      } finally {
        setLoading(false);
      }
    };

    cargarFacturas();
  }, []);

  // Filtrar facturas
  const filteredFacturas = Array.isArray(facturas) ? facturas.filter(factura => {
    const matchesSearch = factura.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         factura.metodo_pago.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (factura.cliente?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || factura.estado === filterStatus;
    const matchesPayment = filterPayment === 'todos' || factura.metodo_pago === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  }) : [];

  // Calcular estadísticas
  const totalVentas = Array.isArray(facturas) ? facturas.length : 0;
  const totalIngresos = Array.isArray(facturas) ? facturas
    .filter(f => f.estado === 'activa' || f.estado === 'pagada')
    .reduce((sum, f) => {
      const total = typeof f.total === 'number' ? f.total : parseFloat(f.total) || 0;
      console.log('💰 Procesando factura:', f.numeroFactura, 'total:', f.total, 'tipo:', typeof f.total, 'convertido:', total);
      return sum + total;
    }, 0) : 0;
  const ventasAnuladas = Array.isArray(facturas) ? facturas.filter(f => f.estado === 'anulada').length : 0;
  
  console.log('📊 Estadísticas calculadas:', { totalVentas, totalIngresos, ventasAnuladas, tipoTotalIngresos: typeof totalIngresos });

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  // Obtener color del badge según estado
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'pagada':
        return 'bg-blue-100 text-blue-800';
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
          <p className="text-gray-600">Administra y analiza todas las facturas del sistema</p>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

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
                    ${(typeof totalIngresos === 'number' ? totalIngresos : 0).toFixed(2)}
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
              <option value="activa">Activa</option>
              <option value="pagada">Pagada</option>
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
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">📋 Lista de Facturas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número Factura
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
                {filteredFacturas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {factura.numeroFactura}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(factura.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ${(typeof factura.total === 'number' ? factura.total : parseFloat(factura.total) || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentColor(factura.metodo_pago)}`}>
                        {factura.metodo_pago}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(factura.estado)}`}>
                        {factura.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedFactura(factura);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Detalles
                        </button>
                        
                        <button
                          onClick={() => facturasAPI.downloadFactura(factura.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Descargar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredFacturas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No se encontraron facturas con los filtros aplicados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedFactura && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles de Factura {selectedFactura.numeroFactura}
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
                    <p className="text-sm text-gray-900">{formatDate(selectedFactura.fecha)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total:</label>
                    <p className="text-sm font-bold text-gray-900">${(typeof selectedFactura.total === 'number' ? selectedFactura.total : parseFloat(selectedFactura.total) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Método de Pago:</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentColor(selectedFactura.metodo_pago)}`}>
                      {selectedFactura.metodo_pago}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado:</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedFactura.estado)}`}>
                      {selectedFactura.estado}
                    </span>
                  </div>
                  {selectedFactura.cliente && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Cliente:</label>
                      <p className="text-sm text-gray-900">{selectedFactura.cliente.nombre} {selectedFactura.cliente.apellido}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => facturasAPI.downloadFactura(selectedFactura.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </button>
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

