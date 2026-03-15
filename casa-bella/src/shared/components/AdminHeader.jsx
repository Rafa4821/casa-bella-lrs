import { useLocation } from 'react-router-dom';

export const AdminHeader = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/admin': 'Dashboard',
      '/admin/reservaciones': 'Reservaciones',
      '/admin/tarifas': 'Tarifas',
      '/admin/amenidades': 'Amenidades',
      '/admin/fechas-bloqueadas': 'Fechas Bloqueadas',
      '/admin/ajustes': 'Ajustes',
      '/admin/administradores': 'Administradores',
    };
    return titles[path] || 'Panel de Administración';
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
          <button className="btn btn-outline-primary btn-sm">
            🔔 Notificaciones
          </button>
          <div className="vr"></div>
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
              <span style={{ fontSize: '1.125rem' }}>👤</span>
            </div>
            <div className="d-none d-md-block">
              <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>Admin</div>
              <small className="text-muted">Administrador</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
