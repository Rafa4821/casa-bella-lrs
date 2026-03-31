import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  StatusBadge,
  Button,
  Select,
  TextArea,
  Loading,
  SuccessAlert,
  ErrorAlert,
  CopyButton,
} from '../../shared/components/ui';
import { 
  getReservationById, 
  updateReservationStatus,
  updateReservation,
} from '../../shared/services/reservationsService';
import { formatPrice, formatDate } from '../../shared/utils/reservationHelpers';

export const ReservationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReservation();
  }, [id]);

  const loadReservation = async () => {
    try {
      setLoading(true);
      const data = await getReservationById(id);
      setReservation(data);
      setInternalNotes(data.internalNotes || '');
      setLoading(false);
    } catch (error) {
      console.error('Error loading reservation:', error);
      setError('Error al cargar la reserva');
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      setError(null);
      
      const oldStatus = reservation.status;
      await updateReservationStatus(id, newStatus);
      setReservation({ ...reservation, status: newStatus });
      
      let message = `Estado actualizado a: ${getStatusLabel(newStatus)}`;
      
      // Add info about automatic date blocking
      if (newStatus === 'confirmed' && oldStatus === 'pending') {
        message += '. Las fechas se han bloqueado automáticamente.';
      } else if (newStatus === 'cancelled' && oldStatus === 'confirmed') {
        message += '. Las fechas bloqueadas se han liberado.';
      }
      
      setSuccess(message);
      setSaving(false);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error al actualizar el estado');
      setSaving(false);
    }
  };

  const handlePaymentStatusChange = async (newPaymentStatus) => {
    try {
      setSaving(true);
      setError(null);
      await updateReservation(id, { paymentStatus: newPaymentStatus });
      setReservation({ ...reservation, paymentStatus: newPaymentStatus });
      setSuccess(`Estado de pago actualizado a: ${getStatusLabel(newPaymentStatus)}`);
      setSaving(false);
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Error al actualizar el estado de pago');
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateReservation(id, { internalNotes });
      setSuccess('Notas guardadas correctamente');
      setSaving(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      setError('Error al guardar las notas');
      setSaving(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
      paid: 'Pagado',
      partial: 'Parcial',
    };
    return labels[status] || status;
  };

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmada' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'completed', label: 'Completada' },
  ];

  const paymentOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'partial', label: 'Parcial' },
    { value: 'paid', label: 'Pagado' },
  ];

  if (loading) {
    return <Loading message="Cargando detalles de la reserva..." />;
  }

  if (!reservation) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Reserva no encontrada</p>
        <Button onClick={() => navigate('/admin/reservas')}>
          Volver a Reservas
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-3 mb-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/reservas')}
            >
              ← Volver
            </Button>
            <h2 className="mb-0">Reserva {reservation.reservationCode}</h2>
            <CopyButton 
              text={reservation.reservationCode}
              label="Código"
            />
          </div>
          <p className="text-muted mb-0">
            Creada el {formatDate(reservation.createdAt.toDate())}
          </p>
        </div>
        <div className="d-flex gap-2">
          <StatusBadge status={reservation.status} />
          <StatusBadge status={reservation.paymentStatus} />
        </div>
      </div>

      {success && (
        <SuccessAlert 
          message={success} 
          onClose={() => setSuccess(null)} 
        />
      )}

      {error && (
        <ErrorAlert 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <Card hover={false} className="mb-4">
            <CardHeader>
              <h5 className="mb-0">Información del Huésped</h5>
            </CardHeader>
            <CardBody>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-muted small mb-1">Nombre Completo</label>
                  <div className="fw-semibold" style={{ color: 'var(--bs-body-color)' }}>{reservation.guestName}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small mb-1">Email</label>
                  <div className="d-flex align-items-center gap-2">
                    <a href={`mailto:${reservation.guestEmail}`} style={{ color: 'var(--primary)' }} className="fw-semibold">
                      {reservation.guestEmail}
                    </a>
                    <CopyButton text={reservation.guestEmail} label="" size="sm" />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small mb-1">Teléfono</label>
                  <div className="d-flex align-items-center gap-2">
                    <a href={`tel:${reservation.guestPhone}`} style={{ color: 'var(--primary)' }} className="fw-semibold">
                      {reservation.guestPhone}
                    </a>
                    <CopyButton text={reservation.guestPhone} label="" size="sm" />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small mb-1">Número de Huéspedes</label>
                  <div className="fw-semibold" style={{ color: 'var(--bs-body-color)' }}>{reservation.numberOfGuests} personas</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hover={false} className="mb-4">
            <CardHeader>
              <h5 className="mb-0">Detalles de la Estadía</h5>
            </CardHeader>
            <CardBody>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-muted small mb-1">Check-in</label>
                  <div className="fw-semibold" style={{ color: 'var(--bs-body-color)' }}>
                    {formatDate(reservation.checkInDate.toDate())}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small mb-1">Check-out</label>
                  <div className="fw-semibold" style={{ color: 'var(--bs-body-color)' }}>
                    {formatDate(reservation.checkOutDate.toDate())}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small mb-1">Número de Noches</label>
                  <div className="fw-semibold" style={{ color: 'var(--bs-body-color)' }}>{reservation.numberOfNights}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small mb-1">Método de Pago Preferido</label>
                  <div className="fw-semibold" style={{ color: 'var(--bs-body-color)' }}>{reservation.paymentMethod}</div>
                </div>
                {reservation.notes && (
                  <div className="col-12">
                    <label className="text-muted small mb-1">Notas del Huésped</label>
                    <div className="p-3 bg-light rounded">
                      {reservation.notes}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <h5 className="mb-0">Notas Internas</h5>
            </CardHeader>
            <CardBody>
              <TextArea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={5}
                placeholder="Escribe notas internas sobre esta reserva..."
              />
              <div className="d-flex justify-content-end mt-3">
                <Button 
                  onClick={handleSaveNotes}
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Notas'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card hover={false} className="mb-4">
            <CardHeader>
              <h5 className="mb-0">Estado de la Reserva</h5>
            </CardHeader>
            <CardBody>
              <label className="form-label">Estado</label>
              <Select
                value={reservation.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={statusOptions}
                disabled={saving}
              />
              
              <div className="mt-3">
                <small className="text-muted d-block mb-2">Acciones rápidas:</small>
                <div className="d-grid gap-2">
                  {reservation.status === 'pending' && (
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => handleStatusChange('confirmed')}
                      disabled={saving}
                    >
                      ✓ Confirmar Reserva
                    </Button>
                  )}
                  {reservation.status === 'confirmed' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleStatusChange('completed')}
                      disabled={saving}
                    >
                      ✓ Marcar Completada
                    </Button>
                  )}
                  {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de cancelar esta reserva?')) {
                          handleStatusChange('cancelled');
                        }
                      }}
                      disabled={saving}
                      className="text-danger border-danger"
                    >
                      × Cancelar Reserva
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hover={false} className="mb-4">
            <CardHeader>
              <h5 className="mb-0">Estado del Pago</h5>
            </CardHeader>
            <CardBody>
              <label className="form-label">Estado</label>
              <Select
                value={reservation.paymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value)}
                options={paymentOptions}
                disabled={saving}
              />
              
              {reservation.paymentStatus !== 'paid' && (
                <div className="mt-3">
                  <Button 
                    variant="success" 
                    size="sm"
                    fullWidth
                    onClick={() => handlePaymentStatusChange('paid')}
                    disabled={saving}
                  >
                    💵 Marcar como Pagado
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <h5 className="mb-0">Resumen de Pago</h5>
            </CardHeader>
            <CardBody>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total</span>
                <span className="fw-semibold">{formatPrice(reservation.totalAmount)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Pagado</span>
                <span className="fw-semibold text-success">
                  {formatPrice(reservation.paidAmount || 0)}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">Pendiente</span>
                <span className="fw-semibold text-danger">
                  {formatPrice(reservation.totalAmount - (reservation.paidAmount || 0))}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
