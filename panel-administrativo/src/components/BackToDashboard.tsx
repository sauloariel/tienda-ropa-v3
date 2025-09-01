import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

interface BackToDashboardProps {
  className?: string;
}

const BackToDashboard: React.FC<BackToDashboardProps> = ({ className = '' }) => {
  return (
    <Link
      to="/dashboard"
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <Home className="h-4 w-4" />
      Volver al Dashboard
    </Link>
  );
};

export default BackToDashboard;
