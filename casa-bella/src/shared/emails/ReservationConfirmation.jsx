import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from '@react-email/components';

export const ReservationConfirmation = ({
  reservationCode = 'RES-XXXXXX',
  guestName = 'Huésped',
  checkInDate = 'DD/MM/AAAA',
  checkOutDate = 'DD/MM/AAAA',
  numberOfNights = 0,
  numberOfGuests = 0,
  totalAmount = '$0.00',
  logoUrl = '',
  contactEmail = 'info@casabellalrs.com',
  contactPhone = '+58 414 XXX XXXX',
}) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmación de Reserva {reservationCode} - Casa Bella Los Roques</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            {logoUrl ? (
              <Img
                src={logoUrl}
                alt="Casa Bella"
                style={logo}
              />
            ) : (
              <Heading style={logoText}>Casa Bella</Heading>
            )}
            <Text style={subtitle}>Los Roques, Venezuela</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>¡Reserva Confirmada! 🎉</Heading>
            
            <Text style={text}>
              Estimado/a <strong>{guestName}</strong>,
            </Text>
            
            <Text style={text}>
              Nos complace confirmar su reserva en Casa Bella. A continuación encontrará los detalles de su estadía:
            </Text>

            {/* Reservation Details Card */}
            <Section style={detailsCard}>
              <Heading style={h2}>Detalles de la Reserva</Heading>
              
              <Section style={detailRow}>
                <Text style={detailLabel}>Código de Reserva</Text>
                <Text style={detailValue}>{reservationCode}</Text>
              </Section>

              <Hr style={divider} />

              <Row>
                <Column style={columnLeft}>
                  <Text style={detailLabel}>Check-in</Text>
                  <Text style={detailValue}>{checkInDate}</Text>
                </Column>
                <Column style={columnRight}>
                  <Text style={detailLabel}>Check-out</Text>
                  <Text style={detailValue}>{checkOutDate}</Text>
                </Column>
              </Row>

              <Hr style={divider} />

              <Row>
                <Column style={columnLeft}>
                  <Text style={detailLabel}>Noches</Text>
                  <Text style={detailValue}>{numberOfNights}</Text>
                </Column>
                <Column style={columnRight}>
                  <Text style={detailLabel}>Huéspedes</Text>
                  <Text style={detailValue}>{numberOfGuests}</Text>
                </Column>
              </Row>

              <Hr style={divider} />

              <Section style={totalSection}>
                <Text style={totalLabel}>Total</Text>
                <Text style={totalAmount}>{totalAmount}</Text>
              </Section>
            </Section>

            {/* Important Information */}
            <Section style={infoBox}>
              <Heading style={h3}>📋 Información Importante</Heading>
              <Text style={infoText}>
                • <strong>Horario de Check-in:</strong> A partir de las 14:00<br />
                • <strong>Horario de Check-out:</strong> Hasta las 11:00<br />
                • Por favor traiga una copia de esta confirmación (digital o impresa)<br />
                • Le recomendamos llegar con tiempo suficiente para disfrutar del archipiélago
              </Text>
            </Section>

            {/* Contact Section */}
            <Section style={contactSection}>
              <Heading style={h3}>📞 ¿Necesita Ayuda?</Heading>
              <Text style={text}>
                Nuestro equipo está disponible para asistirle:
              </Text>
              <Text style={contactInfo}>
                <strong>Email:</strong> <Link href={`mailto:${contactEmail}`} style={link}>{contactEmail}</Link><br />
                <strong>Teléfono:</strong> <Link href={`tel:${contactPhone}`} style={link}>{contactPhone}</Link>
              </Text>
            </Section>

            {/* Footer Message */}
            <Text style={footerMessage}>
              Estamos emocionados de recibirle en Casa Bella. ¡Prepárese para vivir una experiencia inolvidable en el paraíso caribeño!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={footerDivider} />
            <Text style={footerText}>
              © {new Date().getFullYear()} Casa Bella Los Roques. Todos los derechos reservados.
            </Text>
            <Text style={footerText}>
              Gran Roque, Archipiélago Los Roques, Venezuela
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px',
  textAlign: 'center',
  backgroundColor: '#0066cc',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
};

const logo = {
  maxWidth: '200px',
  maxHeight: '60px',
  margin: '0 auto',
};

const logoText = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '-0.5px',
};

const subtitle = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '8px 0 0',
  opacity: '0.9',
};

const content = {
  padding: '32px 24px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const h3 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const text = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const detailsCard = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #e5e7eb',
};

const detailRow = {
  marginBottom: '0',
};

const detailLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '8px 0 4px',
  fontWeight: '500',
};

const detailValue = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const columnLeft = {
  paddingRight: '12px',
};

const columnRight = {
  paddingLeft: '12px',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const totalSection = {
  marginTop: '16px',
  textAlign: 'right',
};

const totalLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 4px',
};

const totalAmount = {
  color: '#0066cc',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const infoBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid #bfdbfe',
};

const infoText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const contactSection = {
  margin: '24px 0',
};

const contactInfo = {
  color: '#525252',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '12px 0',
};

const link = {
  color: '#0066cc',
  textDecoration: 'none',
};

const footerMessage = {
  color: '#525252',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '24px 0',
  textAlign: 'center',
  fontStyle: 'italic',
};

const footer = {
  padding: '0 24px 24px',
};

const footerDivider = {
  borderColor: '#e5e7eb',
  margin: '24px 0 16px',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '4px 0',
  textAlign: 'center',
};

export default ReservationConfirmation;
