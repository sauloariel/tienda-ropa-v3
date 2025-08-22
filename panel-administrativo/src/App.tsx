import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Pedidos from './pages/Pedidos'
import Empleados from './pages/Empleados'
import EmpleadosNuevo from './pages/EmpleadosNuevo'
import POS from './pages/POS'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function RoleProtectedRoute({ 
  children, 
  requiredModules 
}: { 
  children: React.ReactNode
  requiredModules: string[]
}) {
  const { isAuthenticated, canAccessModule } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user can access any of the required modules
  const hasAccess = requiredModules.some(module => canAccessModule(module))
  
  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        
        {/* Productos - Admin e Inventario */}
        <Route path="productos" element={
          <RoleProtectedRoute requiredModules={['productos']}>
            <Productos />
          </RoleProtectedRoute>
        } />
        
        {/* Clientes - Admin y Vendedor */}
        <Route path="clientes" element={
          <RoleProtectedRoute requiredModules={['clientes']}>
            <Clientes />
          </RoleProtectedRoute>
        } />
        
        {/* Pedidos - Admin y Vendedor */}
        <Route path="pedidos" element={
          <RoleProtectedRoute requiredModules={['pedidos']}>
            <Pedidos />
          </RoleProtectedRoute>
        } />
        
        {/* Empleados - Solo Admin */}
        <Route path="empleados" element={
          <RoleProtectedRoute requiredModules={['empleados']}>
            <Empleados />
          </RoleProtectedRoute>
        } />
        
        {/* Nuevo Empleado - Solo Admin */}
        <Route path="empleados/nuevo" element={
          <RoleProtectedRoute requiredModules={['empleados']}>
            <EmpleadosNuevo />
          </RoleProtectedRoute>
        } />
        
        {/* POS - Admin y Vendedor */}
        <Route path="pos" element={
          <RoleProtectedRoute requiredModules={['pos']}>
            <POS />
          </RoleProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
