import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugAuth: React.FC = () => {
  const { usuario, isAuthenticated, canAccessModule } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>🔍 Debug Auth:</strong> Usuario NO autenticado
        <div className="text-sm mt-1">
          <p>localStorage authToken: {localStorage.getItem('authToken') || 'No hay token'}</p>
          <p>localStorage authUser: {localStorage.getItem('authUser') || 'No hay usuario'}</p>
          <p>usuario state: {JSON.stringify(usuario)}</p>
          <p>isAuthenticated: {isAuthenticated.toString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      <strong>🔍 Debug Auth:</strong> Usuario autenticado correctamente
      <div className="text-sm mt-1">
        <p><strong>Usuario:</strong> {usuario?.usuario} (ID: {usuario?.id})</p>
        <p><strong>Nombre:</strong> {usuario?.nombre}</p>
        <p><strong>Rol:</strong> {usuario?.rol}</p>
        <p><strong>Estado:</strong> Activo: {usuario?.activo.toString()}</p>
        <p><strong>Permisos de módulos:</strong></p>
        <ul className="ml-4">
          <li>Dashboard: {canAccessModule('dashboard').toString()}</li>
          <li>Empleados: {canAccessModule('empleados').toString()}</li>
          <li>Productos: {canAccessModule('productos').toString()}</li>
          <li>Clientes: {canAccessModule('clientes').toString()}</li>
          <li>Pedidos: {canAccessModule('pedidos').toString()}</li>
          <li>POS: {canAccessModule('pos').toString()}</li>
        </ul>
        <p><strong>localStorage authToken:</strong> {localStorage.getItem('authToken') ? 'Presente' : 'Ausente'}</p>
        <p><strong>localStorage authUser:</strong> {localStorage.getItem('authUser') ? 'Presente' : 'Ausente'}</p>
      </div>
    </div>
  );
};

export default DebugAuth;

