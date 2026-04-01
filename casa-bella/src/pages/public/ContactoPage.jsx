import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroMinimal, Card, CardBody, Input, TextArea, Button, SuccessAlert, ErrorAlert, Loading } from '../../shared/components/ui';
import { useSettings } from '../../shared/hooks/useSettings';
import { getOrCreateFAQs } from '../../shared/services/faqsService';

export const ContactoPage = () => {
  const { getWhatsAppUrl, getWhatsAppDisplay, contactEmail, contactPhone, address } = useSettings();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const data = await getOrCreateFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando..." />;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí se conectará con el backend
  };

  const contactInfo = [
    {
      icon: '📱',
      title: 'WhatsApp',
      value: getWhatsAppDisplay(),
      link: getWhatsAppUrl(),
      action: 'Escribir mensaje',
    },
    {
      icon: '📧',
      title: 'Email',
      value: contactEmail,
      link: `mailto:${contactEmail}`,
      action: 'Enviar email',
    },
    {
      icon: '�',
      title: 'Teléfono',
      value: contactPhone,
      link: `tel:${contactPhone.replace(/\s/g, '')}`,
      action: 'Llamar ahora',
    },
    {
      icon: '�',
      title: 'Dirección',
      value: address,
      link: null,
      action: null,
    },
  ];

  const defaultFaqs = [
    {
      question: '¿Cómo funciona la reserva?',
      answer: 'Casa Bella se reserva completa, no por habitaciones individuales. La reserva incluye las 4 habitaciones matrimoniales para hasta 8 personas.',
    },
    {
      question: '¿Cuál es el tiempo mínimo de estadía?',
      answer: 'El tiempo mínimo de estadía es de 3 noches. Para temporadas altas como Semana Santa, Navidad y Año Nuevo puede variar.',
    },
    {
      question: '¿Qué está incluido en el precio?',
      answer: 'Incluye alojamiento, limpieza diaria, ropa de cama y toallas, WiFi, uso de cocina y todas las áreas comunes.',
    },
    {
      question: '¿Cómo llego a Los Roques?',
      answer: 'Los Roques solo es accesible por avión desde Caracas. Podemos ayudarte a coordinar vuelos y traslados.',
    },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <>
      <HeroMinimal
        title="Contacto"
        subtitle="Estamos aquí para ayudarte a planificar tu estadía perfecta"
        breadcrumb={[
          { label: 'Inicio', link: '/' },
          { label: 'Contacto' },
        ]}
      />

      <section className="section-padding">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <Card hover={false}>
                <CardBody>
                  <h3 className="mb-4">Envíanos un mensaje</h3>
                  <p className="text-secondary mb-4">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <Input
                          label="Nombre completo"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Tu nombre"
                        />
                      </div>
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
                    </div>

                    <Input
                      label="Teléfono / WhatsApp"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+58 414 123 4567"
                    />

                    <div className="row">
                      <div className="col-md-4">
                        <Input
                          label="Check-in"
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <Input
                          label="Check-out"
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <Input
                          label="Número de huéspedes"
                          type="number"
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          placeholder="Máx. 8"
                          min="1"
                          max="8"
                        />
                      </div>
                    </div>

                    <TextArea
                      label="Mensaje"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Cuéntanos sobre tu viaje, preguntas o necesidades especiales..."
                    />

                    <Button type="submit" variant="primary" size="lg" fullWidth>
                      Enviar Mensaje
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>

            <div className="col-lg-4">
              <div className="mb-4">
                <h4 className="mb-4">Información de contacto</h4>
                <div className="d-flex flex-column gap-3">
                  {contactInfo.map((info, index) => (
                    <Card key={index} hover={false}>
                      <CardBody>
                        <div className="d-flex align-items-start gap-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-3 flex-shrink-0">
                            <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                          </div>
                          <div className="flex-grow-1">
                            <div className="text-muted small mb-1">{info.title}</div>
                            <div className="fw-semibold mb-2">{info.value}</div>
                            <a
                              href={info.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary small text-decoration-none"
                            >
                              {info.action} →
                            </a>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>

              <Card hover={false} className="bg-gradient-primary text-white">
                <CardBody>
                  <h5 className="mb-3">Respuesta Rápida por WhatsApp</h5>
                  <p className="mb-4 opacity-90 small">
                    ¿Necesitas una respuesta inmediata? Escríbenos por WhatsApp y te 
                    responderemos en minutos.
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    onClick={() => window.open(getWhatsAppUrl(), '_blank')}
                  >
                    💬 Abrir WhatsApp
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">Preguntas Frecuentes</h2>
            <p className="lead text-secondary">
              Respuestas a las dudas más comunes
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {displayFaqs.map((faq, index) => (
                  <Card key={index} hover={false}>
                    <CardBody>
                      <h5 className="text-primary mb-3">{faq.question}</h5>
                      <p className="text-secondary mb-0">{faq.answer}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-5">
                <p className="text-muted mb-3">¿No encontraste lo que buscabas?</p>
                <Button variant="outline">
                  Ver todas las preguntas frecuentes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="text-center">
            <h2 className="mb-4">Ubicación</h2>
            <p className="lead text-secondary mb-5">
              Gran Roque, Archipiélago Los Roques, Venezuela
            </p>

            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <span style={{ fontSize: '2rem' }}>✈️</span>
                </div>
                <h5>Desde el aeropuerto</h5>
                <p className="text-secondary">5 minutos caminando</p>
              </div>
              <div className="col-md-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <span style={{ fontSize: '2rem' }}>🏖️</span>
                </div>
                <h5>A las playas</h5>
                <p className="text-secondary">Acceso directo</p>
              </div>
              <div className="col-md-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <span style={{ fontSize: '2rem' }}>🍽️</span>
                </div>
                <h5>Restaurantes</h5>
                <p className="text-secondary">A 2-3 minutos</p>
              </div>
            </div>

            <div className="bg-light rounded p-4">
              <p className="text-muted mb-0">
                <strong>Nota:</strong> Los Roques solo es accesible por avión. Te ayudamos a coordinar 
                tu vuelo y traslados desde el aeropuerto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary text-white py-5">
        <div className="container text-center">
          <h2 className="mb-4">¿Listo para reservar?</h2>
          <p className="lead mb-4 opacity-90">
            Contáctanos ahora y asegura tu lugar en el paraíso
          </p>
          <Link to="/reservar">
            <Button variant="secondary" size="lg">
              Hacer una Reservación
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};
