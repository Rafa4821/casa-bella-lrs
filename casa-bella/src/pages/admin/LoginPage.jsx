import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/contexts/AuthContext';
import { Card, CardBody, Input, Button, ErrorAlert, Loading } from '../../shared/components/ui';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/admin';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      console.log('Attempting login with:', formData.email);
      await login(formData.email, formData.password);
      console.log('Login successful');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      
      // Show detailed error message
      let errorMessage = 'Error al iniciar sesión. ';
      
      if (err.code) {
        // Firebase error codes
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          errorMessage = 'Email o contraseña incorrectos.';
        } else if (err.code === 'auth/invalid-credential') {
          errorMessage = 'Email o contraseña incorrectos.';
        } else if (err.code === 'auth/too-many-requests') {
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
        } else if (err.code === 'auth/network-request-failed') {
          errorMessage = 'Error de conexión. Verifica tu internet.';
        } else {
          errorMessage += `Código: ${err.code}`;
        }
      } else {
        errorMessage = err.message || 'Error desconocido. Por favor intenta de nuevo.';
      }
      
      setError(errorMessage);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Iniciando sesión..." />;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="text-center mb-4">
              <h1 className="h3 mb-2" style={{ color: 'var(--primary)' }}>
                Casa Bella Los Roques
              </h1>
              <p className="text-muted">Panel Administrativo</p>
            </div>

            <Card>
              <CardBody>
                <h2 className="h5 mb-4 text-center">Iniciar Sesión</h2>

                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                <form onSubmit={handleSubmit}>
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@casabella.com"
                    required
                    autoFocus
                  />

                  <Input
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <small className="text-muted">
                    ¿Olvidaste tu contraseña?{' '}
                    <a href="mailto:rafaellucero998@gmail.com" style={{ color: 'var(--primary)' }}>
                      Contacta al administrador
                    </a>
                  </small>
                </div>
              </CardBody>
            </Card>

            <div className="text-center mt-3">
              <small className="text-muted">
                <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  ← Volver al sitio público
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
