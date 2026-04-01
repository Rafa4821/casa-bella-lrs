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
} from '../../../shared/components/ui';
import { getOrCreateLaPosadaContent, updateLaPosadaContent } from '../../../shared/services/laPosadaContentService';
import { uploadImage } from '../../../shared/services/storageService';

export const LaPosadaContentPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const content = await getOrCreateLaPosadaContent();
      setFormData(content);
      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      setError('Error al cargar el contenido');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateLaPosadaContent(formData);
      setSuccess('Contenido actualizado correctamente');
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Error al guardar el contenido');
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, section) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(section);
      setError(null);

      const imageUrl = await uploadImage(file, `la-posada/${section}`);
      
      if (section === 'hero') {
        setFormData({
          ...formData,
          hero: { ...formData.hero, backgroundImage: imageUrl }
        });
      } else if (section === 'description') {
        setFormData({
          ...formData,
          description: { ...formData.description, image: imageUrl }
        });
      } else if (section === 'location') {
        setFormData({
          ...formData,
          location: { ...formData.location, image: imageUrl }
        });
      }
      
      setSuccess('Imagen cargada correctamente');
      setUploading(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Error al cargar la imagen');
      setUploading(null);
    }
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
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

  const updateSharedSpace = (index, field, value) => {
    const newSpaces = [...formData.sharedSpaces];
    newSpaces[index] = { ...newSpaces[index], [field]: value };
    setFormData({ ...formData, sharedSpaces: newSpaces });
  };

  const updateLocationPoint = (index, field, value) => {
    const newPoints = [...formData.location.points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setFormData({
      ...formData,
      location: { ...formData.location, points: newPoints }
    });
  };

  const updateParagraph = (index, value) => {
    const newParagraphs = [...formData.description.paragraphs];
    newParagraphs[index] = value;
    setFormData({
      ...formData,
      description: { ...formData.description, paragraphs: newParagraphs }
    });
  };

  if (loading) {
    return <Loading message="Cargando contenido..." />;
  }

  if (!formData) {
    return <ErrorAlert message="Error al cargar el contenido" />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Gestión de Contenido - La Posada</h2>
        <p className="text-secondary">Administra el contenido de la página La Posada</p>
      </div>

      {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit}>
        {/* Hero Section */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Sección Hero</h5>
          </CardHeader>
          <CardBody>
            <Input
              label="Título"
              value={formData.hero.title}
              onChange={(e) => setFormData({
                ...formData,
                hero: { ...formData.hero, title: e.target.value }
              })}
              className="mb-3"
            />
            <Input
              label="Subtítulo"
              value={formData.hero.subtitle}
              onChange={(e) => setFormData({
                ...formData,
                hero: { ...formData.hero, subtitle: e.target.value }
              })}
              className="mb-3"
            />
            <div className="mb-3">
              <label className="form-label">Imagen de Fondo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'hero')}
                disabled={uploading === 'hero'}
              />
              {uploading === 'hero' && (
                <small className="text-primary d-block mt-2">⏳ Subiendo imagen...</small>
              )}
              {formData.hero.backgroundImage && (
                <div className="mt-3">
                  <img
                    src={formData.hero.backgroundImage}
                    alt="Hero preview"
                    style={{ maxWidth: '300px', maxHeight: '150px', objectFit: 'cover' }}
                    className="rounded"
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Description Section */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Descripción Principal</h5>
          </CardHeader>
          <CardBody>
            <Input
              label="Título de la Sección"
              value={formData.description.title}
              onChange={(e) => setFormData({
                ...formData,
                description: { ...formData.description, title: e.target.value }
              })}
              className="mb-3"
            />
            
            {formData.description.paragraphs.map((paragraph, index) => (
              <TextArea
                key={index}
                label={`Párrafo ${index + 1}`}
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
                rows={3}
                className="mb-3"
              />
            ))}

            <div className="mb-3">
              <label className="form-label">Imagen Lateral</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'description')}
                disabled={uploading === 'description'}
              />
              {uploading === 'description' && (
                <small className="text-primary d-block mt-2">⏳ Subiendo imagen...</small>
              )}
              {formData.description.image && (
                <div className="mt-3">
                  <img
                    src={formData.description.image}
                    alt="Description preview"
                    style={{ maxWidth: '300px', maxHeight: '150px', objectFit: 'cover' }}
                    className="rounded"
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Features */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Features (3 características)</h5>
          </CardHeader>
          <CardBody>
            {formData.features.map((feature, index) => (
              <div key={index} className="mb-4 pb-4 border-bottom">
                <h6 className="mb-3">Feature {index + 1}</h6>
                <Input
                  label="Icono (emoji)"
                  value={feature.icon}
                  onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                  placeholder="🏠"
                  className="mb-3"
                  maxLength={2}
                />
                <Input
                  label="Título"
                  value={feature.title}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  className="mb-3"
                />
                <TextArea
                  label="Descripción"
                  value={feature.description}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  rows={2}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Amenities */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Amenidades Principales</h5>
          </CardHeader>
          <CardBody>
            {formData.amenities.map((amenity, index) => (
              <div key={index} className="d-flex gap-2 mb-2">
                <Input
                  value={amenity}
                  onChange={(e) => updateAmenity(index, e.target.value)}
                  placeholder="Ej: WiFi de alta velocidad"
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
          </CardBody>
        </Card>

        {/* Shared Spaces */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Espacios Compartidos</h5>
          </CardHeader>
          <CardBody>
            {formData.sharedSpaces.map((space, index) => (
              <div key={index} className="mb-4 pb-4 border-bottom">
                <h6 className="mb-3">Espacio {index + 1}</h6>
                <Input
                  label="Nombre"
                  value={space.name}
                  onChange={(e) => updateSharedSpace(index, 'name', e.target.value)}
                  className="mb-3"
                />
                <TextArea
                  label="Descripción"
                  value={space.description}
                  onChange={(e) => updateSharedSpace(index, 'description', e.target.value)}
                  rows={2}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Location */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Ubicación</h5>
          </CardHeader>
          <CardBody>
            <Input
              label="Título"
              value={formData.location.title}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location, title: e.target.value }
              })}
              className="mb-3"
            />
            <TextArea
              label="Descripción"
              value={formData.location.description}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location, description: e.target.value }
              })}
              rows={3}
              className="mb-3"
            />

            <h6 className="mb-3">Puntos Destacados</h6>
            {formData.location.points.map((point, index) => (
              <div key={index} className="mb-3 pb-3 border-bottom">
                <Input
                  label="Icono (emoji)"
                  value={point.icon}
                  onChange={(e) => updateLocationPoint(index, 'icon', e.target.value)}
                  placeholder="📍"
                  className="mb-2"
                  maxLength={2}
                />
                <Input
                  label="Título"
                  value={point.title}
                  onChange={(e) => updateLocationPoint(index, 'title', e.target.value)}
                  className="mb-2"
                />
                <Input
                  label="Descripción"
                  value={point.description}
                  onChange={(e) => updateLocationPoint(index, 'description', e.target.value)}
                />
              </div>
            ))}

            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'location')}
                disabled={uploading === 'location'}
              />
              {uploading === 'location' && (
                <small className="text-primary d-block mt-2">⏳ Subiendo imagen...</small>
              )}
              {formData.location.image && (
                <div className="mt-3">
                  <img
                    src={formData.location.image}
                    alt="Location preview"
                    style={{ maxWidth: '300px', maxHeight: '150px', objectFit: 'cover' }}
                    className="rounded"
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <div className="d-flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" onClick={loadContent}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
