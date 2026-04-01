/**
 * Image compression and optimization utility
 * Converts images to WebP format with compression for optimal web performance
 */

/**
 * Compress and optimize image for web
 * @param {File} file - Original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (
  file,
  options = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.85,
    outputFormat: 'image/webp'
  }
) => {
  return new Promise((resolve, reject) => {
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo debe ser una imagen'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;
          const { maxWidth, maxHeight } = options;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;

            if (width > height) {
              width = maxWidth;
              height = width / aspectRatio;
            } else {
              height = maxHeight;
              width = height * aspectRatio;
            }
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Error al comprimir la imagen'));
                return;
              }

              // Create new file from blob
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, '.webp'),
                {
                  type: options.outputFormat,
                  lastModified: Date.now(),
                }
              );

              // Log compression results
              const originalSizeKB = (file.size / 1024).toFixed(2);
              const compressedSizeKB = (compressedFile.size / 1024).toFixed(2);
              const reduction = (((file.size - compressedFile.size) / file.size) * 100).toFixed(1);

              console.log(`📸 Imagen comprimida:`);
              console.log(`   Original: ${originalSizeKB} KB`);
              console.log(`   Comprimida: ${compressedSizeKB} KB`);
              console.log(`   Reducción: ${reduction}%`);
              console.log(`   Dimensiones: ${width}x${height}`);

              resolve(compressedFile);
            },
            options.outputFormat,
            options.quality
          );
        } catch (error) {
          reject(new Error('Error al procesar la imagen: ' + error.message));
        }
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Compress image with different quality levels based on use case
 */
export const compressionPresets = {
  // For hero images and large banners
  hero: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    outputFormat: 'image/webp'
  },

  // For gallery images
  gallery: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.80,
    outputFormat: 'image/webp'
  },

  // For thumbnails and small images
  thumbnail: {
    maxWidth: 600,
    maxHeight: 600,
    quality: 0.75,
    outputFormat: 'image/webp'
  },

  // For room images
  room: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.82,
    outputFormat: 'image/webp'
  },

  // For logos (higher quality, smaller size)
  logo: {
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.90,
    outputFormat: 'image/webp'
  }
};

/**
 * Compress image with preset
 * @param {File} file - Image file
 * @param {string} preset - Preset name from compressionPresets
 * @returns {Promise<File>}
 */
export const compressWithPreset = async (file, preset = 'gallery') => {
  const options = compressionPresets[preset];
  if (!options) {
    throw new Error(`Preset "${preset}" no existe`);
  }
  return await compressImage(file, options);
};
