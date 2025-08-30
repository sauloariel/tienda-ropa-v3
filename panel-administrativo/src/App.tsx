import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import Pedidos from './pages/Pedidos';
import Empleados from './pages/Empleados';
import POS from './pages/POS';
import Ventas from './pages/Ventas';
import Estadisticas from './pages/Estadisticas';
import Marketing from './pages/Marketing';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RoleGuard from './components/RoleGuard';
import { Rol } from './types/auth.types';

// Componente para rutas protegidas por autenticación
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Componente para rutas protegidas por rol específico
function RoleProtectedRoute({ 
  children, 
  roles 
}: { 
  children: React.ReactNode;
  roles: Rol[];
}) {
  return (
    <RoleGuard roles={roles}>
      {children}
    </RoleGuard>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />
      
      {/* Ruta de acceso no autorizado */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Rutas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* Ruta por defecto - redirigir según rol */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard - Todos los roles */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* POS - Admin y Vendedor */}
        <Route path="pos" element={
          <RoleProtectedRoute roles={['Admin', 'Vendedor']}>
            <POS />
          </RoleProtectedRoute>
        } />
        
        {/* Productos - Admin e Inventario */}
        <Route path="productos" element={
          <RoleProtectedRoute roles={['Admin', 'Inventario']}>
            <Productos />
          </RoleProtectedRoute>
        } />
        
        {/* Pedidos - Admin y Vendedor */}
        <Route path="pedidos" element={
          <RoleProtectedRoute roles={['Admin', 'Vendedor']}>
            <Pedidos />
          </RoleProtectedRoute>
        } />
        
        {/* Clientes - Admin y Vendedor */}
        <Route path="clientes" element={
          <RoleProtectedRoute roles={['Admin', 'Vendedor']}>
            <Clientes />
          </RoleProtectedRoute>
        } />
        
        {/* Empleados - Solo Admin */}
        <Route path="empleados" element={
          <RoleProtectedRoute roles={['Admin']}>
            <Empleados />
          </RoleProtectedRoute>
        } />
        
        {/* Ventas - Admin y Vendedor */}
        <Route path="ventas" element={
          <RoleProtectedRoute roles={['Admin', 'Vendedor']}>
            <Ventas />
          </RoleProtectedRoute>
        } />
        
        {/* Estadísticas - Todos los roles */}
        <Route path="estadisticas" element={<Estadisticas />} />
        
        {/* Marketing - Admin y Marketing */}
        <Route path="marketing" element={
          <RoleProtectedRoute roles={['Admin', 'Marketing']}>
            <Marketing />
          </RoleProtectedRoute>
        } />
        
        {/* Ruta catch-all - redirigir a dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
