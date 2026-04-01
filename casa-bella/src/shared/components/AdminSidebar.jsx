import { Link, useLocation } from 'react-router-dom';

export const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      section: 'Principal',
      items: [
        { to: '/admin', label: 'Dashboard', icon: '📊' },
      ],
    },
    {
      section: 'Gestión',
      items: [
        { to: '/admin/reservas', label: 'Reservas', icon: '📅' },
        { to: '/admin/tarifas', label: 'Tarifas', icon: '💰' },
        { to: '/admin/fechas-bloqueadas', label: 'Fechas Bloqueadas', icon: '🚫' },
      ],
    },
    {
      section: 'Contenido',
      items: [
        { to: '/admin/contenido/inicio', label: 'Página Inicio', icon: '🏠' },
        { to: '/admin/contenido/la-posada', label: 'Página La Posada', icon: '🏛️' },
        { to: '/admin/habitaciones', label: 'Habitaciones', icon: '🛏️' },
        { to: '/admin/contenido/servicios', label: 'Página Servicios', icon: '⚡' },
        { to: '/admin/galeria', label: 'Galería', icon: '📸' },
        { to: '/admin/faqs', label: 'Preguntas Frecuentes', icon: '❓' },
      ],
    },
    {
      section: 'Configuración',
      items: [
        { to: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="bg-gradient-dark text-white d-flex flex-column" style={{ width: '280px', minHeight: '100vh' }}>
      <div className="p-4 border-bottom border-white border-opacity-10">
        <Link to="/" className="text-decoration-none">
          <h4 className="text-primary mb-1 fw-bold" style={{ letterSpacing: '-0.02em' }}>
            Casa Bella
          </h4>
          <small className="text-white-50 d-block">Panel de Administración</small>
        </Link>
      </div>

      <nav className="flex-grow-1 p-3">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            <h6 className="text-white-50 text-uppercase px-3 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 600 }}>
              {section.section}
            </h6>
            <ul className="list-unstyled">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="mb-1">
                  <Link
                    to={item.to}
                    className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded ${
                      isActive(item.to)
                        ? 'bg-primary text-white'
                        : 'text-white-50 hover-bg-white-10'
                    }`}
                    style={{
                      transition: 'all 0.2s ease',
                      fontSize: '0.9375rem',
                      fontWeight: isActive(item.to) ? 600 : 400,
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-top border-white border-opacity-10">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <span style={{ fontSize: '1.25rem' }}>👤</span>
          </div>
          <div className="flex-grow-1">
            <div className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>Admin</div>
            <small className="text-white-50">Administrador</small>
          </div>
        </div>
        <Link
          to="/admin/logout"
          className="btn btn-outline-light btn-sm w-100"
          style={{ fontSize: '0.875rem' }}
        >
          Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
};
