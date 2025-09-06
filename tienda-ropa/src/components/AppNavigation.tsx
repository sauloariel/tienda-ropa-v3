import React from 'react';

interface AppNavigationProps {
  currentView: 'tienda' | 'pos' | 'seguimiento';
  onViewChange: (view: 'tienda' | 'pos' | 'seguimiento') => void;
}

const AppNavigation: React.FC<AppNavigationProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🏪</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Supermercado</h1>
              <p className="text-sm text-gray-600">Sistema de Gestión</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex space-x-1">
            <button
              onClick={() => onViewChange('tienda')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'tienda'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🛍️ Tienda Web
            </button>
            
            <button
              onClick={() => onViewChange('pos')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'pos'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              💰 Sistema POS
            </button>

            <button
              onClick={() => onViewChange('seguimiento')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'seguimiento'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              📦 Seguimiento
            </button>
          </nav>

          {/* Información del sistema */}
          <div className="text-right text-sm text-gray-500">
            <div>🕐 {new Date().toLocaleTimeString()}</div>
            <div>📅 {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppNavigation;

