import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugAuth: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isVendedor, isInventario, canAccessModule } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>🔍 Debug Auth:</strong> Usuario NO autenticado
        <div className="text-sm mt-1">
          <p>localStorage user: {localStorage.getItem('user') || 'No hay datos'}</p>
          <p>user state: {JSON.stringify(user)}</p>
          <p>isAuthenticated: {isAuthenticated.toString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      <strong>🔍 Debug Auth:</strong> Usuario autenticado correctamente
      <div className="text-sm mt-1">
        <p><strong>Usuario:</strong> {user?.username} (ID: {user?.id})</p>
        <p><strong>Rol:</strong> {user?.role} - {user?.name}</p>
        <p><strong>Estado:</strong> Admin: {isAdmin.toString()}, Vendedor: {isVendedor.toString()}, Inventario: {isInventario.toString()}</p>
        <p><strong>Permisos de módulos:</strong></p>
        <ul className="ml-4">
          <li>Dashboard: {canAccessModule('dashboard').toString()}</li>
          <li>Empleados: {canAccessModule('empleados').toString()}</li>
          <li>Productos: {canAccessModule('productos').toString()}</li>
          <li>Clientes: {canAccessModule('clientes').toString()}</li>
          <li>Pedidos: {canAccessModule('pedidos').toString()}</li>
          <li>POS: {canAccessModule('pos').toString()}</li>
        </ul>
        <p><strong>localStorage:</strong> {localStorage.getItem('user')}</p>
      </div>
    </div>
  );
};

export default DebugAuth;

