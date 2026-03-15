import { Resend } from 'resend';
import { getClientConfirmationTemplate } from './templates/emailTemplates.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reservationData = req.body;

    if (!reservationData || !reservationData.guestEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailHtml = getClientConfirmationTemplate(reservationData);

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Casa Bella <reservas@casabellalrs.com>',
      to: [reservationData.guestEmail],
      subject: `Confirmación de Solicitud de Reserva - ${reservationData.reservationCode}`,
      html: emailHtml,
      reply_to: process.env.ADMIN_EMAIL || 'info@casabellalrs.com',
    });

    console.log('Client confirmation email sent:', {
      id: data.id,
      to: reservationData.guestEmail,
      code: reservationData.reservationCode,
    });

    return res.status(200).json({
      success: true,
      emailId: data.id,
      message: 'Confirmation email sent successfully',
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to send confirmation email',
      details: error.message,
    });
  }
}
