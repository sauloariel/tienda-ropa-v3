import React, { useState, useEffect } from 'react';
import { Search, User, UserPlus, Phone, Mail, MapPin, ShoppingBag, X, Check } from 'lucide-react';
import { clientesService } from '../services/clientesService';
import type { Cliente } from '../types/cliente.types';

interface ClienteManagerProps {
  onClienteSeleccionado: (cliente: Cliente | null) => void;
  clienteActual?: Cliente | null;
}

const ClienteManager: React.FC<ClienteManagerProps> = ({ onClienteSeleccionado, clienteActual }) => {
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(clienteActual || null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    mail: '',
    telefono: '',
    direccion: ''
  });

  // Buscar clientes
  const buscarClientes = async (query: string) => {
    if (query.length < 2) {
      setClientes([]);
      return;
    }

    try {
      setCargando(true);
      const resultados = await clientesService.buscarClientes(query);
      setClientes(resultados);
    } catch (error) {
      console.error('Error buscando clientes:', error);
    } finally {
      setCargando(false);
    }
  };

  // Buscar por teléfono
  const buscarPorTelefono = async (telefono: string) => {
    if (telefono.length < 8) return;

    try {
      setCargando(true);
      const cliente = await clientesService.buscarPorTelefono(telefono);
      if (cliente) {
        setClienteSeleccionado(cliente);
        onClienteSeleccionado(cliente);
        setClientes([]);
        setBusqueda('');
      }
    } catch (error) {
      console.error('Error buscando por teléfono:', error);
    } finally {
      setCargando(false);
    }
  };

  // Crear nuevo cliente
  const crearCliente = async () => {
    try {
      setCargando(true);
      const cliente = await clientesService.crearCliente(nuevoCliente);
      setClienteSeleccionado(cliente);
      onClienteSeleccionado(cliente);
      setMostrarFormulario(false);
      setNuevoCliente({
        nombre: '',
        apellido: '',
        mail: '',
        telefono: '',
        direccion: ''
      });
    } catch (error) {
      console.error('Error creando cliente:', error);
      alert('Error al crear el cliente. Por favor, intente nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  // Seleccionar cliente
  const seleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    onClienteSeleccionado(cliente);
    setClientes([]);
    setBusqueda('');
  };

  // Limpiar selección
  const limpiarSeleccion = () => {
    setClienteSeleccionado(null);
    onClienteSeleccionado(null);
    setBusqueda('');
  };

  // Efecto para buscar cuando cambia la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (busqueda) {
        buscarClientes(busqueda);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Gestión de Cliente
        </h3>
        {clienteSeleccionado && (
          <button
            onClick={limpiarSeleccion}
            className="text-red-500 hover:text-red-700 p-1"
            title="Limpiar selección"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {clienteSeleccionado ? (
        // Cliente seleccionado
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 text-lg">
                {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
              </h4>
              <div className="mt-2 space-y-1 text-sm text-green-700">
                {clienteSeleccionado.mail && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {clienteSeleccionado.mail}
                  </div>
                )}
                {clienteSeleccionado.telefono && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {clienteSeleccionado.telefono}
                  </div>
                )}
                {clienteSeleccionado.direccion && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {clienteSeleccionado.direccion}
                  </div>
                )}
              </div>
            </div>
            <div className="text-green-600">
              <Check className="w-6 h-6" />
            </div>
          </div>
        </div>
      ) : (
        // Búsqueda de cliente
        <div className="space-y-4">
          {/* Búsqueda por nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nombre o apellido
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nombre o apellido del cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Búsqueda por teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                placeholder="Número de teléfono..."
                onChange={(e) => buscarPorTelefono(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Resultados de búsqueda */}
          {cargando && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Buscando...</p>
            </div>
          )}

          {clientes.length > 0 && (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {clientes.map((cliente) => (
                <div
                  key={cliente.id_cliente}
                  onClick={() => seleccionarCliente(cliente)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {cliente.nombre} {cliente.apellido}
                      </h5>
                      <p className="text-sm text-gray-600">{cliente.mail}</p>
                      {cliente.telefono && (
                        <p className="text-sm text-gray-500">{cliente.telefono}</p>
                      )}
                    </div>
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botón para crear nuevo cliente */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setMostrarFormulario(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Nuevo Cliente
            </button>
          </div>
        </div>
      )}

      {/* Modal para crear nuevo cliente */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Crear Nuevo Cliente
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={nuevoCliente.nombre}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={nuevoCliente.apellido}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, apellido: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={nuevoCliente.mail}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, mail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={nuevoCliente.telefono}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <textarea
                    value={nuevoCliente.direccion}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, direccion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearCliente}
                  disabled={cargando || !nuevoCliente.nombre || !nuevoCliente.apellido || !nuevoCliente.mail}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    'Crear Cliente'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteManager;
