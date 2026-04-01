import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroMinimal, Card, CardBody, Button, Loading } from '../../shared/components/ui';
import { useSettings } from '../../shared/hooks/useSettings';
import { getGalleryImages, getGalleryCategories, createDefaultCategories } from '../../shared/services/galleryService';

export const GaleriaPage = () => {
  const { getWhatsAppUrl } = useSettings();
  const [activeCategory, setActiveCategory] = useState('all');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await createDefaultCategories();
      const [imagesData, categoriesData] = await Promise.all([
        getGalleryImages(),
        getGalleryCategories(),
      ]);
      setImages(imagesData);
      setCategories(categoriesData.length > 0 ? categoriesData : defaultCategories);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultCategories = [
    { id: 'all', label: 'Todo' },
    { id: 'exterior', label: 'Exterior' },
    { id: 'habitaciones', label: 'Habitaciones' },
    { id: 'comunes', label: 'Áreas Comunes' },
    { id: 'playas', label: 'Playas' },
  ];

  if (loading) {
    return <Loading message="Cargando galería..." />;
  }

  const defaultImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      category: 'exterior',
      alt: 'Fachada Casa Bella',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      category: 'habitaciones',
      alt: 'Habitación 1',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      category: 'playas',
      alt: 'Playa Los Roques',
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      category: 'habitaciones',
      alt: 'Habitación 2',
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      category: 'comunes',
      alt: 'Sala de estar',
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      category: 'playas',
      alt: 'Cayos Los Roques',
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      category: 'habitaciones',
      alt: 'Habitación 3',
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
      category: 'comunes',
      alt: 'Comedor',
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      category: 'playas',
      alt: 'Atardecer Los Roques',
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
      category: 'habitaciones',
      alt: 'Habitación 4',
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      category: 'exterior',
      alt: 'Terraza',
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1589403542175-cb5193c4628c?w=800',
      category: 'playas',
      alt: 'Agua cristalina',
    },
  ];

  // Use real images if available, otherwise use default images
  const displayImages = images.length > 0 ? images : defaultImages;
  
  // Filter by category
  const filteredImages = activeCategory === 'all' 
    ? displayImages 
    : displayImages.filter(img => img.category === activeCategory);

  return (
    <>
      <HeroMinimal
        title="Galería"
        subtitle="Descubre la belleza de Casa Bella y Los Roques"
        breadcrumb={[
          { label: 'Inicio', link: '/' },
          { label: 'Galería' },
        ]}
      />

      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <p className="lead text-secondary">
              Una imagen vale más que mil palabras. Explora nuestras instalaciones y 
              los paisajes paradisíacos que te esperan.
            </p>
          </div>

          <div className="d-flex justify-content-center gap-2 flex-wrap mb-5">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          <div className="row g-4">
            {filteredImages.map((image) => (
              <div key={image.id} className="col-md-6 col-lg-4">
                <div
                  className="position-relative overflow-hidden rounded shadow-hover"
                  style={{
                    paddingTop: '75%',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <img
                    src={image.imageUrl || image.src}
                    alt={image.title || image.alt || 'Gallery image'}
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-3"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0';
                    }}
                  >
                    <p className="text-white mb-0 fw-semibold">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">No hay imágenes en esta categoría</p>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="mb-4">Vive la experiencia Casa Bella</h2>
              <p className="text-secondary mb-4">
                Las fotografías solo muestran una parte de lo que te espera en Casa Bella. 
                La verdadera magia la descubrirás cuando estés aquí, sintiendo la brisa del mar, 
                disfrutando de atardeceres únicos y creando recuerdos inolvidables.
              </p>
              <p className="text-secondary mb-4">
                Cada rincón de nuestra posada ha sido pensado para tu comodidad, y cada día 
                en Los Roques es una nueva aventura esperando por ti.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/reservar">
                  <Button variant="primary">
                    Reservar Ahora
                  </Button>
                </Link>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Próximamente: Tour virtual 360°'); }}>
                  <Button variant="outline">
                    Ver 360°
                  </Button>
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400"
                    alt="Detalle 1"
                    className="img-fluid rounded"
                    style={{ objectFit: 'cover', width: '100%', height: '180px' }}
                  />
                </div>
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400"
                    alt="Detalle 2"
                    className="img-fluid rounded"
                    style={{ objectFit: 'cover', width: '100%', height: '180px' }}
                  />
                </div>
                <div className="col-12">
                  <img
                    src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800"
                    alt="Vista panorámica"
                    className="img-fluid rounded"
                    style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary text-white py-5">
        <div className="container text-center">
          <h2 className="mb-4">¿Te gustó lo que viste?</h2>
          <p className="lead mb-4 opacity-90">
            Haz realidad tus vacaciones soñadas en Casa Bella
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/reservar">
              <Button variant="secondary" size="lg">
                Consultar Disponibilidad
              </Button>
            </Link>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="btn-outline-light">
                💬 Contactar por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
