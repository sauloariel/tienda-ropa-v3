import React from 'react';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';

const DebugAuth: React.FC = () => {
  const { user, isAuthenticated, hasAnyRole } = useSimpleAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>🔍 Debug Auth:</strong> Usuario NO autenticado
        <div className="text-sm mt-1">
          <p>localStorage simpleUser: {localStorage.getItem('simpleUser') || 'No hay usuario'}</p>
          <p>localStorage simpleCredentials: {localStorage.getItem('simpleCredentials') || 'No hay credenciales'}</p>
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
        <p><strong>Usuario:</strong> {user?.usuario} (ID: {user?.id})</p>
        <p><strong>Nombre:</strong> {user?.nombre}</p>
        <p><strong>Rol:</strong> {user?.rol}</p>
        <p><strong>ID Empleado:</strong> {user?.id_empleado}</p>
        <p><strong>Permisos de módulos:</strong></p>
        <ul className="ml-4">
          <li>POS: {hasAnyRole(['Admin', 'Vendedor']).toString()}</li>
          <li>Productos: {hasAnyRole(['Admin', 'Inventario']).toString()}</li>
          <li>Clientes: {hasAnyRole(['Admin', 'Vendedor']).toString()}</li>
          <li>Pedidos: {hasAnyRole(['Admin', 'Vendedor', 'Marketing']).toString()}</li>
          <li>Empleados: {hasAnyRole(['Admin']).toString()}</li>
          <li>Ventas: {hasAnyRole(['Admin', 'Vendedor']).toString()}</li>
        </ul>
        <p><strong>localStorage simpleUser:</strong> {localStorage.getItem('simpleUser') ? 'Presente' : 'Ausente'}</p>
        <p><strong>localStorage simpleCredentials:</strong> {localStorage.getItem('simpleCredentials') ? 'Presente' : 'Ausente'}</p>
      </div>
    </div>
  );
};

export default DebugAuth;

