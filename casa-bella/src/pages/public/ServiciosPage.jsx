import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroMinimal, FeatureGrid, Card, CardBody, Button, Badge, Loading } from '../../shared/components/ui';
import { useSettings } from '../../shared/hooks/useSettings';
import { getOrCreateServiciosContent } from '../../shared/services/serviciosContentService';

export const ServiciosPage = () => {
  const { getWhatsAppUrl } = useSettings();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const data = await getOrCreateServiciosContent();
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando servicios..." />;
  }

  const hero = content?.hero || {
    title: 'Servicios y Comodidades',
    subtitle: 'Todo lo que necesitas para unas vacaciones perfectas',
    backgroundImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600'
  };
  const includedServices = content?.includedServices || [];
  const additionalServices = content?.additionalServices || [];
  const recommendations = content?.recommendations || [];

  const defaultServices = [
    {
      icon: '🏠',
      title: 'Alojamiento Exclusivo',
      description: 'Reserva completa de la posada con 4 habitaciones matrimoniales para hasta 8 personas.',
    },
    {
      icon: '🧹',
      title: 'Limpieza Diaria',
      description: 'Servicio de limpieza y cambio de toallas todos los días para tu comodidad.',
    },
    {
      icon: '📶',
      title: 'WiFi Premium',
      description: 'Internet de alta velocidad en toda la posada para mantenerte conectado.',
    },
    {
      icon: '🍳',
      title: 'Cocina Equipada',
      description: 'Cocina completa con todos los utensilios para preparar tus comidas.',
    },
    {
      icon: '❄️',
      title: 'Aire Acondicionado',
      description: 'Climatización en todas las habitaciones para tu máximo confort.',
    },
    {
      icon: '🔒',
      title: 'Seguridad',
      description: 'Cajas de seguridad individuales y vigilancia para tu tranquilidad.',
    },
  ];

  const extras = [
    {
      name: 'Traslados Aeropuerto',
      description: 'Servicio de recogida y entrega en el aeropuerto de Los Roques.',
      icon: '✈️',
      price: 'Consultar',
    },
    {
      name: 'Excursiones en Lancha',
      description: 'Tours a los cayos más hermosos: Crasqui, Madrisquí, Francisquí.',
      icon: '⛵',
      price: 'Desde $80/persona',
    },
    {
      name: 'Snorkeling',
      description: 'Equipo de snorkeling y guía para explorar arrecifes de coral.',
      icon: '🤿',
      price: 'Incluido',
    },
    {
      name: 'Pesca Deportiva',
      description: 'Salidas de pesca con equipos profesionales y capitán experimentado.',
      icon: '🎣',
      price: 'Consultar',
    },
    {
      name: 'Masajes y Spa',
      description: 'Servicio de masajes relajantes en la comodidad de la posada.',
      icon: '💆',
      price: 'Desde $50',
    },
    {
      name: 'Chef a Domicilio',
      description: 'Contrata un chef para preparar deliciosos platos con productos locales.',
      icon: '👨‍🍳',
      price: 'Consultar',
    },
  ];

  const included = [
    'Ropa de cama y toallas premium',
    'Productos de higiene personal',
    'Agua caliente 24/7',
    'Servicio de limpieza diario',
    'WiFi ilimitado',
    'Uso de cocina y áreas comunes',
    'Hamacas y área de descanso',
    'Ventiladores adicionales',
    'Nevera y congelador',
    'Filtro de agua potable',
  ];

  return (
    <>
      <HeroMinimal
        title="Servicios"
        subtitle="Todo lo que necesitas para unas vacaciones perfectas"
        breadcrumb={[
          { label: 'Inicio', link: '/' },
          { label: 'Servicios' },
        ]}
      />

      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">Servicios Incluidos</h2>
            <p className="lead text-secondary">
              Disfruta de todas estas comodidades durante tu estadía
            </p>
          </div>

          <FeatureGrid features={services} cols={3} />
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">¿Qué está incluido en tu reserva?</h2>
            <p className="lead text-secondary">
              Todo lo esencial para que solo te preocupes por disfrutar
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Card hover={false}>
                <CardBody>
                  <div className="row g-3">
                    {included.map((item, index) => (
                      <div key={index} className="col-md-6">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <span className="text-primary">✓</span>
                          </div>
                          <span>{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">Servicios Adicionales</h2>
            <p className="lead text-secondary">
              Mejora tu experiencia con nuestros servicios extras
            </p>
          </div>

          <div className="row g-4">
            {extras.map((extra, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <Card hover className="h-100">
                  <CardBody>
                    <div className="text-center mb-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                        <span style={{ fontSize: '2.5rem' }}>{extra.icon}</span>
                      </div>
                      <h5 className="mb-2">{extra.name}</h5>
                      <p className="text-secondary small mb-3">{extra.description}</p>
                      <div className="badge bg-primary bg-opacity-10 text-primary">
                        {extra.price}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <p className="text-muted mb-3">
              <strong>Nota:</strong> Los servicios adicionales están sujetos a disponibilidad y deben 
              reservarse con anticipación.
            </p>
            <Link to="/contacto">
              <Button variant="primary">
                Solicitar Información
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="mb-4">Recomendaciones locales</h2>
              <p className="text-secondary mb-4">
                Además de nuestros servicios, te ayudamos a coordinar las mejores experiencias 
                en Los Roques:
              </p>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <div className="d-flex">
                    <span className="text-primary me-3">🍽️</span>
                    <div>
                      <strong>Restaurantes locales</strong>
                      <p className="text-secondary mb-0 small">
                        Recomendaciones de los mejores lugares para comer pescado fresco
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex">
                    <span className="text-primary me-3">🏝️</span>
                    <div>
                      <strong>Tours especializados</strong>
                      <p className="text-secondary mb-0 small">
                        Conexión con operadores confiables para excursiones únicas
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex">
                    <span className="text-primary me-3">📸</span>
                    <div>
                      <strong>Fotografía profesional</strong>
                      <p className="text-secondary mb-0 small">
                        Contacto con fotógrafos para capturar tus mejores momentos
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex">
                    <span className="text-primary me-3">🏊</span>
                    <div>
                      <strong>Actividades acuáticas</strong>
                      <p className="text-secondary mb-0 small">
                        Kayak, paddleboard y buceo con instructores certificados
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
                alt="Actividades Los Roques"
                className="img-fluid rounded shadow-premium"
                style={{ objectFit: 'cover', width: '100%', height: '450px' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary text-white py-5">
        <div className="container text-center">
          <h2 className="mb-4">¿Necesitas más información?</h2>
          <p className="lead mb-4 opacity-90">
            Contáctanos y te ayudaremos a planificar tu estadía perfecta
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/reservar">
              <Button variant="secondary" size="lg">
                Reservar Ahora
              </Button>
            </Link>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="btn-outline-light">
                💬 Escribir por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
