import { COLLECTIONS } from '../constants/collections';
import { getDocument, setDocument, updateDocument } from '../utils/firestore';

const FAQS_DOC_ID = 'contact-faqs';

/**
 * Get FAQs
 * @returns {Promise<Array>}
 */
export const getFAQs = async () => {
  try {
    const doc = await getDocument(COLLECTIONS.CONTENT, FAQS_DOC_ID);
    return doc?.faqs || [];
  } catch (error) {
    console.error('Error getting FAQs:', error);
    return [];
  }
};

/**
 * Update FAQs
 * @param {Array} faqs
 * @returns {Promise<void>}
 */
export const updateFAQs = async (faqs) => {
  try {
    await setDocument(COLLECTIONS.CONTENT, FAQS_DOC_ID, { faqs });
  } catch (error) {
    console.error('Error updating FAQs:', error);
    throw error;
  }
};

/**
 * Create default FAQs if none exist
 * @returns {Promise<void>}
 */
export const createDefaultFAQs = async () => {
  const existing = await getFAQs();
  
  if (existing.length > 0) {
    return;
  }

  const defaultFAQs = [
    {
      id: 'faq-1',
      question: '¿Cómo llego a Los Roques?',
      answer: 'Los Roques cuenta con un aeropuerto en la isla de Gran Roque. Puedes llegar mediante vuelos chárter desde Caracas o Maiquetía. El vuelo dura aproximadamente 40 minutos.',
      order: 1,
    },
    {
      id: 'faq-2',
      question: '¿Cuál es la política de cancelación?',
      answer: 'Cancelaciones con más de 30 días de anticipación: reembolso del 100%. Entre 15-30 días: 50% de reembolso. Menos de 15 días: no hay reembolso.',
      order: 2,
    },
    {
      id: 'faq-3',
      question: '¿Incluye las comidas?',
      answer: 'La reserva incluye solo el alojamiento. Tenemos cocina equipada disponible y también hay varios restaurantes locales cercanos.',
      order: 3,
    },
    {
      id: 'faq-4',
      question: '¿Cuántas personas pueden hospedarse?',
      answer: 'Casa Bella tiene capacidad para hasta 8 personas en 4 habitaciones matrimoniales. Alquilamos la casa completa para garantizar privacidad.',
      order: 4,
    },
    {
      id: 'faq-5',
      question: '¿Hay WiFi disponible?',
      answer: 'Sí, contamos con WiFi de alta velocidad en todas las áreas de la posada.',
      order: 5,
    },
    {
      id: 'faq-6',
      question: '¿Qué debo llevar?',
      answer: 'Recomendamos ropa ligera, traje de baño, protector solar, repelente de insectos, y zapatos cómodos. No olvides tu cámara para capturar la belleza de Los Roques.',
      order: 6,
    },
  ];

  await updateFAQs(defaultFAQs);
};

/**
 * Get or create FAQs
 * @returns {Promise<Array>}
 */
export const getOrCreateFAQs = async () => {
  await createDefaultFAQs();
  return await getFAQs();
};
