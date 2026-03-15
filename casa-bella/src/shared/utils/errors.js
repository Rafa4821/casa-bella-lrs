/**
 * @typedef {Object} AppError
 * @property {string} code - Error code
 * @property {string} message - Error message
 * @property {string} [details] - Additional error details
 */

export class FirebaseError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'FirebaseError';
    this.code = code;
    this.details = details;
  }
}

export const ERROR_CODES = {
  AUTH_INVALID_CREDENTIALS: 'auth/invalid-credentials',
  AUTH_USER_NOT_FOUND: 'auth/user-not-found',
  AUTH_WRONG_PASSWORD: 'auth/wrong-password',
  AUTH_EMAIL_IN_USE: 'auth/email-already-in-use',
  AUTH_WEAK_PASSWORD: 'auth/weak-password',
  AUTH_UNAUTHORIZED: 'auth/unauthorized',
  FIRESTORE_NOT_FOUND: 'firestore/not-found',
  FIRESTORE_PERMISSION_DENIED: 'firestore/permission-denied',
  FIRESTORE_UNAVAILABLE: 'firestore/unavailable',
  VALIDATION_ERROR: 'validation/error',
  UNKNOWN_ERROR: 'unknown/error',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Credenciales inválidas',
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: 'Usuario no encontrado',
  [ERROR_CODES.AUTH_WRONG_PASSWORD]: 'Contraseña incorrecta',
  [ERROR_CODES.AUTH_EMAIL_IN_USE]: 'El correo ya está en uso',
  [ERROR_CODES.AUTH_WEAK_PASSWORD]: 'La contraseña es muy débil',
  [ERROR_CODES.AUTH_UNAUTHORIZED]: 'No autorizado',
  [ERROR_CODES.FIRESTORE_NOT_FOUND]: 'Documento no encontrado',
  [ERROR_CODES.FIRESTORE_PERMISSION_DENIED]: 'Permiso denegado',
  [ERROR_CODES.FIRESTORE_UNAVAILABLE]: 'Servicio no disponible',
  [ERROR_CODES.VALIDATION_ERROR]: 'Error de validación',
  [ERROR_CODES.UNKNOWN_ERROR]: 'Error desconocido',
};

/**
 * @param {Error} error
 * @returns {AppError}
 */
export const handleFirebaseError = (error) => {
  const code = error.code || ERROR_CODES.UNKNOWN_ERROR;
  const message = ERROR_MESSAGES[code] || error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
  
  return {
    code,
    message,
    details: error.message,
  };
};

/**
 * @param {string} message
 * @returns {AppError}
 */
export const createValidationError = (message) => {
  return {
    code: ERROR_CODES.VALIDATION_ERROR,
    message,
  };
};
