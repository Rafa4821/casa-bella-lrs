import { HeroMinimal, FeatureGrid, Card, CardBody, Button } from '../../shared/components/ui';

export const LaPosadaPage = () => {
  const features = [
    {
      icon: '🏠',
      title: 'Casa Completa',
      description: 'Reserva exclusiva de toda la posada. Privacidad total para tu grupo.',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Hasta 8 Personas',
      description: '4 habitaciones matrimoniales equipadas con todas las comodidades.',
    },
    {
      icon: '🌊',
      title: 'Frente al Mar',
      description: 'Ubicación privilegiada con acceso directo a playas paradisíacas.',
    },
  ];

  const amenities = [
    'WiFi de alta velocidad',
    'Aire acondicionado en todas las habitaciones',
    'Cocina completamente equipada',
    'Sala de estar y comedor amplios',
    'Terraza con vista al mar',
    'Hamacas y área de descanso',
    'Sistema de agua caliente',
    'Servicio de limpieza diario',
  ];

  return (
    <>
      <HeroMinimal
        title="La Posada"
        subtitle="Tu hogar en el paraíso de Los Roques"
        breadcrumb={[
          { label: 'Inicio', link: '/' },
          { label: 'La Posada' },
        ]}
      />

      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="pe-lg-4">
                <h2 className="mb-4">Experiencia exclusiva en Los Roques</h2>
                <p className="lead text-secondary mb-4">
                  Casa Bella es más que una posada, es tu hogar temporal en uno de los archipiélagos 
                  más hermosos del Caribe venezolano.
                </p>
                <p className="text-secondary mb-4">
                  Ofrecemos la <strong>reserva completa de la casa</strong>, garantizando total privacidad 
                  y exclusividad para ti y tu grupo. Con capacidad para hasta 8 personas en 4 habitaciones 
                  matrimoniales, Casa Bella es el lugar perfecto para familias, grupos de amigos o parejas 
                  que buscan una experiencia única.
                </p>
                <p className="text-secondary mb-4">
                  Nuestra posada combina el encanto tradicional de Los Roques con las comodidades modernas 
                  que necesitas para unas vacaciones inolvidables. Desde nuestra ubicación privilegiada 
                  frente al mar hasta cada detalle de nuestras instalaciones, todo está pensado para que 
                  tu estadía sea perfecta.
                </p>
                <Button variant="primary" size="lg">
                  Reservar Ahora
                </Button>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
                alt="Casa Bella"
                className="img-fluid rounded shadow-premium"
                style={{ objectFit: 'cover', width: '100%', height: '500px' }}
              />
            </div>
          </div>

          <FeatureGrid features={features} cols={3} className="mb-5" />
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">¿Qué incluye tu estadía?</h2>
            <p className="lead text-secondary">
              Todas las comodidades para que disfrutes sin preocupaciones
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <Card hover={false}>
                <CardBody>
                  <h4 className="mb-4 text-primary">Amenidades Principales</h4>
                  <div className="row">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <span className="text-primary me-2 mt-1">✓</span>
                          <span>{amenity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="col-lg-6">
              <Card hover={false}>
                <CardBody>
                  <h4 className="mb-4 text-primary">Espacios Compartidos</h4>
                  <p className="text-secondary mb-4">
                    Disfruta de áreas comunes diseñadas para tu comodidad y entretenimiento:
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <strong>Sala de Estar:</strong> Amplia y confortable, perfecta para reuniones familiares
                    </li>
                    <li className="mb-3">
                      <strong>Comedor:</strong> Mesa para 8 personas con vista al jardín
                    </li>
                    <li className="mb-3">
                      <strong>Cocina Equipada:</strong> Refrigerador, estufa, microondas y utensilios completos
                    </li>
                    <li className="mb-3">
                      <strong>Terraza:</strong> Espacio ideal para disfrutar el atardecer con vista al mar
                    </li>
                    <li className="mb-3">
                      <strong>Área de Hamacas:</strong> Zona de relax bajo la sombra
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2 mb-4 mb-lg-0">
              <div className="ps-lg-4">
                <h2 className="mb-4">Ubicación privilegiada</h2>
                <p className="text-secondary mb-4">
                  Casa Bella está estratégicamente ubicada en Gran Roque, la isla principal del 
                  archipiélago de Los Roques. Desde nuestra posada tendrás acceso fácil a:
                </p>
                <ul className="list-unstyled mb-4">
                  <li className="mb-3">
                    <span className="text-primary me-2">📍</span>
                    <strong>5 minutos caminando</strong> del aeropuerto
                  </li>
                  <li className="mb-3">
                    <span className="text-primary me-2">🏖️</span>
                    <strong>Acceso directo</strong> a las mejores playas
                  </li>
                  <li className="mb-3">
                    <span className="text-primary me-2">🍽️</span>
                    <strong>Cerca de restaurantes</strong> y servicios locales
                  </li>
                  <li className="mb-3">
                    <span className="text-primary me-2">⛵</span>
                    <strong>A pasos de</strong> los muelles para excursiones
                  </li>
                </ul>
                <Button variant="outline">Ver en el mapa</Button>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                alt="Los Roques"
                className="img-fluid rounded shadow-premium"
                style={{ objectFit: 'cover', width: '100%', height: '450px' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary text-white py-5">
        <div className="container text-center">
          <h2 className="mb-4">¿Listo para vivir la experiencia Casa Bella?</h2>
          <p className="lead mb-4 opacity-90">
            Contáctanos y asegura tu reserva exclusiva
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button variant="secondary" size="lg">
              Reservar Ahora
            </Button>
            <Button variant="outline" size="lg" className="btn-outline-light">
              💬 WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
