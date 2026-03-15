/**
 * Genera un código de reserva único y legible
 * Formato: CB-YYYYMMDD-XXXX (ej: CB-20260315-A1B2)
 */
export const generateReservationCode = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `CB-${year}${month}${day}-${code}`;
};

/**
 * Calcula el número de noches entre dos fechas
 * @param {Date|string} checkIn 
 * @param {Date|string} checkOut 
 * @returns {number}
 */
export const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Valida que las fechas sean válidas para reserva
 * @param {string} checkIn 
 * @param {string} checkOut 
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validateDates = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return { valid: false, error: 'Debes seleccionar ambas fechas' };
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { valid: false, error: 'La fecha de llegada no puede ser anterior a hoy' };
  }

  if (end <= start) {
    return { valid: false, error: 'La fecha de salida debe ser posterior a la llegada' };
  }

  const nights = calculateNights(checkIn, checkOut);
  if (nights < 3) {
    return { valid: false, error: 'La estadía mínima es de 3 noches' };
  }

  return { valid: true, error: null };
};

/**
 * Formatea una fecha para mostrar
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea un precio en USD
 * @param {number} amount 
 * @returns {string}
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Valida email
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida teléfono (formato internacional)
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Calcula el precio total basado en las tarifas
 * @param {number} nights 
 * @param {number} pricePerNight 
 * @returns {Object}
 */
export const calculateTotalPrice = (nights, pricePerNight) => {
  const subtotal = nights * pricePerNight;
  const serviceFee = subtotal * 0.1; // 10% service fee
  const total = subtotal + serviceFee;

  return {
    subtotal,
    serviceFee,
    total,
    pricePerNight,
    nights,
  };
};
