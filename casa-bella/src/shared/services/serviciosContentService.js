import { COLLECTIONS } from '../constants/collections';
import { getDocument, setDocument, updateDocument } from '../utils/firestore';

const SERVICIOS_CONTENT_DOC_ID = 'servicios-page';

/**
 * Get Servicios page content
 * @returns {Promise<Object|null>}
 */
export const getServiciosContent = async () => {
  return await getDocument(COLLECTIONS.CONTENT, SERVICIOS_CONTENT_DOC_ID);
};

/**
 * Create default Servicios page content
 * @returns {Promise<void>}
 */
export const createDefaultServiciosContent = async () => {
  const defaultContent = {
    hero: {
      title: 'Servicios y Comodidades',
      subtitle: 'Todo lo que necesitas para unas vacaciones perfectas',
      backgroundImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600',
    },
    includedServices: [
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
        title: 'WiFi de Alta Velocidad',
        description: 'Internet de alta velocidad en todas las áreas de la posada.',
      },
      {
        icon: '❄️',
        title: 'Aire Acondicionado',
        description: 'Todas las habitaciones equipadas con aire acondicionado y ventiladores.',
      },
      {
        icon: '🍳',
        title: 'Cocina Equipada',
        description: 'Cocina completa con refrigerador, estufa, microondas y todos los utensilios.',
      },
      {
        icon: '🏖️',
        title: 'Toallas de Playa',
        description: 'Toallas de playa y baño incluidas para todos los huéspedes.',
      },
      {
        icon: '⚡',
        title: 'Generador Eléctrico',
        description: 'Sistema de respaldo eléctrico para garantizar servicio continuo.',
      },
      {
        icon: '🅿️',
        title: 'Estacionamiento',
        description: 'Espacio de estacionamiento disponible para nuestros huéspedes.',
      },
    ],
    additionalServices: [
      {
        title: 'Traslado desde/hacia el Aeropuerto',
        description: 'Servicio de transporte cómodo y seguro',
        price: '$20 por trayecto',
        badge: 'Recomendado',
      },
      {
        title: 'Tour a Cayo de Agua',
        description: 'Excursión a una de las playas más hermosas del Caribe',
        price: '$80 por persona',
        badge: 'Popular',
      },
      {
        title: 'Snorkeling',
        description: 'Equipo completo y guía incluido',
        price: '$40 por persona',
        badge: '',
      },
      {
        title: 'Pesca Deportiva',
        description: 'Medio día de pesca con capitán experimentado',
        price: '$150 por grupo',
        badge: '',
      },
      {
        title: 'Kayak',
        description: 'Alquiler de kayak para explorar a tu ritmo',
        price: '$25 por día',
        badge: '',
      },
      {
        title: 'Servicio de Chef',
        description: 'Chef personal para preparar comidas típicas',
        price: '$60 por comida',
        badge: 'Opcional',
      },
    ],
    recommendations: [
      {
        title: 'Restaurantes Locales',
        description: 'Gran variedad de opciones gastronómicas a pocos pasos de Casa Bella. Desde pescado fresco hasta comida internacional.',
        icon: '🍽️',
      },
      {
        title: 'Tiendas y Mercado',
        description: 'Pequeñas tiendas locales donde podrás conseguir provisiones y productos artesanales.',
        icon: '🛒',
      },
      {
        title: 'Centro de Buceo',
        description: 'Operadores certificados ofrecen cursos y excursiones de buceo en arrecifes espectaculares.',
        icon: '🤿',
      },
      {
        title: 'Artesanía Local',
        description: 'Encuentra souvenirs únicos hechos por artesanos locales, desde joyería hasta arte.',
        icon: '🎨',
      },
    ],
  };

  await setDocument(COLLECTIONS.CONTENT, SERVICIOS_CONTENT_DOC_ID, defaultContent);
};

/**
 * Update Servicios page content
 * @param {Object} content
 * @returns {Promise<void>}
 */
export const updateServiciosContent = async (content) => {
  const existing = await getServiciosContent();
  
  if (!existing) {
    await createDefaultServiciosContent();
  }
  
  await updateDocument(COLLECTIONS.CONTENT, SERVICIOS_CONTENT_DOC_ID, content);
};

/**
 * Get or create Servicios content
 * @returns {Promise<Object>}
 */
export const getOrCreateServiciosContent = async () => {
  let content = await getServiciosContent();
  
  if (!content) {
    await createDefaultServiciosContent();
    content = await getServiciosContent();
  }
  
  return content;
};
