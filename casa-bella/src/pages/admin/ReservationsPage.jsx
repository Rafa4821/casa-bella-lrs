import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  DataTable, 
  StatusBadge, 
  Button, 
  Input,
  Select,
  Loading,
} from '../../shared/components/ui';
import { getAllReservations } from '../../shared/services/reservationsService';
import { formatPrice, formatDate } from '../../shared/utils/reservationHelpers';

export const ReservationsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, dateFilter, reservations]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getAllReservations();
      setReservations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading reservations:', error);
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.guestName.toLowerCase().includes(term) ||
        r.guestEmail.toLowerCase().includes(term) ||
        r.reservationCode.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Filtro por fecha
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case 'upcoming':
          filtered = filtered.filter(r => r.checkInDate.toDate() >= today);
          break;
        case 'past':
          filtered = filtered.filter(r => r.checkOutDate.toDate() < today);
          break;
        case 'current':
          filtered = filtered.filter(r => {
            const checkIn = r.checkInDate.toDate();
            const checkOut = r.checkOutDate.toDate();
            return checkIn <= today && checkOut >= today;
          });
          break;
      }
    }

    // Ordenar por fecha de creación (más recientes primero)
    filtered.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

    setFilteredReservations(filtered);
  };

  const columns = [
    {
      key: 'code',
      label: 'Código',
      render: (row) => (
        <div className="font-monospace small" style={{ color: '#6c757d' }}>{row.reservationCode}</div>
      ),
    },
    {
      key: 'guest',
      label: 'Huésped',
      render: (row) => (
        <div>
          <div className="fw-semibold" style={{ color: 'var(--bs-body-color)' }}>{row.guestName}</div>
          <small style={{ color: '#6c757d' }}>{row.guestEmail}</small>
        </div>
      ),
    },
    {
      key: 'dates',
      label: 'Fechas',
      render: (row) => (
        <div>
          <div className="small" style={{ color: 'var(--bs-body-color)' }}>
            {formatDate(row.checkInDate.toDate())}
          </div>
          <small style={{ color: '#6c757d' }}>
            hasta {formatDate(row.checkOutDate.toDate())}
          </small>
        </div>
      ),
    },
    {
      key: 'nights',
      label: 'Noches',
      render: (row) => (
        <div className="text-center" style={{ color: 'var(--bs-body-color)' }}>{row.numberOfNights}</div>
      ),
    },
    {
      key: 'guests',
      label: 'Huéspedes',
      render: (row) => (
        <div className="text-center" style={{ color: 'var(--bs-body-color)' }}>{row.numberOfGuests}</div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'payment',
      label: 'Pago',
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      key: 'total',
      label: 'Total',
      render: (row) => (
        <div className="fw-semibold" style={{ color: 'var(--bs-body-color)' }}>{formatPrice(row.totalAmount)}</div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/reservas/${row.id}`);
          }}
        >
          Ver
        </Button>
      ),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmada' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'completed', label: 'Completada' },
  ];

  const dateOptions = [
    { value: 'all', label: 'Todas las fechas' },
    { value: 'upcoming', label: 'Próximas' },
    { value: 'current', label: 'Activas' },
    { value: 'past', label: 'Pasadas' },
  ];

  if (loading) {
    return <Loading message="Cargando reservas..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Reservas</h2>
          <p className="text-muted mb-0">
            {filteredReservations.length} de {reservations.length} reservas
          </p>
        </div>
      </div>

      <Card hover={false} className="mb-4">
        <CardBody>
          <div className="row g-3">
            <div className="col-md-4">
              <Input
                type="text"
                placeholder="Buscar por nombre, email o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
            </div>
            <div className="col-md-4">
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                options={dateOptions}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card hover={false}>
        <CardBody className="p-0">
          {filteredReservations.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredReservations}
              onRowClick={(row) => navigate(`/admin/reservas/${row.id}`)}
            />
          ) : (
            <div className="text-center py-5">
              <p className="text-muted mb-0">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'No se encontraron reservas con los filtros aplicados'
                  : 'No hay reservas registradas'}
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
