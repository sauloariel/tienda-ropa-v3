import { useAuth, PERMISOS_POR_ROL } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Iconos para cada módulo
const getModuleIcon = (moduleId: string) => {
  const icons: Record<string, string> = {
    pos: '🛒',
    productos: '📦',
    pedidos: '📋',
    clientes: '👥',
    empleados: '👨‍💼',
    ventas: '💰',
    estadisticas: '📊',
    marketing: '📢'
  };
  return icons[moduleId] || '📁';
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const permisos = user && user.rol && PERMISOS_POR_ROL[user.rol] ? PERMISOS_POR_ROL[user.rol] : [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Panel de control administrativo</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                <p className="text-xs text-gray-500">{user?.rol}</p>
              </div>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
              >
                <span>🚪</span>
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Módulos Disponibles</h2>
          <p className="text-gray-600">Selecciona un módulo para acceder a sus funciones</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {permisos.map(module => (
            <Link 
              key={module.id} 
              to={module.ruta} 
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{getModuleIcon(module.id)}</div>
                <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  →
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.nombre}</h3>
              <p className="text-sm text-gray-500">{module.ruta}</p>
            </Link>
          ))}
        </div>

        {permisos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay módulos disponibles</h3>
            <p className="text-gray-600">Tu rol no tiene acceso a ningún módulo en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
