import { Hero, FeatureGrid, Card, CardBody, Button } from '../../shared/components/ui';

export const HomePage = () => {
  const features = [
    {
      icon: '🏖️',
      title: 'Ubicación Privilegiada',
      description: 'En el corazón de Los Roques, rodeados de playas de arena blanca y aguas cristalinas.',
    },
    {
      icon: '🏡',
      title: 'Comodidad Premium',
      description: 'Habitaciones elegantes con todas las amenidades para tu confort y descanso.',
    },
    {
      icon: '✨',
      title: 'Experiencia Única',
      description: 'Servicio personalizado y atención al detalle para crear momentos inolvidables.',
    },
  ];

  const testimonials = [
    {
      text: 'Una experiencia maravillosa. Las instalaciones son impecables y la atención excepcional.',
      author: 'María González',
      rating: 5,
    },
    {
      text: 'El lugar perfecto para desconectar. La playa es espectacular y Casa Bella es un oasis.',
      author: 'Carlos Méndez',
      rating: 5,
    },
    {
      text: 'Superó todas nuestras expectativas. Volveremos sin duda.',
      author: 'Ana Rodríguez',
      rating: 5,
    },
  ];

  return (
    <>
      <Hero
        title="Bienvenido a Casa Bella"
        subtitle="Tu refugio paradisíaco en Los Roques, Venezuela"
        height="600px"
        backgroundImage="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600"
      >
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Button size="lg" variant="primary">
            Reservar Ahora
          </Button>
          <Button size="lg" variant="secondary">
            Ver Habitaciones
          </Button>
        </div>
      </Hero>

      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">¿Por qué Casa Bella?</h2>
            <p className="lead text-secondary">
              Descubre lo que hace de Casa Bella el destino perfecto para tus vacaciones
            </p>
          </div>
          <FeatureGrid features={features} cols={3} />
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">Lo que dicen nuestros huéspedes</h2>
            <p className="lead text-secondary">
              Experiencias reales de quienes nos visitaron
            </p>
          </div>
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <Card hover>
                  <CardBody>
                    <div className="mb-3 text-primary">
                      {'⭐'.repeat(testimonial.rating)}
                    </div>
                    <p className="text-secondary mb-4">"{testimonial.text}"</p>
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                        <span className="text-white fw-bold">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="fw-semibold">{testimonial.author}</div>
                        <small className="text-muted">Huésped</small>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="mb-4">Descubre el paraíso caribeño</h2>
              <p className="text-secondary mb-4">
                Casa Bella te ofrece la combinación perfecta entre confort, naturaleza y hospitalidad. 
                Ubicados en el archipiélago de Los Roques, te esperamos para brindarte una experiencia 
                única en uno de los destinos más hermosos del Caribe.
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2">
                  <span className="text-primary me-2">✓</span>
                  Acceso directo a playas paradisíacas
                </li>
                <li className="mb-2">
                  <span className="text-primary me-2">✓</span>
                  Habitaciones con vista al mar
                </li>
                <li className="mb-2">
                  <span className="text-primary me-2">✓</span>
                  Servicio personalizado 24/7
                </li>
                <li className="mb-2">
                  <span className="text-primary me-2">✓</span>
                  Actividades acuáticas y excursiones
                </li>
              </ul>
              <Button variant="primary">Conoce más</Button>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
                  alt="Los Roques"
                  className="img-fluid rounded shadow-premium"
                  style={{ objectFit: 'cover', height: '500px', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary text-white py-5">
        <div className="container text-center">
          <h2 className="mb-4">¿Listo para tu próxima aventura?</h2>
          <p className="lead mb-4 opacity-90">
            Reserva ahora y asegura tu lugar en el paraíso
          </p>
          <Button variant="secondary" size="lg">
            Hacer una reservación
          </Button>
        </div>
      </section>
    </>
  );
};
