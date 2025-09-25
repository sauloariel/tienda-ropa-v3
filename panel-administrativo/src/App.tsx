import { Routes, Route } from 'react-router-dom';
import { SimpleAuthProvider } from './contexts/SimpleAuthContext';
import { SimpleProtectedRoute } from './components/SimpleProtectedRoute';
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

export default function App() {
  return (
    <SimpleAuthProvider>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/unauthorized" element={<Unauthorized/>} />

        {/* Rutas protegidas con Layout */}
        <Route path="/" element={
          <SimpleProtectedRoute allowedRoles={['Admin','Vendedor','Inventario','Marketing']}>
            <Layout />
          </SimpleProtectedRoute>
        }>
          <Route path="pos" element={
            <SimpleProtectedRoute allowedRoles={['Admin','Vendedor']}>
              <POS />
            </SimpleProtectedRoute>
          }/>

          <Route path="productos" element={
            <SimpleProtectedRoute allowedRoles={['Admin','Inventario']}>
              <Productos />
            </SimpleProtectedRoute>
          }/>

          <Route path="pedidos" element={
            <SimpleProtectedRoute allowedRoles={['Admin','Vendedor','Marketing']}>
              <Pedidos />
            </SimpleProtectedRoute>
          }/>

          <Route path="clientes" element={
            <SimpleProtectedRoute allowedRoles={['Admin','Vendedor']}>
              <Clientes />
            </SimpleProtectedRoute>
          }/>

          <Route path="empleados" element={
            <SimpleProtectedRoute allowedRoles={['Admin']}>
              <Empleados />
            </SimpleProtectedRoute>
          }/>

          <Route path="ventas" element={
            <SimpleProtectedRoute allowedRoles={['Admin','Vendedor']}>
              <Ventas />
            </SimpleProtectedRoute>
          }/>

          <Route path="estadisticas" element={
            <SimpleProtectedRoute allowedRoles={['Admin','Vendedor','Inventario','Marketing']}>
              <Estadisticas />
            </SimpleProtectedRoute>
          }/>

          <Route path="marketing" element={
            <SimpleProtectedRoute allowedRoles={['Admin','Marketing']}>
              <Marketing />
            </SimpleProtectedRoute>
          }/>

          <Route path="proveedores" element={
            <SimpleProtectedRoute allowedRoles={['Admin']}>
              <Proveedores />
            </SimpleProtectedRoute>
          }/>

          <Route index element={<RedirectToFirstModule />} />
        </Route>
      </Routes>
    </SimpleAuthProvider>
  );
}
