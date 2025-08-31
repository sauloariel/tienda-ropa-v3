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
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, RequireRole } from './routes/guards';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/ventas" element={<ProtectedRoute><RequireRole roles={['Administrador', 'Vendedor']}><Ventas /></RequireRole></ProtectedRoute>} />
      <Route path="/inventario" element={<ProtectedRoute><RequireRole roles={['Administrador', 'Inventario']}><Productos /></RequireRole></ProtectedRoute>} />
      <Route path="/marketing" element={<ProtectedRoute><RequireRole roles={['Administrador', 'Marketing']}><Marketing /></RequireRole></ProtectedRoute>} />
      <Route path="/empleados" element={<ProtectedRoute><RequireRole roles={['Administrador']}><Empleados /></RequireRole></ProtectedRoute>} />
      <Route path="/pos" element={<ProtectedRoute><RequireRole roles={['Administrador', 'Vendedor']}><POS /></RequireRole></ProtectedRoute>} />
      <Route path="/pedidos" element={<ProtectedRoute><RequireRole roles={['Administrador', 'Vendedor']}><Pedidos /></RequireRole></ProtectedRoute>} />
      <Route path="/clientes" element={<ProtectedRoute><RequireRole roles={['Administrador', 'Vendedor']}><Clientes /></RequireRole></ProtectedRoute>} />
      <Route path="/estadisticas" element={<ProtectedRoute><Estadisticas /></ProtectedRoute>} />
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
