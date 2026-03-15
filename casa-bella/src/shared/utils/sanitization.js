/**
 * Data sanitization utilities
 * Prevents XSS and injection attacks
 */

/**
 * Sanitize string by removing/escaping potentially dangerous characters
 */
export const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers like onclick=
};

/**
 * Sanitize HTML by escaping special characters
 */
export const escapeHtml = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
};

/**
 * Sanitize email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  return email
    .trim()
    .toLowerCase()
    .replace(/[^\w\s@.-]/g, ''); // Keep only alphanumeric, @, ., -, and whitespace
};

/**
 * Sanitize phone number
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  return phone
    .trim()
    .replace(/[^\d\s\-+()]/g, ''); // Keep only digits, spaces, -, +, and ()
};

/**
 * Sanitize number
 */
export const sanitizeNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

/**
 * Sanitize reservation data before saving
 */
export const sanitizeReservationData = (data) => {
  return {
    reservationCode: sanitizeString(data.reservationCode),
    guestName: sanitizeString(data.guestName),
    guestEmail: sanitizeEmail(data.guestEmail),
    guestPhone: sanitizePhone(data.guestPhone),
    checkInDate: data.checkInDate instanceof Date ? data.checkInDate : new Date(data.checkInDate),
    checkOutDate: data.checkOutDate instanceof Date ? data.checkOutDate : new Date(data.checkOutDate),
    numberOfGuests: sanitizeNumber(data.numberOfGuests),
    numberOfNights: sanitizeNumber(data.numberOfNights),
    totalAmount: sanitizeNumber(data.totalAmount),
    status: sanitizeString(data.status),
    paymentStatus: sanitizeString(data.paymentStatus),
    paidAmount: sanitizeNumber(data.paidAmount || 0),
    notes: sanitizeString(data.notes || ''),
    paymentMethod: sanitizeString(data.paymentMethod),
    internalNotes: sanitizeString(data.internalNotes || ''),
  };
};

/**
 * Sanitize rate data before saving
 */
export const sanitizeRateData = (data) => {
  return {
    name: sanitizeString(data.name),
    pricePerNight: sanitizeNumber(data.pricePerNight),
    startDate: data.startDate instanceof Date ? data.startDate : new Date(data.startDate),
    endDate: data.endDate instanceof Date ? data.endDate : new Date(data.endDate),
    description: sanitizeString(data.description || ''),
    currency: 'USD',
    isActive: Boolean(data.isActive),
  };
};

/**
 * Sanitize blocked date data before saving
 */
export const sanitizeBlockedDateData = (data) => {
  return {
    startDate: data.startDate instanceof Date ? data.startDate : new Date(data.startDate),
    endDate: data.endDate instanceof Date ? data.endDate : new Date(data.endDate),
    reason: sanitizeString(data.reason || ''),
  };
};

/**
 * Sanitize settings data before saving
 */
export const sanitizeSettingsData = (data) => {
  return {
    contactEmail: sanitizeEmail(data.contactEmail || ''),
    contactPhone: sanitizePhone(data.contactPhone || ''),
    whatsappNumber: sanitizePhone(data.whatsappNumber || ''),
    address: sanitizeString(data.address || ''),
    paymentMethods: data.paymentMethods || {},
    cancellationPolicy: sanitizeString(data.cancellationPolicy || ''),
    checkInTime: sanitizeString(data.checkInTime || '14:00'),
    checkOutTime: sanitizeString(data.checkOutTime || '11:00'),
    minimumNights: sanitizeNumber(data.minimumNights || 3),
    welcomeMessage: sanitizeString(data.welcomeMessage || ''),
    termsAndConditions: sanitizeString(data.termsAndConditions || ''),
  };
};

/**
 * Deep sanitize object recursively
 */
export const deepSanitize = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = deepSanitize(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};
