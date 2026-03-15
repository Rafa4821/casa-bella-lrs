/**
 * Data validation utilities
 * Provides consistent validation across the application
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Email no es válido' };
  }

  return { valid: true, error: null };
};

/**
 * Validate phone number (international format)
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Teléfono es requerido' };
  }

  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  if (!phoneRegex.test(phone.trim())) {
    return { valid: false, error: 'Teléfono no es válido' };
  }

  return { valid: true, error: null };
};

/**
 * Validate required string
 */
export const validateRequired = (value, fieldName = 'Campo') => {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} es requerido` };
  }

  return { valid: true, error: null };
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value, minLength, fieldName = 'Campo') => {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: `${fieldName} es requerido` };
  }

  if (value.trim().length < minLength) {
    return { valid: false, error: `${fieldName} debe tener al menos ${minLength} caracteres` };
  }

  return { valid: true, error: null };
};

/**
 * Validate number range
 */
export const validateNumberRange = (value, min, max, fieldName = 'Valor') => {
  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} debe ser un número` };
  }

  if (num < min || num > max) {
    return { valid: false, error: `${fieldName} debe estar entre ${min} y ${max}` };
  }

  return { valid: true, error: null };
};

/**
 * Validate date
 */
export const validateDate = (dateString, fieldName = 'Fecha') => {
  if (!dateString) {
    return { valid: false, error: `${fieldName} es requerida` };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { valid: false, error: `${fieldName} no es válida` };
  }

  return { valid: true, error: null };
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Fecha de inicio no es válida' };
  }

  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Fecha de fin no es válida' };
  }

  if (end <= start) {
    return { valid: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio' };
  }

  return { valid: true, error: null };
};

/**
 * Validate reservation data
 */
export const validateReservationData = (data) => {
  const errors = {};

  // Validar nombre
  const nameValidation = validateMinLength(data.guestName, 3, 'Nombre');
  if (!nameValidation.valid) {
    errors.guestName = nameValidation.error;
  }

  // Validar email
  const emailValidation = validateEmail(data.guestEmail);
  if (!emailValidation.valid) {
    errors.guestEmail = emailValidation.error;
  }

  // Validar teléfono
  const phoneValidation = validatePhone(data.guestPhone);
  if (!phoneValidation.valid) {
    errors.guestPhone = phoneValidation.error;
  }

  // Validar número de huéspedes
  const guestsValidation = validateNumberRange(data.numberOfGuests, 1, 8, 'Número de huéspedes');
  if (!guestsValidation.valid) {
    errors.numberOfGuests = guestsValidation.error;
  }

  // Validar fechas
  const dateRangeValidation = validateDateRange(data.checkInDate, data.checkOutDate);
  if (!dateRangeValidation.valid) {
    errors.dates = dateRangeValidation.error;
  }

  // Validar método de pago
  const paymentMethodValidation = validateRequired(data.paymentMethod, 'Método de pago');
  if (!paymentMethodValidation.valid) {
    errors.paymentMethod = paymentMethodValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate rate data
 */
export const validateRateData = (data) => {
  const errors = {};

  const nameValidation = validateRequired(data.name, 'Nombre de la tarifa');
  if (!nameValidation.valid) {
    errors.name = nameValidation.error;
  }

  const priceValidation = validateNumberRange(data.pricePerNight, 0, 100000, 'Precio por noche');
  if (!priceValidation.valid) {
    errors.pricePerNight = priceValidation.error;
  }

  const dateRangeValidation = validateDateRange(data.startDate, data.endDate);
  if (!dateRangeValidation.valid) {
    errors.dates = dateRangeValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate blocked date data
 */
export const validateBlockedDateData = (data) => {
  const errors = {};

  const dateRangeValidation = validateDateRange(data.startDate, data.endDate);
  if (!dateRangeValidation.valid) {
    errors.dates = dateRangeValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
