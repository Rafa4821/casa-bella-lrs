import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardBody, Button } from '../../shared/components/ui';
import { formatDate, formatPrice } from '../../shared/utils/reservationHelpers';

export const ReservationConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    // Get data from URL params
    const code = searchParams.get('code');
    const email = searchParams.get('email');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const nights = searchParams.get('nights');
    const guests = searchParams.get('guests');
    const total = searchParams.get('total');
    const payment = searchParams.get('payment');

    if (code && email) {
      setReservationData({
        code,
        email,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        nights: parseInt(nights) || 0,
        guests: parseInt(guests) || 0,
        total: parseFloat(total) || 0,
        payment: payment || 'Por definir',
      });
    }
  }, [searchParams]);

  if (!reservationData) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h3 className="text-muted">No hay información de reserva</h3>
          <Link to="/reservar" className="btn btn-primary mt-3">
            Hacer una Reserva
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Success Icon */}
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 mb-3"
                style={{ width: '80px', height: '80px' }}
              >
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  className="text-success"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h1 className="mb-2">¡Solicitud Enviada Exitosamente! 🎉</h1>
              <p className="text-muted lead">
                Tu solicitud de reserva ha sido recibida y está siendo procesada
              </p>
            </div>

            {/* Main Card */}
            <Card hover={false} className="mb-4">
              <CardBody className="p-4">
                {/* Reservation Code */}
                <div className="text-center mb-4 pb-4 border-bottom">
                  <p className="text-muted mb-2 small text-uppercase" style={{ letterSpacing: '0.1em' }}>
                    Tu Código de Reserva
                  </p>
                  <h2 className="mb-0 font-monospace text-primary">
                    {reservationData.code}
                  </h2>
                  <p className="text-muted small mt-2">
                    Guarda este código para futuras referencias
                  </p>
                </div>

                {/* Reservation Details */}
                <div className="mb-4">
                  <h5 className="mb-3">📅 Detalles de tu Estadía</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <div className="small text-muted mb-1">Check-in</div>
                        <div className="fw-semibold">
                          {reservationData.checkIn ? formatDate(reservationData.checkIn) : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <div className="small text-muted mb-1">Check-out</div>
                        <div className="fw-semibold">
                          {reservationData.checkOut ? formatDate(reservationData.checkOut) : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <div className="small text-muted mb-1">Noches</div>
                        <div className="fw-semibold">{reservationData.nights}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <div className="small text-muted mb-1">Huéspedes</div>
                        <div className="fw-semibold">{reservationData.guests} personas</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="p-3 bg-primary bg-opacity-10 rounded mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Total Estimado</span>
                    <span className="h4 mb-0 text-primary">{formatPrice(reservationData.total)}</span>
                  </div>
                  <div className="small text-muted mt-1">
                    Método de pago preferido: {reservationData.payment}
                  </div>
                </div>

                {/* Email Confirmation */}
                <div className="alert alert-info mb-0">
                  <div className="d-flex">
                    <div className="me-3">
                      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="fw-semibold mb-1">Revisa tu correo electrónico</div>
                      <div className="small">
                        Hemos enviado la confirmación a <strong>{reservationData.email}</strong> con todos los detalles e instrucciones de pago.
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Next Steps */}
            <Card hover={false} className="mb-4">
              <CardBody className="p-4">
                <h5 className="mb-3">📋 Próximos Pasos</h5>
                <ol className="mb-0 ps-3">
                  <li className="mb-3">
                    <strong>Revisa tu email</strong> - Te enviamos toda la información de tu reserva
                  </li>
                  <li className="mb-3">
                    <strong>Espera nuestra confirmación</strong> - Nuestro equipo revisará tu solicitud en las próximas 24 horas
                  </li>
                  <li className="mb-3">
                    <strong>Recibe las instrucciones de pago</strong> - Te enviaremos los detalles para completar tu reserva
                  </li>
                  <li className="mb-0">
                    <strong>¡Prepárate para el paraíso!</strong> - Empaca tu maleta y prepárate para una experiencia inolvidable
                  </li>
                </ol>
              </CardBody>
            </Card>

            {/* Contact Card */}
            <Card hover={false} className="mb-4">
              <CardBody className="p-4 text-center">
                <h5 className="mb-3">¿Tienes preguntas?</h5>
                <p className="text-muted mb-3">
                  Nuestro equipo está disponible para ayudarte
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <a 
                    href="https://wa.me/584141234567" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                  >
                    <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <Link to="/contacto" className="btn btn-outline-primary btn-sm">
                    Ir a Contacto
                  </Link>
                </div>
              </CardBody>
            </Card>

            {/* Action Buttons */}
            <div className="d-flex gap-2 justify-content-center">
              <Link to="/" className="btn btn-outline-primary">
                Volver al Inicio
              </Link>
              <Link to="/galeria" className="btn btn-primary">
                Ver Galería
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
