import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import { logger } from '../utils/logger';
import { compressWithPreset } from '../utils/imageCompression';

/**
 * Upload logo image to Firebase Storage
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadLogo = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Use JPG, PNG, WebP o SVG');
    }

    // Skip compression for SVG files
    let fileToUpload = file;
    if (file.type !== 'image/svg+xml') {
      logger.info('Compressing logo image...');
      fileToUpload = await compressWithPreset(file, 'logo');
    }

    // Validate file size after compression (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (fileToUpload.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 2MB');
    }

    // Create reference with timestamp to avoid caching issues
    const timestamp = Date.now();
    const fileName = `logo-${timestamp}.webp`;
    const storageRef = ref(storage, `branding/${fileName}`);

    logger.info('Uploading logo:', fileName);

    // Upload file
    const snapshot = await uploadBytes(storageRef, fileToUpload);
    logger.info('Logo uploaded successfully');

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    logger.info('Logo URL:', downloadURL);

    return downloadURL;
  } catch (error) {
    logger.error('Error uploading logo:', error);
    throw error;
  }
};

/**
 * Delete logo from Firebase Storage
 * @param {string} logoUrl - URL of logo to delete
 * @returns {Promise<void>}
 */
export const deleteLogo = async (logoUrl) => {
  try {
    if (!logoUrl || !logoUrl.includes('firebase')) {
      return;
    }

    // Extract path from URL
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/';
    const pathStart = logoUrl.indexOf('/o/') + 3;
    const pathEnd = logoUrl.indexOf('?');
    const filePath = decodeURIComponent(logoUrl.substring(pathStart, pathEnd));

    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    
    logger.info('Logo deleted successfully');
  } catch (error) {
    logger.error('Error deleting logo:', error);
    // Don't throw error if deletion fails
  }
};

/**
 * Generic image upload function for CMS content
 * @param {File} file - Image file to upload
 * @param {string} folder - Folder path in storage (e.g., 'home/hero', 'gallery', 'rooms')
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadImage = async (file, folder = 'content') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Use JPG, PNG, WebP o SVG');
    }

    // Determine compression preset based on folder
    let preset = 'gallery';
    if (folder.includes('hero') || folder.includes('home')) {
      preset = 'hero';
    } else if (folder.includes('room') || folder.includes('habitacion')) {
      preset = 'room';
    } else if (folder.includes('thumb')) {
      preset = 'thumbnail';
    }

    // Skip compression for SVG files
    let fileToUpload = file;
    if (file.type !== 'image/svg+xml') {
      logger.info(`Compressing image with preset: ${preset}...`);
      fileToUpload = await compressWithPreset(file, preset);
    }

    // Validate file size after compression (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileToUpload.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 5MB');
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}.webp`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    logger.info(`Uploading image to ${folder}:`, fileName);

    const snapshot = await uploadBytes(storageRef, fileToUpload);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    logger.info('Image uploaded successfully:', downloadURL);

    return downloadURL;
  } catch (error) {
    logger.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete image from Firebase Storage
 * @param {string} imageUrl - Full URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('firebase')) {
      return;
    }

    const pathStart = imageUrl.indexOf('/o/') + 3;
    const pathEnd = imageUrl.indexOf('?');
    const filePath = decodeURIComponent(imageUrl.substring(pathStart, pathEnd));

    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    
    logger.info('Image deleted successfully');
  } catch (error) {
    logger.error('Error deleting image:', error);
    // Don't throw error if deletion fails
  }
};
