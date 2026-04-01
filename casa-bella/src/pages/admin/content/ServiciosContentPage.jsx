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
import { getOrCreateServiciosContent, updateServiciosContent } from '../../../shared/services/serviciosContentService';
import { uploadImage } from '../../../shared/services/storageService';

export const ServiciosContentPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const content = await getOrCreateServiciosContent();
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
      await updateServiciosContent(formData);
      setSuccess('Contenido actualizado correctamente');
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Error al guardar el contenido');
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const imageUrl = await uploadImage(file, 'servicios/hero');
      setFormData({
        ...formData,
        hero: { ...formData.hero, backgroundImage: imageUrl }
      });
      
      setSuccess('Imagen cargada correctamente');
      setUploading(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Error al cargar la imagen');
      setUploading(false);
    }
  };

  const updateIncludedService = (index, field, value) => {
    const newServices = [...formData.includedServices];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, includedServices: newServices });
  };

  const addIncludedService = () => {
    setFormData({
      ...formData,
      includedServices: [...formData.includedServices, { icon: '', title: '', description: '' }]
    });
  };

  const removeIncludedService = (index) => {
    const newServices = formData.includedServices.filter((_, i) => i !== index);
    setFormData({ ...formData, includedServices: newServices });
  };

  const updateAdditionalService = (index, field, value) => {
    const newServices = [...formData.additionalServices];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, additionalServices: newServices });
  };

  const addAdditionalService = () => {
    setFormData({
      ...formData,
      additionalServices: [...formData.additionalServices, { title: '', description: '', price: '', badge: '' }]
    });
  };

  const removeAdditionalService = (index) => {
    const newServices = formData.additionalServices.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalServices: newServices });
  };

  const updateRecommendation = (index, field, value) => {
    const newRecs = [...formData.recommendations];
    newRecs[index] = { ...newRecs[index], [field]: value };
    setFormData({ ...formData, recommendations: newRecs });
  };

  const addRecommendation = () => {
    setFormData({
      ...formData,
      recommendations: [...formData.recommendations, { title: '', description: '', icon: '' }]
    });
  };

  const removeRecommendation = (index) => {
    const newRecs = formData.recommendations.filter((_, i) => i !== index);
    setFormData({ ...formData, recommendations: newRecs });
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
        <h2>Gestión de Contenido - Servicios</h2>
        <p className="text-secondary">Administra los servicios y recomendaciones</p>
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
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
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

        {/* Included Services */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Servicios Incluidos</h5>
              <Button type="button" size="sm" onClick={addIncludedService}>
                + Agregar
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {formData.includedServices.map((service, index) => (
              <div key={index} className="mb-4 pb-4 border-bottom">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6>Servicio {index + 1}</h6>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIncludedService(index)}
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
                <Input
                  label="Icono (emoji)"
                  value={service.icon}
                  onChange={(e) => updateIncludedService(index, 'icon', e.target.value)}
                  placeholder="🏠"
                  className="mb-3"
                  maxLength={2}
                />
                <Input
                  label="Título"
                  value={service.title}
                  onChange={(e) => updateIncludedService(index, 'title', e.target.value)}
                  className="mb-3"
                />
                <TextArea
                  label="Descripción"
                  value={service.description}
                  onChange={(e) => updateIncludedService(index, 'description', e.target.value)}
                  rows={2}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Additional Services */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Servicios Adicionales (Con Precio)</h5>
              <Button type="button" size="sm" onClick={addAdditionalService}>
                + Agregar
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {formData.additionalServices.map((service, index) => (
              <div key={index} className="mb-4 pb-4 border-bottom">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6>Servicio Adicional {index + 1}</h6>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAdditionalService(index)}
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
                <Input
                  label="Título"
                  value={service.title}
                  onChange={(e) => updateAdditionalService(index, 'title', e.target.value)}
                  className="mb-3"
                />
                <TextArea
                  label="Descripción"
                  value={service.description}
                  onChange={(e) => updateAdditionalService(index, 'description', e.target.value)}
                  rows={2}
                  className="mb-3"
                />
                <Input
                  label="Precio"
                  value={service.price}
                  onChange={(e) => updateAdditionalService(index, 'price', e.target.value)}
                  placeholder="$80 por persona"
                  className="mb-3"
                />
                <Input
                  label="Badge (Opcional)"
                  value={service.badge}
                  onChange={(e) => updateAdditionalService(index, 'badge', e.target.value)}
                  placeholder="Ej: Recomendado, Popular, Opcional"
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Recommendations */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recomendaciones Locales</h5>
              <Button type="button" size="sm" onClick={addRecommendation}>
                + Agregar
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {formData.recommendations.map((rec, index) => (
              <div key={index} className="mb-4 pb-4 border-bottom">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6>Recomendación {index + 1}</h6>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRecommendation(index)}
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
                <Input
                  label="Icono (emoji)"
                  value={rec.icon}
                  onChange={(e) => updateRecommendation(index, 'icon', e.target.value)}
                  placeholder="🍽️"
                  className="mb-3"
                  maxLength={2}
                />
                <Input
                  label="Título"
                  value={rec.title}
                  onChange={(e) => updateRecommendation(index, 'title', e.target.value)}
                  className="mb-3"
                />
                <TextArea
                  label="Descripción"
                  value={rec.description}
                  onChange={(e) => updateRecommendation(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            ))}
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
