import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); 
    setError('');
    try { 
      await login(email, password); 
    } 
    catch (err: any) { 
      setError(err?.response?.data?.message || 'Error de login'); 
    }
    finally { 
      setLoading(false); 
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 p-6 rounded-2xl shadow">
        <h1 className="text-xl font-semibold">Ingresar</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input 
          className="input input-bordered w-full" 
          placeholder="Usuario" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          className="input input-bordered w-full" 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        <button className="btn w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        
        {/* Credenciales de prueba */}
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Vendedor:</strong> vendedor / vendedor123</p>
          <p><strong>Inventario:</strong> inventario / inventario123</p>
          <p><strong>Marketing:</strong> marketing / marketing123</p>
        </div>
      </form>
    </div>
  );
}