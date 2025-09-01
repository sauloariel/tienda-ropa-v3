import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import POS from './pages/POS';
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';
import Clientes from './pages/Clientes';
import Empleados from './pages/Empleados';
import Ventas from './pages/Ventas';
import Estadisticas from './pages/Estadisticas';
import Marketing from './pages/Marketing';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/unauthorized" element={<Unauthorized/>} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard/></ProtectedRoute>
        }/>

        <Route path="/pos" element={
          <ProtectedRoute>
            <RoleGuard allow={['Admin','Vendedor']} ruta="/pos">
              <POS />
            </RoleGuard>
          </ProtectedRoute>
        }/>

        <Route path="/productos" element={
          <ProtectedRoute>
            <RoleGuard allow={['Admin','Inventario']} ruta="/productos">
              <Productos />
            </RoleGuard>
          </ProtectedRoute>
        }/>

        <Route path="/pedidos" element={
          <ProtectedRoute>
            <RoleGuard allow={['Admin','Vendedor','Marketing']} ruta="/pedidos">
              <Pedidos />
            </RoleGuard>
          </ProtectedRoute>
        }/>

        <Route path="/clientes" element={
          <ProtectedRoute>
            <RoleGuard allow={['Admin','Vendedor']} ruta="/clientes">
              <Clientes />
            </RoleGuard>
          </ProtectedRoute>
        }/>

        <Route path="/empleados" element={
          <ProtectedRoute>
            <RoleGuard allow={['Admin']} ruta="/empleados">
              <Empleados />
            </RoleGuard>
          </ProtectedRoute>
        }/>

        <Route path="/ventas" element={
          <ProtectedRoute>
            <RoleGuard allow={['Admin','Vendedor']} ruta="/ventas">
              <Ventas />
            </RoleGuard>
          </ProtectedRoute>
        }/>

        <Route path="/estadisticas" element={
          <ProtectedRoute>
            <RoleGuard allow={['Admin','Vendedor','Inventario','Marketing']} ruta="/estadisticas">
              <Estadisticas />
            </RoleGuard>
          </ProtectedRoute>
        }/>

        <Route path="/marketing" element={
          <ProtectedRoute>
            <RoleGuard allow={['Admin','Marketing']} ruta="/marketing">
              <Marketing />
            </RoleGuard>
          </ProtectedRoute>
        }/>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
