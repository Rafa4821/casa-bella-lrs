import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import { logger } from '../utils/logger';

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

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 2MB');
    }

    // Create reference with timestamp to avoid caching issues
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `logo-${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `branding/${fileName}`);

    logger.info('Uploading logo:', fileName);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
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
