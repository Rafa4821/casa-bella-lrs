import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/la-posada', label: 'La Posada' },
    { to: '/habitaciones', label: 'Habitaciones' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/galeria', label: 'Galería' },
    { to: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="bg-white shadow-sm sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light py-3">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <span className="fw-bold text-primary" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
              Casa Bella
            </span>
            <span className="d-block text-muted" style={{ fontSize: '0.75rem', marginTop: '-0.25rem' }}>
              Los Roques, Venezuela
            </span>
          </Link>
          
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              {navLinks.map((link) => (
                <li className="nav-item" key={link.to}>
                  <Link
                    className={`nav-link fw-500 px-3 py-2 ${isActive(link.to) ? 'text-primary' : 'text-dark'}`}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      transition: 'color 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    {link.label}
                    {isActive(link.to) && (
                      <span
                        className="position-absolute bottom-0 start-50 translate-middle-x bg-primary"
                        style={{ width: '30px', height: '2px' }}
                      />
                    )}
                  </Link>
                </li>
              ))}
              <li className="nav-item ms-lg-2">
                <Link
                  to="/reservar"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reservar
                </Link>
              </li>
              <li className="nav-item ms-lg-2">
                <Link
                  to="/admin"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  onClick={() => setIsMenuOpen(false)}
                  title="Acceso Administrador"
                >
                  <span>🔐</span>
                  <span className="d-none d-lg-inline">Admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
