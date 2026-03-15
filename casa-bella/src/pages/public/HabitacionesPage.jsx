import { HeroMinimal, Grid, GridItem, Card, CardBody, CardImage, Button, Badge } from '../../shared/components/ui';

export const HabitacionesPage = () => {
  const rooms = [
    {
      id: 1,
      name: 'Habitación Vista al Mar',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      capacity: '2 personas',
      beds: 'Cama matrimonial',
      size: '18 m²',
      amenities: ['Vista al mar', 'Aire acondicionado', 'Baño privado', 'Closet amplio'],
      featured: true,
    },
    {
      id: 2,
      name: 'Habitación Garden View',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      capacity: '2 personas',
      beds: 'Cama matrimonial',
      size: '16 m²',
      amenities: ['Vista al jardín', 'Aire acondicionado', 'Baño privado', 'Ventilador'],
      featured: false,
    },
    {
      id: 3,
      name: 'Habitación Tropical',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      capacity: '2 personas',
      beds: 'Cama matrimonial',
      size: '15 m²',
      amenities: ['Decoración tropical', 'Aire acondicionado', 'Baño privado', 'Escritorio'],
      featured: false,
    },
    {
      id: 4,
      name: 'Habitación Cozy',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      capacity: '2 personas',
      beds: 'Cama matrimonial',
      size: '14 m²',
      amenities: ['Ambiente acogedor', 'Aire acondicionado', 'Baño privado', 'Iluminación LED'],
      featured: false,
    },
  ];

  const commonAmenities = [
    'Ropa de cama premium',
    'Toallas de baño y playa',
    'Artículos de higiene personal',
    'Agua caliente 24/7',
    'WiFi de alta velocidad',
    'Caja de seguridad',
    'Servicio de limpieza diario',
    'Secador de cabello',
  ];

  return (
    <>
      <HeroMinimal
        title="Habitaciones"
        subtitle="4 habitaciones matrimoniales para tu comodidad"
        breadcrumb={[
          { label: 'Inicio', link: '/' },
          { label: 'Habitaciones' },
        ]}
      />

      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-inline-block bg-primary bg-opacity-10 px-4 py-2 rounded-pill mb-3">
              <span className="text-primary fw-semibold">Reserva Exclusiva</span>
            </div>
            <h2 className="mb-3">Reserva toda la casa</h2>
            <p className="lead text-secondary mb-4">
              En Casa Bella no alquilamos habitaciones individuales. La reserva es de 
              <strong> toda la posada</strong>, garantizando privacidad total para tu grupo.
            </p>
            <div className="d-flex gap-4 justify-content-center flex-wrap text-start">
              <div>
                <div className="text-primary fw-bold" style={{ fontSize: '2rem' }}>4</div>
                <div className="text-muted">Habitaciones</div>
              </div>
              <div>
                <div className="text-primary fw-bold" style={{ fontSize: '2rem' }}>8</div>
                <div className="text-muted">Personas máx.</div>
              </div>
              <div>
                <div className="text-primary fw-bold" style={{ fontSize: '2rem' }}>100%</div>
                <div className="text-muted">Privacidad</div>
              </div>
            </div>
          </div>

          <Grid cols={2} gap={4}>
            {rooms.map((room) => (
              <GridItem key={room.id}>
                <Card hover className="h-100">
                  <div className="position-relative">
                    <CardImage
                      src={room.image}
                      alt={room.name}
                      style={{ height: '280px', objectFit: 'cover' }}
                    />
                    {room.featured && (
                      <div className="position-absolute top-0 end-0 m-3">
                        <Badge variant="primary" pill>Premium</Badge>
                      </div>
                    )}
                  </div>
                  <CardBody>
                    <h4 className="mb-3">{room.name}</h4>
                    
                    <div className="d-flex gap-4 mb-4 text-muted small">
                      <div>
                        <span className="me-1">👥</span>
                        {room.capacity}
                      </div>
                      <div>
                        <span className="me-1">🛏️</span>
                        {room.beds}
                      </div>
                      <div>
                        <span className="me-1">📏</span>
                        {room.size}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                        Amenidades
                      </h6>
                      <div className="d-flex flex-wrap gap-2">
                        {room.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="badge bg-light text-dark border"
                            style={{ fontWeight: 400 }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">Amenidades en todas las habitaciones</h2>
            <p className="lead text-secondary">
              Cada habitación está equipada con todo lo necesario para tu confort
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Card hover={false}>
                <CardBody>
                  <div className="row g-4">
                    {commonAmenities.map((amenity, index) => (
                      <div key={index} className="col-md-6">
                        <div className="d-flex align-items-start">
                          <span className="text-primary me-3 mt-1" style={{ fontSize: '1.25rem' }}>✓</span>
                          <span>{amenity}</span>
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
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="mb-4">La experiencia de alojamiento perfecta</h2>
              <p className="text-secondary mb-4">
                Todas nuestras habitaciones están diseñadas pensando en tu descanso y comodidad. 
                Con decoración que refleja el encanto caribeño y equipamiento moderno, cada espacio 
                es un refugio personal dentro de tu hogar temporal en Los Roques.
              </p>
              <p className="text-secondary mb-4">
                Al reservar Casa Bella completa, tú y tu grupo disfrutarán de:
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2">
                  <span className="text-primary me-2">🔒</span>
                  Total privacidad y exclusividad
                </li>
                <li className="mb-2">
                  <span className="text-primary me-2">🏠</span>
                  Uso libre de todas las áreas comunes
                </li>
                <li className="mb-2">
                  <span className="text-primary me-2">👨‍👩‍👧‍👦</span>
                  Ideal para familias y grupos de amigos
                </li>
                <li className="mb-2">
                  <span className="text-primary me-2">💎</span>
                  Servicio personalizado y atención dedicada
                </li>
              </ul>
              <Button variant="primary" size="lg">
                Consultar Disponibilidad
              </Button>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400"
                    alt="Detalle habitación"
                    className="img-fluid rounded shadow-sm"
                    style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                  />
                </div>
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"
                    alt="Baño"
                    className="img-fluid rounded shadow-sm"
                    style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                  />
                </div>
                <div className="col-12">
                  <img
                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
                    alt="Vista habitación"
                    className="img-fluid rounded shadow-sm"
                    style={{ objectFit: 'cover', width: '100%', height: '250px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary text-white py-5">
        <div className="container text-center">
          <h2 className="mb-4">¿Quieres reservar Casa Bella completa?</h2>
          <p className="lead mb-4 opacity-90">
            Contáctanos para verificar disponibilidad y tarifas
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button variant="secondary" size="lg">
              Ver Tarifas
            </Button>
            <Button variant="outline" size="lg" className="btn-outline-light">
              💬 Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
