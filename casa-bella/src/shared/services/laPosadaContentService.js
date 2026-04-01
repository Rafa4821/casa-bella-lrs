import { COLLECTIONS } from '../constants/collections';
import { getDocument, setDocument, updateDocument } from '../utils/firestore';

const LA_POSADA_CONTENT_DOC_ID = 'la-posada-page';

/**
 * Get La Posada page content
 * @returns {Promise<Object|null>}
 */
export const getLaPosadaContent = async () => {
  return await getDocument(COLLECTIONS.CONTENT, LA_POSADA_CONTENT_DOC_ID);
};

/**
 * Create default La Posada page content
 * @returns {Promise<void>}
 */
export const createDefaultLaPosadaContent = async () => {
  const defaultContent = {
    hero: {
      title: 'Tu experiencia exclusiva en Los Roques',
      subtitle: 'Reserva completa de la casa',
      backgroundImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600',
    },
    description: {
      title: 'La experiencia Casa Bella',
      paragraphs: [
        'Casa Bella es más que una posada, es tu hogar temporal en uno de los archipiélagos más hermosos del Caribe venezolano.',
        'Ofrecemos la reserva completa de la casa, garantizando total privacidad y exclusividad para ti y tu grupo. Con capacidad para hasta 8 personas en 4 habitaciones matrimoniales, Casa Bella es el lugar perfecto para familias, grupos de amigos o parejas que buscan una experiencia única.',
        'Nuestra posada combina el encanto tradicional de Los Roques con las comodidades modernas que necesitas para unas vacaciones inolvidables. Desde nuestra ubicación privilegiada frente al mar hasta cada detalle de nuestras instalaciones, todo está pensado para que tu estadía sea perfecta.',
      ],
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    },
    features: [
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
        description: 'Ubicación privilegiada con vistas espectaculares al Caribe.',
      },
    ],
    amenities: [
      'WiFi de alta velocidad',
      'Aire acondicionado en todas las habitaciones',
      'Ropa de cama y toallas premium',
      'Cocina totalmente equipada',
      'Refrigerador y congelador',
      'Microondas y cafetera',
      'Utensilios de cocina completos',
      'Sala de estar amplia',
      'Comedor para 8 personas',
      'Terraza con vista al mar',
      'Área de hamacas',
      'Servicio de limpieza diario',
      'Sistema de agua caliente',
      'Generador eléctrico de respaldo',
      'Estacionamiento disponible',
    ],
    sharedSpaces: [
      {
        name: 'Sala de Estar',
        description: 'Amplia y confortable, perfecta para reuniones familiares',
      },
      {
        name: 'Comedor',
        description: 'Mesa para 8 personas con vista al jardín',
      },
      {
        name: 'Cocina Equipada',
        description: 'Refrigerador, estufa, microondas y utensilios completos',
      },
      {
        name: 'Terraza',
        description: 'Espacio ideal para disfrutar el atardecer con vista al mar',
      },
      {
        name: 'Área de Hamacas',
        description: 'Zona de relax bajo la sombra',
      },
    ],
    location: {
      title: 'Ubicación privilegiada',
      description: 'Casa Bella está estratégicamente ubicada en Gran Roque, la isla principal del archipiélago de Los Roques. Desde nuestra posada tendrás acceso fácil a:',
      points: [
        {
          icon: '📍',
          title: '5 minutos caminando',
          description: 'del aeropuerto',
        },
        {
          icon: '🏖️',
          title: 'Acceso directo',
          description: 'a las mejores playas',
        },
        {
          icon: '🍽️',
          title: 'Cerca de restaurantes',
          description: 'y servicios locales',
        },
        {
          icon: '⛵',
          title: 'A pasos de',
          description: 'los muelles para excursiones',
        },
      ],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    },
  };

  await setDocument(COLLECTIONS.CONTENT, LA_POSADA_CONTENT_DOC_ID, defaultContent);
};

/**
 * Update La Posada page content
 * @param {Object} content
 * @returns {Promise<void>}
 */
export const updateLaPosadaContent = async (content) => {
  const existing = await getLaPosadaContent();
  
  if (!existing) {
    await createDefaultLaPosadaContent();
  }
  
  await updateDocument(COLLECTIONS.CONTENT, LA_POSADA_CONTENT_DOC_ID, content);
};

/**
 * Get or create La Posada content
 * @returns {Promise<Object>}
 */
export const getOrCreateLaPosadaContent = async () => {
  let content = await getLaPosadaContent();
  
  if (!content) {
    await createDefaultLaPosadaContent();
    content = await getLaPosadaContent();
  }
  
  return content;
};
