import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Loading,
  SuccessAlert,
  ErrorAlert,
} from '../../shared/components/ui';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getGalleryCategories,
  updateGalleryCategories,
  createDefaultCategories,
} from '../../shared/services/galleryService';
import { uploadImage, deleteImage } from '../../shared/services/storageService';

export const GalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCategoriesForm, setShowCategoriesForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    description: '',
    category: 'exterior',
  });

  const [categoriesFormData, setCategoriesFormData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await createDefaultCategories();
      const [imagesData, categoriesData] = await Promise.all([
        getGalleryImages(),
        getGalleryCategories(),
      ]);
      setImages(imagesData);
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar los datos');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      setError('Por favor sube una imagen');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingImage) {
        await updateGalleryImage(editingImage.id, formData);
        setSuccess('Imagen actualizada correctamente');
      } else {
        await createGalleryImage(formData);
        setSuccess('Imagen agregada correctamente');
      }

      await loadData();
      resetForm();
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving image:', error);
      setError('Error al guardar la imagen');
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Delete old image if editing and it's a Firebase URL
      if (editingImage && formData.imageUrl && formData.imageUrl.includes('firebase')) {
        await deleteImage(formData.imageUrl);
      }

      const imageUrl = await uploadImage(file, 'gallery');
      setFormData({ ...formData, imageUrl });
      
      setSuccess('Imagen cargada correctamente');
      setUploading(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Error al cargar la imagen');
      setUploading(false);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      imageUrl: image.imageUrl,
      title: image.title || '',
      description: image.description || '',
      category: image.category || 'exterior',
    });
    setShowForm(true);
  };

  const handleDelete = async (image) => {
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) {
      return;
    }

    try {
      setError(null);
      await deleteGalleryImage(image.id);
      
      // Delete image from storage if it's a Firebase URL
      if (image.imageUrl && image.imageUrl.includes('firebase')) {
        await deleteImage(image.imageUrl);
      }
      
      setSuccess('Imagen eliminada correctamente');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Error al eliminar la imagen');
    }
  };

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      title: '',
      description: '',
      category: 'exterior',
    });
    setEditingImage(null);
    setShowForm(false);
  };

  const handleCategoriesSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const validCategories = categoriesFormData.filter(cat => cat.label.trim() !== '');
      await updateGalleryCategories(validCategories);
      
      setSuccess('Categorías actualizadas correctamente');
      await loadData();
      setShowCategoriesForm(false);
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving categories:', error);
      setError('Error al guardar las categorías');
      setSaving(false);
    }
  };

  const openCategoriesForm = () => {
    setCategoriesFormData([...categories]);
    setShowCategoriesForm(true);
  };

  const updateCategory = (index, field, value) => {
    const newCategories = [...categoriesFormData];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setCategoriesFormData(newCategories);
  };

  const addCategory = () => {
    setCategoriesFormData([
      ...categoriesFormData,
      { id: `cat-${Date.now()}`, label: '' }
    ]);
  };

  const removeCategory = (index) => {
    const newCategories = categoriesFormData.filter((_, i) => i !== index);
    setCategoriesFormData(newCategories);
  };

  if (loading) {
    return <Loading message="Cargando galería..." />;
  }

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2>Gestión de Galería</h2>
          <p className="text-secondary">Administra las imágenes de la galería</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline" onClick={openCategoriesForm}>
            🏷️ Categorías
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Ver Galería' : '+ Nueva Imagen'}
          </Button>
        </div>
      </div>

      {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {showCategoriesForm ? (
        <Card hover={false}>
          <CardHeader>
            <h5 className="mb-0">Gestionar Categorías</h5>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleCategoriesSubmit}>
              {categoriesFormData.map((category, index) => (
                <div key={index} className="d-flex gap-2 mb-3">
                  <Input
                    label={`Categoría ${index + 1}`}
                    value={category.label}
                    onChange={(e) => updateCategory(index, 'label', e.target.value)}
                    placeholder="Nombre de la categoría"
                  />
                  {category.id !== 'all' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeCategory(index)}
                      className="align-self-end"
                    >
                      🗑️
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCategory}
                className="mb-3"
              >
                + Agregar Categoría
              </Button>

              <div className="d-flex gap-3 mt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Categorías'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCategoriesForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : showForm ? (
        <Card hover={false}>
          <CardHeader>
            <h5 className="mb-0">{editingImage ? 'Editar Imagen' : 'Nueva Imagen'}</h5>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Imagen *</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && (
                  <small className="text-primary d-block mt-2">⏳ Subiendo y comprimiendo imagen...</small>
                )}
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                      className="rounded"
                    />
                  </div>
                )}
              </div>

              <Input
                label="Título (opcional)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título de la imagen"
                className="mb-3"
              />

              <Input
                label="Descripción (opcional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción breve"
                className="mb-3"
              />

              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.filter(cat => cat.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-3">
                <Button type="submit" disabled={saving || uploading}>
                  {saving ? 'Guardando...' : editingImage ? 'Actualizar' : 'Agregar Imagen'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : (
        <div className="row g-3">
          {images.length === 0 ? (
            <div className="col-12">
              <Card hover={false}>
                <CardBody className="text-center py-5">
                  <p className="text-muted mb-3">No hay imágenes en la galería</p>
                  <Button onClick={() => setShowForm(true)}>
                    + Agregar Primera Imagen
                  </Button>
                </CardBody>
              </Card>
            </div>
          ) : (
            images.map((image) => (
              <div key={image.id} className="col-md-4 col-lg-3">
                <Card hover>
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={image.imageUrl}
                      alt={image.title || 'Gallery image'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <CardBody>
                    {image.title && (
                      <h6 className="mb-1">{image.title}</h6>
                    )}
                    <small className="text-muted d-block mb-2">
                      {categories.find(c => c.id === image.category)?.label || image.category}
                    </small>
                    {image.description && (
                      <p className="small text-muted mb-2">{image.description}</p>
                    )}
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(image)}>
                        ✏️
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(image)}>
                        🗑️
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
