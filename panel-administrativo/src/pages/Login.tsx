import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';

export default function Login() {
  const { login, isAuthenticated } = useSimpleAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); 
    setLoading(true);
    
    try { 
      const result = await login(usuario, password);
      if (result.success) {
        // El useEffect se encargará de la redirección
        console.log('✅ Login exitoso, redirigiendo...');
      } else {
        setErr(result.message || 'Error de login');
      }
    }
    catch (e: any) { 
      setErr(e.message ?? 'Error de login'); 
    }
    finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <h1 className="text-xl font-bold">Iniciar sesión</h1>
        <input className="w-full border rounded p-2" placeholder="Usuario" value={usuario} onChange={e=>setUsuario(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button disabled={loading} className="w-full bg-indigo-600 text-white rounded p-2">{loading?'Ingresando…':'Ingresar'}</button>
      </form>
    </div>
  );
}