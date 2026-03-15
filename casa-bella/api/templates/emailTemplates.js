/**
 * Plantilla HTML para email de confirmación al cliente
 */
export const getClientConfirmationTemplate = (reservationData) => {
  const {
    reservationCode,
    guestName,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    numberOfNights,
    totalAmount,
    paymentMethod,
  } = reservationData;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const paymentMethodLabels = {
    transfer: 'Transferencia Bancaria',
    zelle: 'Zelle',
    paypal: 'PayPal',
    cash: 'Efectivo al llegar',
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Reserva - Casa Bella</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #16A7C9 0%, #0E7A94 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .success-badge {
      background-color: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .reservation-code {
      background-color: #f0f9ff;
      border-left: 4px solid #16A7C9;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .reservation-code-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .reservation-code-value {
      font-size: 24px;
      font-weight: 700;
      color: #16A7C9;
      letter-spacing: 0.05em;
      font-family: 'Courier New', monospace;
    }
    .details-section {
      margin: 30px 0;
    }
    .details-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6b7280;
      font-size: 14px;
    }
    .detail-value {
      color: #1f2937;
      font-weight: 600;
      font-size: 14px;
      text-align: right;
    }
    .total-row {
      background-color: #f9fafb;
      padding: 16px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .total-row .detail-label {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    .total-row .detail-value {
      font-size: 20px;
      color: #16A7C9;
      font-weight: 700;
    }
    .info-box {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box-title {
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .info-box-content {
      color: #78350f;
      font-size: 13px;
      line-height: 1.5;
    }
    .next-steps {
      background-color: #f0fdf4;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    .next-steps-title {
      font-size: 16px;
      font-weight: 600;
      color: #065f46;
      margin-bottom: 16px;
    }
    .next-steps ol {
      margin-left: 20px;
      color: #047857;
    }
    .next-steps li {
      margin-bottom: 8px;
      font-size: 14px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-content {
      color: #6b7280;
      font-size: 13px;
      line-height: 1.6;
    }
    .footer-links {
      margin-top: 16px;
    }
    .footer-link {
      color: #16A7C9;
      text-decoration: none;
      margin: 0 8px;
      font-size: 13px;
    }
    .social-links {
      margin-top: 16px;
    }
    .social-link {
      display: inline-block;
      margin: 0 8px;
      color: #6b7280;
      text-decoration: none;
      font-size: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Casa Bella</h1>
      <p>Los Roques, Venezuela</p>
    </div>

    <div class="content">
      <span class="success-badge">✓ Solicitud Recibida</span>
      
      <h2 style="font-size: 24px; color: #1f2937; margin-bottom: 16px;">
        ¡Hola ${guestName}!
      </h2>
      
      <p style="color: #4b5563; margin-bottom: 20px;">
        Hemos recibido tu solicitud de reserva para Casa Bella. Estamos revisando la disponibilidad 
        y te enviaremos la confirmación final junto con las instrucciones de pago en las próximas 24 horas.
      </p>

      <div class="reservation-code">
        <div class="reservation-code-label">Tu código de reserva</div>
        <div class="reservation-code-value">${reservationCode}</div>
      </div>

      <div class="details-section">
        <div class="details-title">Detalles de tu Reserva</div>
        
        <div class="detail-row">
          <span class="detail-label">Check-in</span>
          <span class="detail-value">${formatDate(checkInDate)}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Check-out</span>
          <span class="detail-value">${formatDate(checkOutDate)}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Noches</span>
          <span class="detail-value">${numberOfNights} ${numberOfNights === 1 ? 'noche' : 'noches'}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Huéspedes</span>
          <span class="detail-value">${numberOfGuests} ${numberOfGuests === 1 ? 'persona' : 'personas'}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Método de pago preferido</span>
          <span class="detail-value">${paymentMethodLabels[paymentMethod] || paymentMethod}</span>
        </div>
      </div>

      <div class="total-row">
        <div class="detail-row" style="border: none; padding: 0;">
          <span class="detail-label">Total Estimado</span>
          <span class="detail-value">${formatPrice(totalAmount)}</span>
        </div>
      </div>

      <div class="info-box">
        <div class="info-box-title">⚠️ Importante</div>
        <div class="info-box-content">
          Esta es una solicitud de reserva pendiente de confirmación. No se ha procesado ningún pago todavía. 
          Te enviaremos las instrucciones de pago una vez confirmemos la disponibilidad.
        </div>
      </div>

      <div class="next-steps">
        <div class="next-steps-title">Próximos Pasos</div>
        <ol>
          <li>Revisaremos tu solicitud y verificaremos la disponibilidad</li>
          <li>Te enviaremos un email de confirmación (máximo 24 horas)</li>
          <li>Recibirás las instrucciones detalladas de pago</li>
          <li>Una vez recibido el pago, tu reserva quedará confirmada</li>
        </ol>
      </div>

      <p style="color: #4b5563; margin-top: 30px;">
        Si tienes alguna pregunta, no dudes en contactarnos por WhatsApp al 
        <strong style="color: #16A7C9;">+58 414 XXX XXXX</strong> o respondiendo a este email.
      </p>

      <p style="color: #6b7280; margin-top: 20px; font-size: 14px;">
        ¡Estamos emocionados de recibirte en Casa Bella!
      </p>
    </div>

    <div class="footer">
      <div class="footer-content">
        <strong>Casa Bella Los Roques</strong><br>
        Gran Roque, Archipiélago Los Roques<br>
        Venezuela<br>
        <a href="mailto:info@casabellalrs.com" class="footer-link">info@casabellalrs.com</a>
      </div>
      
      <div class="footer-links">
        <a href="#" class="footer-link">Política de Cancelación</a>
        <a href="#" class="footer-link">Términos y Condiciones</a>
      </div>

      <div class="social-links">
        <a href="#" class="social-link">📘</a>
        <a href="#" class="social-link">📷</a>
        <a href="#" class="social-link">💬</a>
      </div>

      <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
        © ${new Date().getFullYear()} Casa Bella Los Roques. Todos los derechos reservados.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Plantilla HTML para notificación al administrador
 */
export const getAdminNotificationTemplate = (reservationData) => {
  const {
    reservationCode,
    guestName,
    guestEmail,
    guestPhone,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    numberOfNights,
    totalAmount,
    paymentMethod,
    notes,
    createdAt,
  } = reservationData;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const paymentMethodLabels = {
    transfer: 'Transferencia Bancaria',
    zelle: 'Zelle',
    paypal: 'PayPal',
    cash: 'Efectivo al llegar',
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Solicitud de Reserva - Casa Bella Admin</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .header p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
    }
    .content {
      padding: 40px 30px;
    }
    .alert-badge {
      background-color: #f59e0b;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .reservation-code {
      background-color: #1f2937;
      color: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
    }
    .reservation-code-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .reservation-code-value {
      font-size: 24px;
      font-weight: 700;
      color: #16A7C9;
      letter-spacing: 0.05em;
      font-family: 'Courier New', monospace;
    }
    .section {
      margin: 30px 0;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid #16A7C9;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 14px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
    }
    .detail-value {
      color: #1f2937;
      font-weight: 600;
      font-size: 14px;
      text-align: right;
    }
    .total-box {
      background-color: #16A7C9;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .total-label {
      font-size: 14px;
      margin-bottom: 8px;
      opacity: 0.9;
    }
    .total-value {
      font-size: 32px;
      font-weight: 700;
    }
    .notes-box {
      background-color: #fffbeb;
      border: 1px solid #fcd34d;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .notes-title {
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .notes-content {
      color: #78350f;
      font-size: 14px;
      white-space: pre-wrap;
    }
    .action-button {
      display: inline-block;
      background-color: #16A7C9;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      margin: 10px 5px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      color: #6b7280;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Nueva Solicitud de Reserva</h1>
      <p>Panel de Administración - Casa Bella</p>
    </div>

    <div class="content">
      <span class="alert-badge">⚡ Acción Requerida</span>
      
      <h2 style="font-size: 20px; color: #1f2937; margin-bottom: 16px;">
        Nueva solicitud de reserva recibida
      </h2>
      
      <p style="color: #4b5563; margin-bottom: 20px;">
        Se ha recibido una nueva solicitud de reserva que requiere tu revisión y confirmación.
      </p>

      <div class="reservation-code">
        <div class="reservation-code-label">Código de Reserva</div>
        <div class="reservation-code-value">${reservationCode}</div>
      </div>

      <div class="section">
        <div class="section-title">📋 Información del Huésped</div>
        <div class="detail-row">
          <span class="detail-label">Nombre</span>
          <span class="detail-value">${guestName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value"><a href="mailto:${guestEmail}" style="color: #16A7C9; text-decoration: none;">${guestEmail}</a></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Teléfono</span>
          <span class="detail-value"><a href="tel:${guestPhone}" style="color: #16A7C9; text-decoration: none;">${guestPhone}</a></span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📅 Detalles de la Estadía</div>
        <div class="detail-row">
          <span class="detail-label">Check-in</span>
          <span class="detail-value">${formatDate(checkInDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Check-out</span>
          <span class="detail-value">${formatDate(checkOutDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Noches</span>
          <span class="detail-value">${numberOfNights}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Huéspedes</span>
          <span class="detail-value">${numberOfGuests} ${numberOfGuests === 1 ? 'persona' : 'personas'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">💳 Información de Pago</div>
        <div class="detail-row">
          <span class="detail-label">Método Preferido</span>
          <span class="detail-value">${paymentMethodLabels[paymentMethod] || paymentMethod}</span>
        </div>
      </div>

      <div class="total-box">
        <div class="total-label">Monto Total</div>
        <div class="total-value">${formatPrice(totalAmount)}</div>
      </div>

      ${notes ? `
      <div class="notes-box">
        <div class="notes-title">📝 Notas del Huésped</div>
        <div class="notes-content">${notes}</div>
      </div>
      ` : ''}

      <div style="margin: 30px 0; padding: 20px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <p style="color: #1e40af; font-size: 14px; margin: 0;">
          <strong>Recibido:</strong> ${formatDateTime(createdAt || new Date())}
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.VITE_APP_URL || 'https://casa-bella-lrs.vercel.app'}/admin" class="action-button">
          Ver en Panel de Administración
        </a>
      </div>

      <p style="color: #6b7280; font-size: 13px; margin-top: 20px; padding: 16px; background-color: #fef3c7; border-radius: 6px;">
        <strong>⚠️ Recordatorio:</strong> Debes confirmar la disponibilidad y enviar las instrucciones de pago al cliente 
        dentro de las próximas 24 horas.
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">
        Casa Bella Admin Panel<br>
        Este es un correo automático del sistema de reservas
      </p>
    </div>
  </div>
</body>
</html>
  `;
};
