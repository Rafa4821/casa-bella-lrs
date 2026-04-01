import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../shared/hooks/useSettings';
import { 
  HeroMinimal, 
  Card, 
  CardBody, 
  Input, 
  Select, 
  TextArea, 
  Button, 
  Badge,
  SuccessAlert,
  ErrorAlert,
  InfoAlert,
  Loading,
  AvailabilityCalendar,
} from '../../shared/components/ui';
import { useReservation } from '../../shared/hooks/useReservation';
import { formatDate, formatPrice } from '../../shared/utils/reservationHelpers';

export const ReservarPage = () => {
  const navigate = useNavigate();
  const { getWhatsAppUrl, getWhatsAppDisplay } = useSettings();
  const {
    formData,
    updateFormData,
    pricing,
    loading,
    error,
    success,
    reservationCode,
    loadBlockedDates,
    submitReservation,
    setError,
    setSuccess,
  } = useReservation();

  const [step, setStep] = useState(1);
  useEffect(() => {
    loadBlockedDates();
  }, []);

  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [success]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    updateFormData(e.target.name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitReservation();
    
    if (result) {
      // Navigate to confirmation page with reservation data
      const params = new URLSearchParams({
        code: result.code,
        email: result.email,
        checkIn: result.checkIn,
        checkOut: result.checkOut,
        nights: result.nights.toString(),
        guests: result.guests.toString(),
        total: result.total.toString(),
        payment: result.payment,
      });
      navigate(`/confirmacion?${params.toString()}`);
    }
  };

  const nextStep = () => {
    setError(null);
    setStep(step + 1);
  };
  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const paymentMethods = [
    { value: 'transfer', label: 'Transferencia Bancaria' },
    { value: 'zelle', label: 'Zelle' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'cash', label: 'Efectivo al llegar' },
  ];

  const packages = [
    {
      name: 'Estadía Estándar',
      nights: '3-4 noches',
      price: 'Desde $600',
      features: [
        'Casa completa (4 habitaciones)',
        'Limpieza diaria',
        'WiFi incluido',
        'Uso de cocina',
      ],
      popular: false,
    },
    {
      name: 'Escapada Perfecta',
      nights: '5-7 noches',
      price: 'Desde $950',
      features: [
        'Todo lo anterior',
        'Descuento especial',
        'Tour básico incluido',
        'Late check-out',
      ],
      popular: true,
    },
    {
      name: 'Experiencia Completa',
      nights: '8+ noches',
      price: 'Consultar',
      features: [
        'Todo lo anterior',
        'Mejor precio por noche',
        '2 tours incluidos',
        'Servicio premium',
      ],
      popular: false,
    },
  ];

  const countries = [
    { value: 've', label: 'Venezuela' },
    { value: 'co', label: 'Colombia' },
    { value: 'us', label: 'Estados Unidos' },
    { value: 'es', label: 'España' },
    { value: 'ar', label: 'Argentina' },
    { value: 'other', label: 'Otro' },
  ];

  const hearAbout = [
    { value: 'google', label: 'Búsqueda en Google' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'friend', label: 'Recomendación de amigo' },
    { value: 'repeat', label: 'Ya he estado antes' },
    { value: 'other', label: 'Otro' },
  ];

  return (
    <>
      <HeroMinimal
        title="Reservar"
        subtitle="Asegura tu lugar en el paraíso"
        breadcrumb={[
          { label: 'Inicio', link: '/' },
          { label: 'Reservar' },
        ]}
      />

      <section className="section-padding">
        <div className="container">
          {/* Success Message */}
          {success && reservationCode && (
            <div className="row justify-content-center mb-5">
              <div className="col-lg-8">
                <SuccessAlert
                  title="¡Solicitud de Reserva Enviada!"
                  message={`Tu código de reserva es: ${reservationCode}. Recibirás un email de confirmación con todos los detalles e instrucciones de pago.`}
                  onClose={() => setSuccess(false)}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !success && (
            <div className="row justify-content-center mb-4">
              <div className="col-lg-8">
                <ErrorAlert
                  title="Error"
                  message={error}
                  onClose={() => setError(null)}
                />
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {loading && <Loading fullScreen message="Procesando tu solicitud de reserva..." />}
          {/* Progress Steps */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div className="d-flex justify-content-between align-items-center position-relative">
                <div className="position-absolute top-50 start-0 end-0 translate-middle-y" style={{ height: '2px', backgroundColor: '#e5e7eb', zIndex: 0 }}></div>
                
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="text-center position-relative" style={{ zIndex: 1 }}>
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${
                        step >= stepNumber ? 'bg-primary text-white' : 'bg-light text-muted'
                      }`}
                      style={{ width: '50px', height: '50px', fontWeight: 600 }}
                    >
                      {stepNumber}
                    </div>
                    <small className={step >= stepNumber ? 'text-primary fw-semibold' : 'text-muted'}>
                      {stepNumber === 1 ? 'Fechas' : stepNumber === 2 ? 'Datos' : 'Confirmación'}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-5">
            <div className="col-lg-8">
              <Card hover={false}>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Fechas y huéspedes */}
                    {step === 1 && (
                      <div>
                        <h3 className="mb-4">Selecciona tus fechas</h3>
                        
                        <div className="alert alert-info mb-4" style={{ backgroundColor: 'rgba(22, 167, 201, 0.1)', border: 'none' }}>
                          <div className="d-flex">
                            <span className="me-2">ℹ️</span>
                            <div>
                              <strong>Casa completa:</strong> Reservamos toda la posada, no habitaciones individuales. 
                              Capacidad para hasta 8 personas en 4 habitaciones matrimoniales.
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h6 className="mb-3">Calendario de Disponibilidad</h6>
                          <AvailabilityCalendar
                            selectedCheckIn={formData.checkIn}
                            selectedCheckOut={formData.checkOut}
                            onDateSelect={(date) => {
                              const dateStr = date.toISOString().split('T')[0];
                              if (!formData.checkIn || formData.checkOut) {
                                updateFormData('checkIn', dateStr);
                                updateFormData('checkOut', '');
                              } else {
                                updateFormData('checkOut', dateStr);
                              }
                            }}
                          />
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <Input
                              label="Fecha de llegada"
                              type="date"
                              name="checkIn"
                              value={formData.checkIn}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <Input
                              label="Fecha de salida"
                              type="date"
                              name="checkOut"
                              value={formData.checkOut}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <Input
                          label="Número de huéspedes"
                          type="number"
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          required
                          min="1"
                          max="8"
                          helpText="Máximo 8 personas"
                        />

                        <div className="d-flex justify-content-end">
                          <Button variant="primary" onClick={nextStep} disabled={!formData.checkIn || !formData.checkOut || !formData.guests}>
                            Continuar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Información personal */}
                    {step === 2 && (
                      <div>
                        <h3 className="mb-4">Tus datos</h3>

                        <Input
                          label="Nombre completo"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Nombre y apellido"
                        />

                        <div className="row">
                          <div className="col-md-6">
                            <Input
                              label="Email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="tu@email.com"
                            />
                          </div>
                          <div className="col-md-6">
                            <Input
                              label="Teléfono / WhatsApp"
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              placeholder="+58 414 123 4567"
                            />
                          </div>
                        </div>

                        <Select
                          label="País de residencia"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          options={countries}
                          required
                        />

                        <div className="d-flex justify-content-between">
                          <Button variant="outline" onClick={prevStep}>
                            Atrás
                          </Button>
                          <Button variant="primary" onClick={nextStep} disabled={!formData.name || !formData.email || !formData.phone || !formData.country}>
                            Continuar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Detalles adicionales */}
                    {step === 3 && (
                      <div>
                        <h3 className="mb-4">Últimos detalles</h3>

                        <Select
                          label="Método de pago preferido"
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          options={paymentMethods}
                          required
                          helpText="No procesamos el pago ahora. Te enviaremos las instrucciones."
                        />

                        <TextArea
                          label="Notas adicionales (opcional)"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Alergias, preferencias, celebración especial, preguntas, etc."
                        />

                        <div className="form-check mb-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="acceptTerms"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="acceptTerms">
                            Acepto los términos y condiciones y la política de cancelación
                          </label>
                        </div>

                        <InfoAlert
                          message="Esta es una solicitud de reserva. No procesamos pagos automáticos. Te enviaremos un email con las instrucciones de pago y detalles de confirmación."
                        />

                        <div className="d-flex justify-content-between">
                          <Button variant="outline" onClick={prevStep} disabled={loading}>
                            Atrás
                          </Button>
                          <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg" 
                            disabled={!formData.acceptTerms || !formData.paymentMethod || loading}
                            className="btn"
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Procesando...
                              </>
                            ) : (
                              'Enviar Solicitud de Reserva'
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar con resumen */}
            <div className="col-lg-4">
              <Card hover={false} className="position-sticky" style={{ top: '100px' }}>
                <CardBody>
                  <h5 className="mb-4">Resumen de Reserva</h5>

                  {formData.checkIn && formData.checkOut && (
                    <div className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Check-in:</span>
                        <span className="fw-semibold">{formatDate(formData.checkIn)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Check-out:</span>
                        <span className="fw-semibold">{formatDate(formData.checkOut)}</span>
                      </div>
                      {pricing && (
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Noches:</span>
                          <span className="fw-semibold">{pricing.nights}</span>
                        </div>
                      )}
                      {formData.guests && (
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Huéspedes:</span>
                          <span className="fw-semibold">{formData.guests} personas</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mb-4">
                    <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                      Incluye
                    </h6>
                    <ul className="list-unstyled small">
                      <li className="mb-2">✓ Casa completa (4 habitaciones)</li>
                      <li className="mb-2">✓ Hasta 8 personas</li>
                      <li className="mb-2">✓ Limpieza diaria</li>
                      <li className="mb-2">✓ WiFi premium</li>
                      <li className="mb-2">✓ Todas las amenidades</li>
                    </ul>
                  </div>

                  <div className="bg-light rounded p-3 mb-3">
                    <div className="small text-muted mb-1">Precio Total</div>
                    {pricing ? (
                      <>
                        <div className="d-flex justify-content-between mb-2">
                          <small>Subtotal:</small>
                          <small>{formatPrice(pricing.subtotal)}</small>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <small>Servicio (10%):</small>
                          <small>{formatPrice(pricing.serviceFee)}</small>
                        </div>
                        <div className="border-top pt-2 mt-2">
                          <div className="d-flex justify-content-between">
                            <strong>Total:</strong>
                            <strong className="text-primary">{formatPrice(pricing.total)}</strong>
                          </div>
                        </div>
                        <small className="text-muted d-block mt-2">
                          {formatPrice(pricing.pricePerNight)}/noche
                        </small>
                      </>
                    ) : (
                      <>
                        <div className="h4 text-muted mb-0">--</div>
                        <small className="text-muted">Selecciona las fechas para ver el precio</small>
                      </>
                    )}
                  </div>

                  <Button variant="outline" fullWidth onClick={() => window.open(getWhatsAppUrl(), '_blank')}>
                    💬 Consultar por WhatsApp
                  </Button>
                </CardBody>
              </Card>

              <Card hover={false} className="mt-4">
                <CardBody>
                  <h6 className="mb-3">Política de Cancelación</h6>
                  <small className="text-secondary">
                    • Cancelación gratuita hasta 30 días antes del check-in<br/>
                    • 50% de reembolso entre 15-30 días<br/>
                    • No reembolsable menos de 15 días
                  </small>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">Paquetes Sugeridos</h2>
            <p className="lead text-secondary">
              Elige la opción que mejor se adapte a tu viaje
            </p>
          </div>

          <div className="row g-4">
            {packages.map((pkg, index) => (
              <div key={index} className="col-md-4">
                <Card hover className="h-100 text-center">
                  {pkg.popular && (
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <Badge variant="primary" pill>Más Popular</Badge>
                    </div>
                  )}
                  <CardBody className="pt-5">
                    <h4 className="mb-2">{pkg.name}</h4>
                    <p className="text-muted mb-3">{pkg.nights}</p>
                    <div className="h3 text-primary mb-4">{pkg.price}</div>
                    <ul className="list-unstyled text-start mb-4">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="mb-2">
                          <span className="text-primary me-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant={pkg.popular ? 'primary' : 'outline'} fullWidth>
                      Seleccionar
                    </Button>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary text-white py-5">
        <div className="container text-center">
          <h2 className="mb-4">¿Prefieres hablar directamente?</h2>
          <p className="lead mb-4 opacity-90">
            Nuestro equipo está listo para ayudarte a planificar tu viaje perfecto
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button variant="secondary" size="lg">
              💬 WhatsApp: {getWhatsAppDisplay()}
            </Button>
            <Button variant="outline" size="lg" className="btn-outline-light">
              📧 Enviar Email
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
