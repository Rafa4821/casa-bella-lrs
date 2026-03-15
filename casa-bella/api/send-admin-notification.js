import { Resend } from 'resend';
import { getAdminNotificationTemplate } from './templates/emailTemplates.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reservationData = req.body;

    if (!reservationData || !reservationData.reservationCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'info@casabellalrs.com';
    const emailHtml = getAdminNotificationTemplate(reservationData);

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Casa Bella <reservas@casabellalrs.com>',
      to: [adminEmail],
      subject: `🔔 Nueva Solicitud de Reserva - ${reservationData.reservationCode}`,
      html: emailHtml,
      reply_to: reservationData.guestEmail,
    });

    console.log('Admin notification email sent:', {
      id: data.id,
      to: adminEmail,
      code: reservationData.reservationCode,
    });

    return res.status(200).json({
      success: true,
      emailId: data.id,
      message: 'Admin notification sent successfully',
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to send admin notification',
      details: error.message,
    });
  }
}
