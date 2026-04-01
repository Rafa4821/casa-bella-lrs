import { render } from '@react-email/render';
import ReservationConfirmation from '../emails/ReservationConfirmation';
import { getSettings } from './settingsService';
import { logger } from '../utils/logger';

/**
 * Format date for email display
 */
const formatDate = (date) => {
  const d = date instanceof Date ? date : date.toDate();
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format price for email display
 */
const formatPrice = (amount) => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Send reservation confirmation email
 * @param {Object} reservation - Reservation object
 * @returns {Promise<void>}
 */
export const sendReservationConfirmation = async (reservation) => {
  try {
    logger.info('Preparing confirmation email for:', reservation.guestEmail);

    // Get settings for logo and contact info
    const settings = await getSettings();

    // Prepare email data
    const emailData = {
      reservationCode: reservation.reservationCode,
      guestName: reservation.guestName,
      checkInDate: formatDate(reservation.checkInDate),
      checkOutDate: formatDate(reservation.checkOutDate),
      numberOfNights: reservation.numberOfNights,
      numberOfGuests: reservation.numberOfGuests,
      totalAmount: formatPrice(reservation.totalAmount),
      logoUrl: settings?.logoUrl || '',
      contactEmail: settings?.contactEmail || 'info@casabellalrs.com',
      contactPhone: settings?.contactPhone || '+58 414 XXX XXXX',
    };

    // Render email HTML
    const emailHtml = render(ReservationConfirmation(emailData));

    // TODO: Implement actual email sending (SendGrid, AWS SES, etc.)
    // For now, log the HTML for testing
    logger.info('Email HTML generated successfully');
    console.log('=== EMAIL PREVIEW ===');
    console.log('To:', reservation.guestEmail);
    console.log('Subject: Confirmación de Reserva', emailData.reservationCode);
    console.log('HTML length:', emailHtml.length, 'characters');
    console.log('===================');

    // In production, you would send this via your email service:
    /*
    await emailProvider.send({
      to: reservation.guestEmail,
      subject: `Confirmación de Reserva ${emailData.reservationCode} - Casa Bella`,
      html: emailHtml,
      from: settings?.contactEmail || 'noreply@casabellalrs.com',
    });
    */

    return { success: true, html: emailHtml };
  } catch (error) {
    logger.error('Error sending confirmation email:', error);
    throw error;
  }
};

/**
 * Preview email in browser (for testing)
 * @param {Object} reservation - Reservation object
 * @returns {Promise<string>} - HTML string
 */
export const previewConfirmationEmail = async (reservation) => {
  const settings = await getSettings();
  
  const emailData = {
    reservationCode: reservation.reservationCode || 'RES-DEMO',
    guestName: reservation.guestName || 'Cliente Demo',
    checkInDate: formatDate(reservation.checkInDate || new Date()),
    checkOutDate: formatDate(reservation.checkOutDate || new Date()),
    numberOfNights: reservation.numberOfNights || 3,
    numberOfGuests: reservation.numberOfGuests || 2,
    totalAmount: formatPrice(reservation.totalAmount || 600),
    logoUrl: settings?.logoUrl || '',
    contactEmail: settings?.contactEmail || 'info@casabellalrs.com',
    contactPhone: settings?.contactPhone || '+58 414 XXX XXXX',
  };

  return render(ReservationConfirmation(emailData));
};
