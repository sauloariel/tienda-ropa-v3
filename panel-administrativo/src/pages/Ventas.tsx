import { useState, useEffect } from 'react';
import { Search, X, FileText } from 'lucide-react';
import { facturasAPI, type Factura } from '../services/facturas';



const Ventas = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterPayment, setFilterPayment] = useState<string>('todos');
  const [selectedFactura] = useState<Factura | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar facturas desde la API
  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await facturasAPI.getFacturas();
        
        // La API devuelve { success: true, facturas: [...] }
        const data = (response as any)?.facturas || response;
        
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
      case 'cbu':
        return 'bg-purple-100 text-purple-800';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full px-2 py-6 space-y-8">
        {/* Header Principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Ventas</h1>
              <p className="text-lg text-gray-600 mt-2">Administra y analiza todas las facturas del sistema</p>
            </div>
          </div>
        </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}


        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6 z-30">
          <div className="px-8 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Filtros y Búsqueda</h3>
            <p className="text-sm text-gray-600 mt-1">Encuentra facturas específicas</p>
          </div>
        
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Facturas
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar por ID o método de pago..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    aria-label="Buscar facturas"
                  />
                </div>
              </div>
              
              <div className="lg:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Estado
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  aria-label="Filtrar por estado"
                >
                  <option value="todos">📊 Todos los estados</option>
                  <option value="activa">🟢 Activa</option>
                  <option value="pagada">🔵 Pagada</option>
                  <option value="anulada">🔴 Anulada</option>
                  <option value="pendiente">🟡 Pendiente</option>
                </select>
              </div>

              <div className="lg:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Pago
                </label>
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  aria-label="Filtrar por método de pago"
                >
                  <option value="todos">💳 Todos los métodos</option>
                  <option value="efectivo">💵 Efectivo</option>
                  <option value="cbu">🏦 CBU</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Ventas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Lista de Facturas</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredFacturas.length} factura{filteredFacturas.length !== 1 ? 's' : ''} encontrada{filteredFacturas.length !== 1 ? 's' : ''}
            </p>
          </div>
        
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Factura</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Cliente</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Total</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Pago</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Estado</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Fecha</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFacturas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-lg font-medium mb-2">No se encontraron facturas</div>
                        <div className="text-sm">Intenta ajustar los filtros de búsqueda</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredFacturas.map((factura) => (
                    <tr key={factura.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            #{factura.id}
                          </div>
                          <div className="text-xs text-gray-500 truncate" title={factura.numeroFactura}>
                            {factura.numeroFactura}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate" title={factura.cliente ? `${factura.cliente.nombre} ${factura.cliente.apellido}` : 'Cliente N/A'}>
                            {factura.cliente ? `${factura.cliente.nombre} ${factura.cliente.apellido}` : 'Cliente N/A'}
                          </div>
                          <div className="text-xs text-gray-500 truncate" title={(factura.cliente as any)?.mail || 'Email N/A'}>
                            {(factura.cliente as any)?.mail || 'Email N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm font-medium text-gray-900 text-right">
                          ${(typeof factura.total === 'number' ? factura.total : parseFloat(factura.total) || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentColor(factura.metodo_pago)}`}>
                          {factura.metodo_pago}
                        </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(factura.estado)}`}>
                          {factura.estado}
                        </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-500 text-center">
                        {formatDate(factura.fecha)}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => {
                              try {
                                console.log('Abriendo factura:', factura);
                                const facturaWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
                                if (facturaWindow) {
                                  facturaWindow.document.write(`
                                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                      <title>Factura #${factura.numeroFactura || factura.id}</title>
                                      <meta charset="UTF-8">
                                      <style>
                                        body { 
                                          font-family: Arial, sans-serif; 
                                          margin: 20px; 
                                          background: white; 
                                          line-height: 1.4;
                                        }
                                        .header { 
                                          text-align: center; 
                                          border-bottom: 2px solid #333; 
                                          padding-bottom: 20px; 
                                          margin-bottom: 30px; 
                                        }
                                        .company-info { margin-bottom: 20px; }
                                        .invoice-details { 
                                          display: flex; 
                                          justify-content: space-between; 
                                          margin-bottom: 30px; 
                                        }
                                        .client-info, .invoice-info { width: 45%; }
                                        .table { 
                                          width: 100%; 
                                          border-collapse: collapse; 
                                          margin-bottom: 30px; 
                                        }
                                        .table th, .table td { 
                                          border: 1px solid #ddd; 
                                          padding: 12px; 
                                          text-align: left; 
                                        }
                                        .table th { 
                                          background-color: #f5f5f5; 
                                          font-weight: bold; 
                                        }
                                        .total-section { 
                                          text-align: right; 
                                          margin-top: 20px; 
                                        }
                                        .total-amount { 
                                          font-size: 18px; 
                                          font-weight: bold; 
                                          color: #333; 
                                        }
                                        .status-badge { 
                                          display: inline-block; 
                                          padding: 4px 12px; 
                                          border-radius: 20px; 
                                          font-size: 12px; 
                                          font-weight: bold;
                                          text-transform: uppercase;
                                        }
                                        .status-activa { background-color: #d4edda; color: #155724; }
                                        .status-pagada { background-color: #cce5ff; color: #004085; }
                                        .status-anulada { background-color: #f8d7da; color: #721c24; }
                                        .status-pendiente { background-color: #fff3cd; color: #856404; }
                                        .payment-badge {
                                          display: inline-block;
                                          padding: 4px 12px;
                                          border-radius: 20px;
                                          font-size: 12px;
                                          font-weight: bold;
                                          text-transform: uppercase;
                                        }
                                        .payment-efectivo { background-color: #d4edda; color: #155724; }
                                        .payment-tarjeta { background-color: #cce5ff; color: #004085; }
                                        .payment-transferencia { background-color: #e2d9f3; color: #6f42c1; }
                                        .payment-qr { background-color: #ffeaa7; color: #d63031; }
                                        .no-print { 
                                          margin-top: 30px; 
                                          text-align: center; 
                                        }
                                        .btn {
                                          background: #007bff; 
                                          color: white; 
                                          border: none; 
                                          padding: 10px 20px; 
                                          border-radius: 5px; 
                                          cursor: pointer; 
                                          margin: 0 5px;
                                          font-size: 14px;
                                        }
                                        .btn:hover { opacity: 0.8; }
                                        .btn-secondary { background: #6c757d; }
                                        .btn-success { background: #28a745; }
                                        @media print {
                                          body { margin: 0; }
                                          .no-print { display: none; }
                                        }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="header">
                                        <h1>FACTURA</h1>
                                        <div class="company-info">
                                          <h2>Panel Administrativo v2.0</h2>
                                          <p>Sistema de Gestión Comercial</p>
                                        </div>
                                      </div>
                                      
                                      <div class="invoice-details">
                                        <div class="client-info">
                                          <h3>Cliente:</h3>
                                          <p><strong>${factura.cliente ? (factura.cliente.nombre || '') + ' ' + (factura.cliente.apellido || '') : 'Cliente General'}</strong></p>
                                          ${factura.cliente && (factura.cliente as any).email ? `<p>Email: ${(factura.cliente as any).email}</p>` : ''}
                                        </div>
                                        <div class="invoice-info">
                                          <h3>Datos de la Factura:</h3>
                                          <p><strong>Número:</strong> ${factura.numeroFactura || 'F' + factura.id}</p>
                                          <p><strong>Fecha:</strong> ${new Date(factura.fecha).toLocaleDateString('es-ES')}</p>
                                          <p><strong>Estado:</strong> <span class="status-badge status-${factura.estado}">${factura.estado}</span></p>
                                          <p><strong>Método de Pago:</strong> <span class="payment-badge payment-${factura.metodo_pago}">${factura.metodo_pago}</span></p>
                                          ${factura.empleado ? `
                                            <p><strong>Empleado:</strong> ${factura.empleado.nombre || ''} ${factura.empleado.apellido || ''}</p>
                                            <p><strong>Usuario:</strong> ${factura.empleado.usuario || 'N/A'}</p>
                                          ` : `
                                            <p><strong>Empleado:</strong> No disponible</p>
                                          `}
                                        </div>
                                      </div>
                                      
                                      <table class="table">
                                        <thead>
                                          <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unit.</th>
                                            <th>Subtotal</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          ${(factura as any).detalles && (factura as any).detalles.length > 0 ? 
                                            (factura as any).detalles.map((detalle: any) => {
                                              const subtotal = parseFloat(detalle.subtotal) || 0;
                                              const cantidad = parseFloat(detalle.cantidad) || 0;
                                              const precioUnitario = cantidad > 0 ? subtotal / cantidad : 0;
                                              return `
                                                <tr>
                                                  <td>${detalle.producto ? detalle.producto.descripcion : 'Producto'}</td>
                                                  <td>${cantidad}</td>
                                                  <td>$${precioUnitario.toFixed(2)}</td>
                                                  <td>$${subtotal.toFixed(2)}</td>
                                                </tr>
                                              `;
                                            }).join('') : 
                                            '<tr><td colspan="4" style="text-align: center;">No hay detalles disponibles</td></tr>'
                                          }
                                        </tbody>
                                      </table>
                                      
                                      <div class="total-section">
                                        <p class="total-amount">Total: $${(typeof factura.total === 'number' ? factura.total : parseFloat(factura.total) || 0).toFixed(2)}</p>
                                      </div>
                                      
                                      <div class="no-print">
                                        <button onclick="window.print()" class="btn">
                                          🖨️ Imprimir
                                        </button>
                                        <button onclick="window.close()" class="btn btn-secondary">
                                          ❌ Cerrar
                                        </button>
                                        <button onclick="window.location.href='/api/facturas/${factura.id}/pdf'" class="btn btn-success">
                                          📄 Descargar PDF
                                        </button>
                                      </div>
                                    </body>
                                    </html>
                                  `);
                                  facturaWindow.document.close();
                                  console.log('Factura abierta correctamente');
                                } else {
                                  alert('No se pudo abrir la ventana. Verifica que los popups estén habilitados.');
                                }
                              } catch (error) {
                                console.error('Error al abrir la factura:', error);
                                alert('Error al abrir la factura: ' + (error as Error).message);
                              }
                            }}
                            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                            title="Ver e imprimir factura"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
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

