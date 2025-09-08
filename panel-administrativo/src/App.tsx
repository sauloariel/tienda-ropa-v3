import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import Layout from './components/Layout';
import RedirectToFirstModule from './components/RedirectToFirstModule';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import POS from './pages/POS';
import Productos from './pages/Productos';
// import Categorias from './pages/Categorias'; // Integrado en productos
import Pedidos from './pages/Pedidos';
import Clientes from './pages/Clientes';
import Empleados from './pages/Empleados';
import Ventas from './pages/Ventas';
import Estadisticas from './pages/Estadisticas';
import Marketing from './pages/Marketing';
import Proveedores from './pages/Proveedores';
import Facturas from './pages/Facturas';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/unauthorized" element={<Unauthorized/>} />

        {/* Rutas protegidas con Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="pos" element={
            <RoleGuard allow={['Admin','Vendedor']} ruta="/pos">
              <POS />
            </RoleGuard>
          }/>

          <Route path="productos" element={
            <RoleGuard allow={['Admin','Inventario']} ruta="/productos">
              <Productos />
            </RoleGuard>
          }/>

          {/* Categorías integradas en productos */}
          {/* <Route path="categorias" element={
            <RoleGuard allow={['Admin','Inventario']} ruta="/categorias">
              <Categorias />
            </RoleGuard>
          }/> */}

          <Route path="pedidos" element={
            <RoleGuard allow={['Admin','Vendedor','Marketing']} ruta="/pedidos">
              <Pedidos />
            </RoleGuard>
          }/>

          <Route path="clientes" element={
            <RoleGuard allow={['Admin','Vendedor']} ruta="/clientes">
              <Clientes />
            </RoleGuard>
          }/>

          <Route path="empleados" element={
            <RoleGuard allow={['Admin']} ruta="/empleados">
              <Empleados />
            </RoleGuard>
          }/>

          <Route path="ventas" element={
            <RoleGuard allow={['Admin','Vendedor']} ruta="/ventas">
              <Ventas />
            </RoleGuard>
          }/>

          <Route path="estadisticas" element={
            <RoleGuard allow={['Admin','Vendedor','Inventario','Marketing']} ruta="/estadisticas">
              <Estadisticas />
            </RoleGuard>
          }/>

          <Route path="marketing" element={
            <RoleGuard allow={['Admin','Marketing']} ruta="/marketing">
              <Marketing />
            </RoleGuard>
          }/>

          <Route path="proveedores" element={
            <RoleGuard allow={['Admin']} ruta="/proveedores">
              <Proveedores />
            </RoleGuard>
          }/>

          <Route path="facturas" element={
            <RoleGuard allow={['Admin','Vendedor']} ruta="/facturas">
              <Facturas />
            </RoleGuard>
          }/>

          <Route index element={<RedirectToFirstModule />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
