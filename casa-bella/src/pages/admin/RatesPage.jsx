import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  DataTable,
  Loading,
  SuccessAlert,
  ErrorAlert,
} from '../../shared/components/ui';
import {
  getAllRates,
  createRate,
  updateRate,
  deleteRate,
} from '../../shared/services/ratesService';
import { formatPrice, formatDate } from '../../shared/utils/reservationHelpers';

export const RatesPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rates, setRates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    pricePerNight: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      setLoading(true);
      const data = await getAllRates();
      setRates(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading rates:', error);
      setError('Error al cargar las tarifas');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      const rateData = {
        name: formData.name,
        pricePerNight: parseFloat(formData.pricePerNight),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        description: formData.description,
        currency: 'USD',
        isActive: true,
      };

      if (editingRate) {
        await updateRate(editingRate.id, rateData);
        setSuccess('Tarifa actualizada correctamente');
      } else {
        await createRate(rateData);
        setSuccess('Tarifa creada correctamente');
      }

      resetForm();
      loadRates();
      setSaving(false);
    } catch (error) {
      console.error('Error saving rate:', error);
      setError(error.message || 'Error al guardar la tarifa');
      setSaving(false);
    }
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setFormData({
      name: rate.name,
      pricePerNight: rate.pricePerNight.toString(),
      startDate: rate.startDate.toDate().toISOString().split('T')[0],
      endDate: rate.endDate.toDate().toISOString().split('T')[0],
      description: rate.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarifa?')) {
      return;
    }

    try {
      setSaving(true);
      await deleteRate(id);
      setSuccess('Tarifa eliminada correctamente');
      loadRates();
      setSaving(false);
    } catch (error) {
      console.error('Error deleting rate:', error);
      setError('Error al eliminar la tarifa');
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      pricePerNight: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setEditingRate(null);
    setShowForm(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (row) => (
        <div>
          <div className="fw-semibold">{row.name}</div>
          {row.description && (
            <small className="text-muted">{row.description}</small>
          )}
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Período',
      render: (row) => (
        <div>
          <div className="small">
            {formatDate(row.startDate.toDate())}
          </div>
          <small className="text-muted">
            hasta {formatDate(row.endDate.toDate())}
          </small>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Precio por Noche',
      render: (row) => (
        <div className="fw-semibold text-primary">
          {formatPrice(row.pricePerNight)}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (row) => (
        <span className={`badge ${row.isActive ? 'bg-success' : 'bg-secondary'}`}>
          {row.isActive ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="d-flex gap-2 justify-content-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="text-danger border-danger"
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading message="Cargando tarifas..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Tarifas</h2>
          <p className="text-muted mb-0">
            Gestiona los precios por noche según temporada
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            + Nueva Tarifa
          </Button>
        )}
      </div>

      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess(null)} />
      )}

      {error && (
        <ErrorAlert message={error} onClose={() => setError(null)} />
      )}

      {showForm && (
        <Card hover={false} className="mb-4">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {editingRate ? 'Editar Tarifa' : 'Nueva Tarifa'}
              </h5>
              <Button variant="outline" size="sm" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <Input
                    label="Nombre de la Tarifa"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ej: Temporada Alta"
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="Precio por Noche (USD)"
                    type="number"
                    step="0.01"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    required
                    placeholder="150.00"
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="Fecha de Inicio"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="Fecha de Fin"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <Input
                    label="Descripción (opcional)"
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ej: Navidad y Año Nuevo"
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : editingRate ? 'Actualizar' : 'Crear Tarifa'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card hover={false}>
        <CardBody className="p-0">
          {rates.length > 0 ? (
            <DataTable columns={columns} data={rates} />
          ) : (
            <div className="text-center py-5">
              <p className="text-muted mb-3">No hay tarifas registradas</p>
              <Button onClick={() => setShowForm(true)}>
                Crear Primera Tarifa
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
