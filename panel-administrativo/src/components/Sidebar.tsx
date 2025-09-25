import { useSimpleAuth } from '../contexts/SimpleAuthContext';

export default function Sidebar() {
  const { hasRole } = useSimpleAuth();
  
  return (
    <nav>
      <a href="/">Dashboard</a>
      {hasRole('Administrador', 'Vendedor') && <a href="/ventas">Ventas</a>}
      {hasRole('Administrador', 'Inventario') && <a href="/inventario">Inventario</a>}
      {hasRole('Administrador', 'Marketing') && <a href="/marketing">Marketing</a>}
      {hasRole('Administrador') && <a href="/empleados">Empleados</a>}
      {hasRole('Administrador') && <a href="/proveedores">Proveedores</a>}
    </nav>
  );
}
