import { COLLECTIONS } from '../constants/collections';
import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  where,
  orderBy,
} from '../utils/firestore';

/**
 * @typedef {Object} Amenity
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {boolean} active
 * @property {number} order
 */

/**
 * @param {string} id
 * @returns {Promise<Amenity|null>}
 */
export const getAmenity = async (id) => {
  return await getDocument(COLLECTIONS.AMENITIES, id);
};

/**
 * @param {boolean} [activeOnly=false]
 * @returns {Promise<Array<Amenity>>}
 */
export const getAmenities = async (activeOnly = false) => {
  const constraints = [orderBy('order', 'asc')];
  
  if (activeOnly) {
    constraints.unshift(where('active', '==', true));
  }
  
  return await getDocuments(COLLECTIONS.AMENITIES, constraints);
};

/**
 * @param {Omit<Amenity, 'id'>} data
 * @returns {Promise<string>}
 */
export const createAmenity = async (data) => {
  const amenityData = {
    name: data.name,
    description: data.description || '',
    icon: data.icon || '',
    active: data.active !== undefined ? data.active : true,
    order: data.order || 0,
  };
  
  return await createDocument(COLLECTIONS.AMENITIES, amenityData);
};

/**
 * @param {string} id
 * @param {Partial<Amenity>} data
 * @returns {Promise<void>}
 */
export const updateAmenity = async (id, data) => {
  await updateDocument(COLLECTIONS.AMENITIES, id, data);
};

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteAmenity = async (id) => {
  await deleteDocument(COLLECTIONS.AMENITIES, id);
};

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export const toggleAmenityStatus = async (id) => {
  const amenity = await getAmenity(id);
  if (amenity) {
    await updateAmenity(id, { active: !amenity.active });
  }
};
