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
import { getOrCreateHomeContent, updateHomeContent } from '../../../shared/services/homeContentService';
import { uploadImage, deleteImage } from '../../../shared/services/storageService';

export const HomeContentPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    hero: {
      title: '',
      subtitle: '',
      backgroundImage: '',
    },
    features: [],
    testimonials: [],
    discoverSection: {
      title: '',
      description: '',
      benefits: [],
      image: '',
    },
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const content = await getOrCreateHomeContent();
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
      await updateHomeContent(formData);
      setSuccess('Contenido actualizado correctamente');
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Error al guardar el contenido');
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, section, field = 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(`${section}-${field}`);
      setError(null);

      const imageUrl = await uploadImage(file, `home/${section}`);
      
      if (section === 'hero') {
        setFormData({
          ...formData,
          hero: { ...formData.hero, backgroundImage: imageUrl }
        });
      } else if (section === 'discover') {
        setFormData({
          ...formData,
          discoverSection: { ...formData.discoverSection, image: imageUrl }
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

  const updateTestimonial = (index, field, value) => {
    const newTestimonials = [...formData.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setFormData({ ...formData, testimonials: newTestimonials });
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...formData.discoverSection.benefits];
    newBenefits[index] = value;
    setFormData({
      ...formData,
      discoverSection: { ...formData.discoverSection, benefits: newBenefits }
    });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      discoverSection: {
        ...formData.discoverSection,
        benefits: [...formData.discoverSection.benefits, '']
      }
    });
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.discoverSection.benefits.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      discoverSection: { ...formData.discoverSection, benefits: newBenefits }
    });
  };

  if (loading) {
    return <Loading message="Cargando contenido..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Gestión de Contenido - Página Inicio</h2>
        <p className="text-secondary">Administra el contenido de la página de inicio</p>
      </div>

      {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit}>
        {/* Hero Section */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Sección Hero (Banner Principal)</h5>
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
                disabled={uploading === 'hero-image'}
              />
              {uploading === 'hero-image' && (
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

        {/* Features Section */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">¿Por qué Casa Bella? (Features)</h5>
          </CardHeader>
          <CardBody>
            {formData.features.map((feature, index) => (
              <div key={index} className="mb-4 pb-4 border-bottom">
                <h6 className="mb-3">Feature {index + 1}</h6>
                <Input
                  label="Icono (emoji)"
                  value={feature.icon}
                  onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                  placeholder="🏖️"
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
                  rows={3}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Testimonials Section */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Testimonios</h5>
          </CardHeader>
          <CardBody>
            {formData.testimonials.map((testimonial, index) => (
              <div key={index} className="mb-4 pb-4 border-bottom">
                <h6 className="mb-3">Testimonio {index + 1}</h6>
                <Input
                  label="Nombre del Huésped"
                  value={testimonial.author}
                  onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                  className="mb-3"
                />
                <TextArea
                  label="Texto del Testimonio"
                  value={testimonial.text}
                  onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <Input
                  label="Rating (1-5 estrellas)"
                  type="number"
                  min="1"
                  max="5"
                  value={testimonial.rating}
                  onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Discover Section */}
        <Card hover={false} className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Sección "Descubre el Paraíso"</h5>
          </CardHeader>
          <CardBody>
            <Input
              label="Título"
              value={formData.discoverSection.title}
              onChange={(e) => setFormData({
                ...formData,
                discoverSection: { ...formData.discoverSection, title: e.target.value }
              })}
              className="mb-3"
            />
            <TextArea
              label="Descripción"
              value={formData.discoverSection.description}
              onChange={(e) => setFormData({
                ...formData,
                discoverSection: { ...formData.discoverSection, description: e.target.value }
              })}
              rows={4}
              className="mb-3"
            />
            
            <div className="mb-3">
              <label className="form-label fw-semibold">Beneficios (Lista)</label>
              {formData.discoverSection.benefits.map((benefit, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Ej: Acceso directo a playas paradisíacas"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeBenefit(index)}
                  >
                    🗑️
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBenefit}
                className="mt-2"
              >
                + Agregar Beneficio
              </Button>
            </div>

            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'discover')}
                disabled={uploading === 'discover-image'}
              />
              {uploading === 'discover-image' && (
                <small className="text-primary d-block mt-2">⏳ Subiendo imagen...</small>
              )}
              {formData.discoverSection.image && (
                <div className="mt-3">
                  <img
                    src={formData.discoverSection.image}
                    alt="Discover preview"
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
