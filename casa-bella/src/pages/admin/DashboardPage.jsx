import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, DataTable, StatusBadge, Button, Loading } from '../../shared/components/ui';
import { useDashboardStats } from '../../shared/hooks/useDashboardStats';
import { formatPrice, formatDate } from '../../shared/utils/reservationHelpers';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { loading, stats, recentReservations } = useDashboardStats();

  if (loading) {
    return <Loading message="Cargando estadísticas..." />;
  }

  const statCards = [
    {
      title: 'Total Solicitudes',
      value: stats.totalRequests.toString(),
      icon: '📊',
      color: 'primary',
    },
    {
      title: 'Pendientes',
      value: stats.pending.toString(),
      icon: '⏳',
      color: 'warning',
    },
    {
      title: 'Confirmadas',
      value: stats.confirmed.toString(),
      icon: '✅',
      color: 'success',
    },
    {
      title: 'Canceladas',
      value: stats.cancelled.toString(),
      icon: '❌',
      color: 'danger',
    },
  ];

  const columns = [
    {
      key: 'code',
      label: 'Código',
      render: (row) => (
        <div className="font-monospace text-muted small">{row.reservationCode}</div>
      ),
    },
    {
      key: 'guest',
      label: 'Huésped',
      render: (row) => (
        <div>
          <div className="fw-semibold">{row.guestName}</div>
          <small className="text-muted">{row.guestEmail}</small>
        </div>
      ),
    },
    {
      key: 'dates',
      label: 'Check-in',
      render: (row) => (
        <div>
          <div className="small">{formatDate(row.checkInDate.toDate())}</div>
          <small className="text-muted">{row.numberOfNights} noches</small>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'total',
      label: 'Total',
      render: (row) => <span className="fw-semibold">{formatPrice(row.totalAmount)}</span>,
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
          Ver Detalle
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Resumen general de Casa Bella</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {statCards.map((stat, index) => (
          <div key={index} className="col-md-6 col-xl-3">
            <Card hover={false}>
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                      {stat.title}
                    </p>
                    <h3 className="mb-0 fw-bold">{stat.value}</h3>
                  </div>
                  <div className={`bg-${stat.color} bg-opacity-10 rounded p-2`} style={{ fontSize: '1.5rem' }}>
                    {stat.icon}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <Card hover={false}>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Solicitudes Recientes</h5>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin/reservas')}
                >
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {recentReservations.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={recentReservations}
                  onRowClick={(row) => navigate(`/admin/reservas/${row.id}`)}
                />
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">No hay reservas recientes</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card hover={false}>
            <CardHeader>
              <h5 className="mb-0">Próximas Entradas</h5>
            </CardHeader>
            <CardBody>
              {stats.upcomingCheckIns.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {stats.upcomingCheckIns.map((reservation, index) => (
                    <div 
                      key={index} 
                      className="d-flex justify-content-between align-items-start p-3 bg-light rounded cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/reservas/${reservation.id}`)}
                    >
                      <div>
                        <div className="fw-semibold">{reservation.guestName}</div>
                        <small className="text-muted">
                          {formatDate(reservation.checkInDate.toDate())}
                        </small>
                      </div>
                      <div className="text-end">
                        <div className="small text-muted">{reservation.numberOfGuests} huéspedes</div>
                        <div className="small fw-semibold text-primary">
                          {formatPrice(reservation.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0 small">No hay entradas programadas para la próxima semana</p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card hover={false} className="mt-4">
            <CardHeader>
              <h5 className="mb-0">Acciones Rápidas</h5>
            </CardHeader>
            <CardBody>
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => navigate('/admin/reservas')}
                >
                  📅 Ver Reservas
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => navigate('/admin/tarifas')}
                >
                  💰 Gestionar Tarifas
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => navigate('/admin/fechas-bloqueadas')}
                >
                  🚫 Fechas Bloqueadas
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => navigate('/admin/configuracion')}
                >
                  ⚙️ Configuración
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
