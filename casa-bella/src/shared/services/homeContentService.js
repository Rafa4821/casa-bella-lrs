import { COLLECTIONS } from '../constants/collections';
import { getDocument, setDocument, updateDocument } from '../utils/firestore';

const HOME_CONTENT_DOC_ID = 'home-page';

/**
 * Get home page content
 * @returns {Promise<Object|null>}
 */
export const getHomeContent = async () => {
  return await getDocument(COLLECTIONS.CONTENT, HOME_CONTENT_DOC_ID);
};

/**
 * Create default home page content
 * @returns {Promise<void>}
 */
export const createDefaultHomeContent = async () => {
  const defaultContent = {
    hero: {
      title: 'Bienvenido a Casa Bella',
      subtitle: 'Tu refugio paradisíaco en Los Roques, Venezuela',
      backgroundImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600',
    },
    features: [
      {
        icon: '🏖️',
        title: 'Ubicación Privilegiada',
        description: 'En el corazón de Los Roques, rodeados de playas de arena blanca y aguas cristalinas.',
      },
      {
        icon: '🏠',
        title: 'Casa Completa',
        description: 'Reserva exclusiva de toda la posada con capacidad para hasta 8 personas.',
      },
      {
        icon: '⭐',
        title: 'Experiencia Premium',
        description: 'Servicio personalizado y atención dedicada para hacer tu estadía inolvidable.',
      },
    ],
    testimonials: [
      {
        author: 'María González',
        text: 'Una experiencia increíble. La posada es hermosa y la atención de primera. Volveremos sin duda.',
        rating: 5,
      },
      {
        author: 'Carlos Pérez',
        text: 'El lugar perfecto para desconectar. Playas paradisíacas y toda la comodidad que necesitas.',
        rating: 5,
      },
      {
        author: 'Ana Martínez',
        text: 'Superó todas nuestras expectativas. Casa Bella es el paraíso en la tierra.',
        rating: 5,
      },
    ],
    discoverSection: {
      title: 'Descubre el paraíso caribeño',
      description: 'Casa Bella te ofrece la combinación perfecta entre confort, naturaleza y hospitalidad. Ubicados en el archipiélago de Los Roques, te esperamos para brindarte una experiencia única en uno de los destinos más hermosos del Caribe.',
      benefits: [
        'Acceso directo a playas paradisíacas',
        'Habitaciones con vista al mar',
        'Servicio personalizado 24/7',
        'Actividades acuáticas y excursiones',
      ],
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    },
  };

  await setDocument(COLLECTIONS.CONTENT, HOME_CONTENT_DOC_ID, defaultContent);
};

/**
 * Update home page content
 * @param {Object} content
 * @returns {Promise<void>}
 */
export const updateHomeContent = async (content) => {
  const existing = await getHomeContent();
  
  if (!existing) {
    await createDefaultHomeContent();
  }
  
  await updateDocument(COLLECTIONS.CONTENT, HOME_CONTENT_DOC_ID, content);
};

/**
 * Get or create home content
 * @returns {Promise<Object>}
 */
export const getOrCreateHomeContent = async () => {
  let content = await getHomeContent();
  
  if (!content) {
    await createDefaultHomeContent();
    content = await getHomeContent();
  }
  
  return content;
};
