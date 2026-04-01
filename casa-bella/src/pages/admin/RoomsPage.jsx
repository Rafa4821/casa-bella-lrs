import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  TextArea,
  Loading,
  SuccessAlert,
  ErrorAlert,
} from '../../shared/components/ui';
import { getRooms, createRoom, updateRoom, deleteRoom, createDefaultRooms } from '../../shared/services/roomsService';
import { uploadImage, deleteImage } from '../../shared/services/storageService';

export const RoomsPage = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    capacity: '',
    beds: '',
    size: '',
    amenities: [''],
    order: 0,
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      await createDefaultRooms(); // Create default rooms if none exist
      const data = await getRooms();
      setRooms(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading rooms:', error);
      setError('Error al cargar las habitaciones');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.image) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const roomData = {
        ...formData,
        amenities: formData.amenities.filter(a => a.trim() !== ''),
      };

      if (editingRoom) {
        await updateRoom(editingRoom.id, roomData);
        setSuccess('Habitación actualizada correctamente');
      } else {
        await createRoom(roomData);
        setSuccess('Habitación creada correctamente');
      }

      await loadRooms();
      resetForm();
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving room:', error);
      setError('Error al guardar la habitación');
      setSaving(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      image: room.image,
      capacity: room.capacity,
      beds: room.beds,
      size: room.size,
      amenities: room.amenities && room.amenities.length > 0 ? room.amenities : [''],
      order: room.order || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (room) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${room.name}"?`)) {
      return;
    }

    try {
      setError(null);
      await deleteRoom(room.id);
      
      // Delete image from storage if it's a Firebase URL
      if (room.image && room.image.includes('firebase')) {
        await deleteImage(room.image);
      }
      
      setSuccess('Habitación eliminada correctamente');
      await loadRooms();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting room:', error);
      setError('Error al eliminar la habitación');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Delete old image if exists and it's a Firebase URL
      if (formData.image && formData.image.includes('firebase')) {
        await deleteImage(formData.image);
      }

      const imageUrl = await uploadImage(file, 'rooms');
      setFormData({ ...formData, image: imageUrl });
      
      setSuccess('Imagen cargada correctamente');
      setUploading(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Error al cargar la imagen');
      setUploading(false);
    }
  };

  const updateAmenity = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData({ ...formData, amenities: newAmenities });
  };

  const addAmenity = () => {
    setFormData({
      ...formData,
      amenities: [...formData.amenities, '']
    });
  };

  const removeAmenity = (index) => {
    const newAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData({ ...formData, amenities: newAmenities });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      capacity: '',
      beds: '',
      size: '',
      amenities: [''],
      order: 0,
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  if (loading) {
    return <Loading message="Cargando habitaciones..." />;
  }

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2>Gestión de Habitaciones</h2>
          <p className="text-secondary">Administra las habitaciones de la posada</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Ver Lista' : '+ Nueva Habitación'}
        </Button>
      </div>

      {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {showForm ? (
        <Card hover={false}>
          <CardHeader>
            <h5 className="mb-0">{editingRoom ? 'Editar Habitación' : 'Nueva Habitación'}</h5>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Input
                label="Nombre de la Habitación *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Habitación Vista al Mar"
                className="mb-3"
                required
              />

              <div className="mb-3">
                <label className="form-label">Imagen Principal *</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && (
                  <small className="text-primary d-block mt-2">⏳ Subiendo imagen...</small>
                )}
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-md-4">
                  <Input
                    label="Capacidad"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Ej: 2 personas"
                    className="mb-3"
                  />
                </div>
                <div className="col-md-4">
                  <Input
                    label="Tipo de Camas"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    placeholder="Ej: Cama matrimonial"
                    className="mb-3"
                  />
                </div>
                <div className="col-md-4">
                  <Input
                    label="Tamaño"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="Ej: 18 m²"
                    className="mb-3"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Amenidades/Comodidades</label>
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="d-flex gap-2 mb-2">
                    <Input
                      value={amenity}
                      onChange={(e) => updateAmenity(index, e.target.value)}
                      placeholder="Ej: Aire acondicionado"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAmenity(index)}
                    >
                      🗑️
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAmenity}
                  className="mt-2"
                >
                  + Agregar Amenidad
                </Button>
              </div>

              <Input
                label="Orden de Visualización"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="mb-3"
                min="0"
              />

              <div className="d-flex gap-3">
                <Button type="submit" disabled={saving || uploading}>
                  {saving ? 'Guardando...' : editingRoom ? 'Actualizar' : 'Crear Habitación'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : (
        <div className="row g-4">
          {rooms.length === 0 ? (
            <div className="col-12">
              <Card hover={false}>
                <CardBody className="text-center py-5">
                  <p className="text-muted mb-3">No hay habitaciones creadas</p>
                  <Button onClick={() => setShowForm(true)}>
                    + Crear Primera Habitación
                  </Button>
                </CardBody>
              </Card>
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="col-md-6 col-lg-4">
                <Card hover>
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={room.image}
                      alt={room.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <CardBody>
                    <h5 className="mb-2">{room.name}</h5>
                    <div className="mb-3">
                      {room.capacity && (
                        <small className="d-block text-muted">👥 {room.capacity}</small>
                      )}
                      {room.beds && (
                        <small className="d-block text-muted">🛏️ {room.beds}</small>
                      )}
                      {room.size && (
                        <small className="d-block text-muted">📐 {room.size}</small>
                      )}
                    </div>
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Amenidades:</small>
                        <ul className="small mb-0 ps-3">
                          {room.amenities.slice(0, 3).map((amenity, idx) => (
                            <li key={idx}>{amenity}</li>
                          ))}
                          {room.amenities.length > 3 && (
                            <li>+{room.amenities.length - 3} más</li>
                          )}
                        </ul>
                      </div>
                    )}
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(room)}>
                        ✏️ Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(room)}>
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
