import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/admin': 'Dashboard',
      '/admin/reservas': 'Reservas',
      '/admin/tarifas': 'Tarifas',
      '/admin/fechas-bloqueadas': 'Fechas Bloqueadas',
      '/admin/configuracion': 'Configuración',
    };
    return titles[path] || 'Panel de Administración';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white border-bottom border-opacity-10 px-4 py-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-1 fw-bold" style={{ color: 'var(--color-text-primary)' }}>
            {getPageTitle()}
          </h4>
          <small className="text-muted">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </small>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
              <span style={{ fontSize: '1.125rem' }}>👤</span>
            </div>
            <div className="d-none d-md-block">
              <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                {user?.name || user?.email || 'Admin'}
              </div>
              <small className="text-muted">Administrador</small>
            </div>
          </div>
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            🚪 Salir
          </button>
        </div>
      </div>
    </header>
  );
};
