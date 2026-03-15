import { useState } from 'react';
import { createReservation } from '../services/reservationsService';
import { getBlockedDates, isDateRangeAvailable } from '../services/blockedDatesService';
import { getActiveRateForDate } from '../services/ratesService';
import {
  generateReservationCode,
  calculateNights,
  validateDates,
  calculateTotalPrice,
  isValidEmail,
  isValidPhone,
} from '../utils/reservationHelpers';

export const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState(null);

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    paymentMethod: '',
    acceptTerms: false,
  });

  const [pricing, setPricing] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);

  /**
   * Carga las fechas bloqueadas
   */
  const loadBlockedDates = async () => {
    try {
      const today = new Date();
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

      const dates = await getBlockedDates(today, threeMonthsLater);
      setBlockedDates(dates);
    } catch (err) {
      console.error('Error loading blocked dates:', err);
    }
  };

  /**
   * Valida disponibilidad de fechas
   */
  const checkAvailability = async (checkIn, checkOut) => {
    try {
      setError(null);

      const dateValidation = validateDates(checkIn, checkOut);
      if (!dateValidation.valid) {
        setError(dateValidation.error);
        return false;
      }

      const available = await isDateRangeAvailable(new Date(checkIn), new Date(checkOut));
      if (!available) {
        setError('Las fechas seleccionadas no están disponibles. Por favor elige otras fechas.');
        return false;
      }

      return true;
    } catch (err) {
      setError('Error al verificar disponibilidad. Por favor intenta de nuevo.');
      return false;
    }
  };

  /**
   * Calcula el precio para las fechas seleccionadas
   */
  const calculatePrice = async (checkIn, checkOut) => {
    try {
      setError(null);
      setPricing(null);

      if (!checkIn || !checkOut) return;

      const nights = calculateNights(checkIn, checkOut);
      
      // Intentar obtener la tarifa de Firestore
      let rate = null;
      try {
        rate = await getActiveRateForDate(new Date(checkIn));
      } catch (rateError) {
        console.warn('Error fetching rate from Firestore:', rateError);
      }

      // Si no hay tarifa en Firestore, usar tarifa por defecto
      if (!rate) {
        console.warn('No rate found in Firestore, using default rate');
        rate = {
          pricePerNight: 200, // Precio por defecto: $200 por noche
          name: 'Tarifa Estándar',
          type: 'standard'
        };
      }

      const pricing = calculateTotalPrice(nights, rate.pricePerNight);
      setPricing(pricing);
      return pricing;
    } catch (err) {
      console.error('Error calculating price:', err);
      setError('Error al calcular el precio. Por favor intenta de nuevo.');
      return null;
    }
  };

  /**
   * Actualiza el formulario
   */
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'checkIn' || field === 'checkOut') {
      const checkIn = field === 'checkIn' ? value : formData.checkIn;
      const checkOut = field === 'checkOut' ? value : formData.checkOut;

      if (checkIn && checkOut) {
        checkAvailability(checkIn, checkOut);
        calculatePrice(checkIn, checkOut);
      }
    }
  };

  /**
   * Valida el formulario completo
   */
  const validateForm = () => {
    if (!formData.checkIn || !formData.checkOut) {
      setError('Debes seleccionar las fechas de tu estadía');
      return false;
    }

    if (!formData.guests || formData.guests < 1 || formData.guests > 8) {
      setError('Debes indicar el número de huéspedes (1-8)');
      return false;
    }

    if (!formData.name || formData.name.trim().length < 3) {
      setError('Debes ingresar tu nombre completo');
      return false;
    }

    if (!isValidEmail(formData.email)) {
      setError('Debes ingresar un email válido');
      return false;
    }

    if (!isValidPhone(formData.phone)) {
      setError('Debes ingresar un teléfono válido');
      return false;
    }

    if (!formData.paymentMethod) {
      setError('Debes seleccionar un método de pago preferido');
      return false;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar las políticas de cancelación');
      return false;
    }

    return true;
  };

  /**
   * Envía la solicitud de reserva
   */
  const submitReservation = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const isAvailable = await checkAvailability(formData.checkIn, formData.checkOut);
      if (!isAvailable) {
        setLoading(false);
        return;
      }

      // Recalcular precio antes de enviar para asegurar que esté actualizado
      const finalPricing = await calculatePrice(formData.checkIn, formData.checkOut);
      
      if (!finalPricing) {
        setError('No se pudo calcular el precio. Por favor intenta de nuevo.');
        setLoading(false);
        return;
      }

      const code = generateReservationCode();
      const nights = calculateNights(formData.checkIn, formData.checkOut);

      const reservationData = {
        reservationCode: code,
        guestName: formData.name.trim(),
        guestEmail: formData.email.trim(),
        guestPhone: formData.phone.trim(),
        checkInDate: new Date(formData.checkIn),
        checkOutDate: new Date(formData.checkOut),
        numberOfGuests: parseInt(formData.guests),
        numberOfNights: nights,
        totalAmount: finalPricing.total,
        status: 'pending',
        paymentStatus: 'pending',
        paidAmount: 0,
        notes: formData.notes.trim(),
        paymentMethod: formData.paymentMethod,
      };

      const reservationId = await createReservation(reservationData);

      // Enviar emails de confirmación
      try {
        const emailData = {
          ...reservationData,
          createdAt: new Date(),
        };

        const response = await fetch('/api/send-reservation-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        const emailResult = await response.json();
        
        if (!emailResult.success) {
          console.warn('Email sending had issues:', emailResult);
          // No bloqueamos el flujo si falla el email
        } else {
          console.log('Emails sent successfully:', emailResult);
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // No bloqueamos el flujo si falla el email
      }

      setReservationCode(code);
      setSuccess(true);
      setLoading(false);

      setFormData({
        checkIn: '',
        checkOut: '',
        guests: '',
        name: '',
        email: '',
        phone: '',
        notes: '',
        paymentMethod: '',
        acceptTerms: false,
      });
      setPricing(null);

      return { id: reservationId, code };
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError(err.message || 'Error al crear la reserva. Por favor intenta de nuevo.');
      setLoading(false);
      return null;
    }
  };

  return {
    formData,
    updateFormData,
    pricing,
    blockedDates,
    loading,
    error,
    success,
    reservationCode,
    loadBlockedDates,
    checkAvailability,
    calculatePrice,
    submitReservation,
    setError,
    setSuccess,
  };
};
