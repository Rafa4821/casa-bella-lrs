import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  TextArea,
  DataTable,
  Loading,
  SuccessAlert,
  ErrorAlert,
} from '../../shared/components/ui';
import {
  getAllBlockedDates,
  createBlockedDate,
  updateBlockedDate,
  deleteBlockedDate,
} from '../../shared/services/blockedDatesService';
import { formatDate } from '../../shared/utils/reservationHelpers';

export const BlockedDatesPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    loadBlockedDates();
  }, []);

  const loadBlockedDates = async () => {
    try {
      setLoading(true);
      const data = await getAllBlockedDates();
      setBlockedDates(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading blocked dates:', error);
      setError('Error al cargar las fechas bloqueadas');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const blockData = {
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        reason: formData.reason,
      };

      if (editingBlock) {
        await updateBlockedDate(editingBlock.id, blockData);
        setSuccess('Bloqueo actualizado correctamente');
      } else {
        await createBlockedDate(blockData);
        setSuccess('Fechas bloqueadas correctamente');
      }

      resetForm();
      loadBlockedDates();
      setSaving(false);
    } catch (error) {
      console.error('Error saving blocked dates:', error);
      setError(error.message || 'Error al guardar el bloqueo');
      setSaving(false);
    }
  };

  const handleEdit = (block) => {
    setEditingBlock(block);
    setFormData({
      startDate: block.startDate.toDate().toISOString().split('T')[0],
      endDate: block.endDate.toDate().toISOString().split('T')[0],
      reason: block.reason || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este bloqueo?')) {
      return;
    }

    try {
      setSaving(true);
      await deleteBlockedDate(id);
      setSuccess('Bloqueo eliminado correctamente');
      loadBlockedDates();
      setSaving(false);
    } catch (error) {
      console.error('Error deleting blocked date:', error);
      setError('Error al eliminar el bloqueo');
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      startDate: '',
      endDate: '',
      reason: '',
    });
    setEditingBlock(null);
    setShowForm(false);
  };

  const columns = [
    {
      key: 'period',
      label: 'Período Bloqueado',
      render: (row) => (
        <div>
          <div className="fw-semibold">
            {formatDate(row.startDate.toDate())}
          </div>
          <small className="text-muted">
            hasta {formatDate(row.endDate.toDate())}
          </small>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duración',
      render: (row) => {
        const start = row.startDate.toDate();
        const end = row.endDate.toDate();
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return <div className="text-center">{days} {days === 1 ? 'día' : 'días'}</div>;
      },
    },
    {
      key: 'reason',
      label: 'Motivo',
      render: (row) => (
        <div>
          {row.reason || <span className="text-muted">Sin especificar</span>}
        </div>
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
    return <Loading message="Cargando fechas bloqueadas..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Fechas Bloqueadas</h2>
          <p className="text-muted mb-0">
            Gestiona períodos no disponibles para reservas
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            + Bloquear Fechas
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
                {editingBlock ? 'Editar Bloqueo' : 'Nuevo Bloqueo'}
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
                  <TextArea
                    label="Motivo (opcional)"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    placeholder="Ej: Mantenimiento, evento privado, etc."
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : editingBlock ? 'Actualizar' : 'Crear Bloqueo'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card hover={false}>
        <CardBody className="p-0">
          {blockedDates.length > 0 ? (
            <DataTable columns={columns} data={blockedDates} />
          ) : (
            <div className="text-center py-5">
              <p className="text-muted mb-3">No hay fechas bloqueadas</p>
              <Button onClick={() => setShowForm(true)}>
                Bloquear Primeras Fechas
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
