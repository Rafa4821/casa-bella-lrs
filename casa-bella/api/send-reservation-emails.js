import { Resend } from 'resend';
import { getClientConfirmationTemplate, getAdminNotificationTemplate } from './templates/emailTemplates.js';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Endpoint combinado que envía ambos emails: cliente y admin
 * Esto garantiza que ambos se envíen en una sola llamada
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reservationData = req.body;

    if (!reservationData || !reservationData.guestEmail || !reservationData.reservationCode) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['guestEmail', 'reservationCode']
      });
    }

    const results = {
      client: null,
      admin: null,
      errors: []
    };

    // Email al cliente
    try {
      const clientEmailHtml = getClientConfirmationTemplate(reservationData);
      const clientEmail = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Casa Bella <reservas@casabellalrs.com>',
        to: [reservationData.guestEmail],
        subject: `Confirmación de Solicitud de Reserva - ${reservationData.reservationCode}`,
        html: clientEmailHtml,
        reply_to: process.env.ADMIN_EMAIL || 'info@casabellalrs.com',
      });

      results.client = {
        success: true,
        emailId: clientEmail.id,
        to: reservationData.guestEmail,
      };

      console.log('✓ Client confirmation email sent:', clientEmail.id);
    } catch (clientError) {
      console.error('✗ Error sending client email:', clientError);
      results.errors.push({
        type: 'client',
        message: clientError.message,
      });
    }

    // Email al admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'info@casabellalrs.com';
      const adminEmailHtml = getAdminNotificationTemplate(reservationData);
      const adminEmailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Casa Bella <reservas@casabellalrs.com>',
        to: [adminEmail],
        subject: `🔔 Nueva Solicitud de Reserva - ${reservationData.reservationCode}`,
        html: adminEmailHtml,
        reply_to: reservationData.guestEmail,
      });

      results.admin = {
        success: true,
        emailId: adminEmailResult.id,
        to: adminEmail,
      };

      console.log('✓ Admin notification email sent:', adminEmailResult.id);
    } catch (adminError) {
      console.error('✗ Error sending admin email:', adminError);
      results.errors.push({
        type: 'admin',
        message: adminError.message,
      });
    }

    // Determinar el código de respuesta
    const allSuccess = results.client?.success && results.admin?.success;
    const partialSuccess = (results.client?.success || results.admin?.success) && results.errors.length > 0;
    const allFailed = results.errors.length === 2;

    if (allFailed) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send both emails',
        results,
      });
    }

    if (partialSuccess) {
      return res.status(207).json({
        success: true,
        message: 'Emails sent with some errors',
        results,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'All emails sent successfully',
      results,
    });
  } catch (error) {
    console.error('Critical error in send-reservation-emails:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    });
  }
}
