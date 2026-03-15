import { Link } from 'react-router-dom';

export const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/la-posada', label: 'La Posada' },
    { to: '/habitaciones', label: 'Habitaciones' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/galeria', label: 'Galería' },
    { to: '/contacto', label: 'Contacto' },
  ];

  const socialLinks = [
    { icon: '📘', label: 'Facebook', url: '#' },
    { icon: '📷', label: 'Instagram', url: '#' },
    { icon: '💬', label: 'WhatsApp', url: '#' },
  ];

  return (
    <footer className="bg-gradient-dark text-white mt-auto">
      <div className="container">
        <div className="row py-5">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h4 className="text-primary mb-3" style={{ fontWeight: 700 }}>
              Casa Bella
            </h4>
            <p className="text-white-50 mb-3">
              Tu refugio paradisíaco en Los Roques, Venezuela. Disfruta de playas cristalinas, 
              hospitalidad cálida y una experiencia inolvidable.
            </p>
            <div className="d-flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="text-white-50 hover-text-primary"
                  style={{ fontSize: '1.5rem', transition: 'color 0.3s ease' }}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-4 mb-4 mb-lg-0">
            <h6 className="text-white fw-semibold mb-3 text-uppercase" style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>
              Enlaces
            </h6>
            <ul className="list-unstyled">
              {quickLinks.map((link, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={link.to}
                    className="text-white-50 text-decoration-none"
                    style={{ transition: 'color 0.3s ease' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-4 mb-4 mb-lg-0">
            <h6 className="text-white fw-semibold mb-3 text-uppercase" style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>
              Contacto
            </h6>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">
                <small>📍 Los Roques, Venezuela</small>
              </li>
              <li className="mb-2">
                <small>📧 info@casabella.com</small>
              </li>
              <li className="mb-2">
                <small>📱 +58 414 XXX XXXX</small>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-4">
            <h6 className="text-white fw-semibold mb-3 text-uppercase" style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>
              Newsletter
            </h6>
            <p className="text-white-50 small mb-3">
              Recibe ofertas exclusivas y novedades
            </p>
            <div className="input-group mb-2">
              <input
                type="email"
                className="form-control bg-white bg-opacity-10 border-0 text-white"
                placeholder="Tu email"
                style={{ fontSize: '0.875rem' }}
              />
              <button className="btn btn-primary" type="button">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-top border-white border-opacity-10 py-4">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              <small className="text-white-50">
                &copy; {currentYear} Casa Bella. Todos los derechos reservados.
              </small>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <small className="text-white-50">
                <Link to="/privacidad" className="text-white-50 text-decoration-none me-3">
                  Privacidad
                </Link>
                <Link to="/terminos" className="text-white-50 text-decoration-none">
                  Términos
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
