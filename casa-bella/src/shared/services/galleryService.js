import { COLLECTIONS } from '../constants/collections';
import {
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
  deleteDocument,
  createDocument,
} from '../utils/firestore';

const GALLERY_COLLECTION = 'gallery';
const GALLERY_CATEGORIES_DOC_ID = 'categories';

/**
 * Get all gallery images
 * @returns {Promise<Array>}
 */
export const getGalleryImages = async () => {
  try {
    const images = await getDocuments(COLLECTIONS.GALLERY);
    return images.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error('Error getting gallery images:', error);
    throw error;
  }
};

/**
 * Get a single gallery image by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getGalleryImage = async (id) => {
  try {
    return await getDocument(COLLECTIONS.GALLERY, id);
  } catch (error) {
    console.error('Error getting gallery image:', error);
    throw error;
  }
};

/**
 * Create a new gallery image
 * @param {Object} imageData
 * @returns {Promise<string>} - Image ID
 */
export const createGalleryImage = async (imageData) => {
  try {
    const data = {
      ...imageData,
      createdAt: Date.now(),
    };
    const id = await createDocument(COLLECTIONS.GALLERY, data);
    return id;
  } catch (error) {
    console.error('Error creating gallery image:', error);
    throw error;
  }
};

/**
 * Update a gallery image
 * @param {string} id
 * @param {Object} imageData
 * @returns {Promise<void>}
 */
export const updateGalleryImage = async (id, imageData) => {
  try {
    await updateDocument(COLLECTIONS.GALLERY, id, imageData);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
};

/**
 * Delete a gallery image
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteGalleryImage = async (id) => {
  try {
    await deleteDocument(COLLECTIONS.GALLERY, id);
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
};

/**
 * Get gallery categories
 * @returns {Promise<Array>}
 */
export const getGalleryCategories = async () => {
  try {
    const doc = await getDocument(COLLECTIONS.CONTENT, GALLERY_CATEGORIES_DOC_ID);
    return doc?.categories || [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

/**
 * Update gallery categories
 * @param {Array} categories
 * @returns {Promise<void>}
 */
export const updateGalleryCategories = async (categories) => {
  try {
    await setDocument(COLLECTIONS.CONTENT, GALLERY_CATEGORIES_DOC_ID, { categories });
  } catch (error) {
    console.error('Error updating categories:', error);
    throw error;
  }
};

/**
 * Create default gallery categories if none exist
 * @returns {Promise<void>}
 */
export const createDefaultCategories = async () => {
  const existing = await getGalleryCategories();
  
  if (existing.length > 0) {
    return;
  }

  const defaultCategories = [
    { id: 'all', label: 'Todas' },
    { id: 'exterior', label: 'Exterior' },
    { id: 'habitaciones', label: 'Habitaciones' },
    { id: 'comunes', label: 'Áreas Comunes' },
    { id: 'playas', label: 'Playas' },
    { id: 'actividades', label: 'Actividades' },
  ];

  await updateGalleryCategories(defaultCategories);
};

/**
 * Get images by category
 * @param {string} category
 * @returns {Promise<Array>}
 */
export const getImagesByCategory = async (category) => {
  try {
    const allImages = await getGalleryImages();
    
    if (category === 'all') {
      return allImages;
    }
    
    return allImages.filter(img => img.category === category);
  } catch (error) {
    console.error('Error getting images by category:', error);
    throw error;
  }
};
