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
import { getSettings, updateSettings } from '../../shared/services/settingsService';
import { uploadLogo, deleteLogo } from '../../shared/services/storageService';

export const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // Branding
    logoUrl: '',
    
    // Información de Contacto
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    address: '',

    // Métodos de Pago
    paymentMethods: {
      bankTransfer: {
        enabled: true,
        bankName: '',
        accountHolder: '',
        accountNumber: '',
        routingNumber: '',
      },
      zelle: {
        enabled: true,
        email: '',
      },
      paypal: {
        enabled: true,
        email: '',
      },
      cash: {
        enabled: true,
      },
    },

    // Políticas
    cancellationPolicy: '',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    minimumNights: 3,

    // Textos Generales
    welcomeMessage: '',
    termsAndConditions: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      if (settings) {
        setFormData({
          logoUrl: settings.logoUrl || '',
          contactEmail: settings.contactEmail || '',
          contactPhone: settings.contactPhone || '',
          whatsappNumber: settings.whatsappNumber || '',
          address: settings.address || '',
          paymentMethods: settings.paymentMethods || formData.paymentMethods,
          cancellationPolicy: settings.cancellationPolicy || '',
          checkInTime: settings.checkInTime || '14:00',
          checkOutTime: settings.checkOutTime || '11:00',
          minimumNights: settings.minimumNights || 3,
          welcomeMessage: settings.welcomeMessage || '',
          termsAndConditions: settings.termsAndConditions || '',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Error al cargar la configuración');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      await updateSettings({
        ...formData,
        minimumNights: parseInt(formData.minimumNights),
      });

      setSuccess('Configuración guardada correctamente');
      setSaving(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Error al guardar la configuración');
      setSaving(false);
    }
  };

  const updatePaymentMethod = (method, field, value) => {
    setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        [method]: {
          ...formData.paymentMethods[method],
          [field]: value,
        },
      },
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Delete old logo if exists
      if (formData.logoUrl) {
        await deleteLogo(formData.logoUrl);
      }

      // Upload new logo
      const logoUrl = await uploadLogo(file);
      
      // Update formData state
      const updatedFormData = { ...formData, logoUrl };
      setFormData(updatedFormData);
      
      // Save to Firestore immediately
      await updateSettings({
        ...updatedFormData,
        minimumNights: parseInt(updatedFormData.minimumNights),
      });
      
      setSuccess('Logo cargado y guardado correctamente');
      setUploading(false);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setError(error.message || 'Error al cargar el logo');
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!formData.logoUrl) return;
    
    if (!window.confirm('¿Estás seguro de eliminar el logo?')) {
      return;
    }

    try {
      setUploading(true);
      await deleteLogo(formData.logoUrl);
      
      // Update formData state
      const updatedFormData = { ...formData, logoUrl: '' };
      setFormData(updatedFormData);
      
      // Save to Firestore immediately
      await updateSettings({
        ...updatedFormData,
        minimumNights: parseInt(updatedFormData.minimumNights),
      });
      
      setSuccess('Logo eliminado correctamente');
      setUploading(false);
    } catch (error) {
      console.error('Error removing logo:', error);
      setError('Error al eliminar el logo');
      setUploading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando configuración..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Configuración</h2>
        <p className="text-muted mb-0">
          Gestiona la configuración general de Casa Bella
        </p>
      </div>

      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess(null)} />
      )}

      {error && (
        <ErrorAlert message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12">
            <Card hover={false}>
              <CardHeader>
                <h5 className="mb-0">🎨 Identidad de Marca</h5>
              </CardHeader>
              <CardBody>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <label className="form-label fw-semibold">Logo del Sitio Web</label>
                    <p className="text-muted small mb-3">
                      Este logo aparecerá en la esquina superior izquierda del sitio web y en los correos de confirmación.
                      Formatos aceptados: JPG, PNG, WebP, SVG. Tamaño máximo: 2MB.
                    </p>
                    <div className="d-flex gap-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                        className="form-control"
                        style={{ maxWidth: '300px' }}
                      />
                      {formData.logoUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveLogo}
                          disabled={uploading}
                        >
                          🗑️ Eliminar
                        </Button>
                      )}
                    </div>
                    {uploading && (
                      <small className="text-primary d-block mt-2">
                        ⏳ Subiendo logo...
                      </small>
                    )}
                  </div>
                  <div className="col-md-4">
                    {formData.logoUrl ? (
                      <div className="text-center">
                        <p className="text-muted small mb-2">Vista previa:</p>
                        <div className="p-3 bg-light rounded">
                          <img
                            src={formData.logoUrl}
                            alt="Logo preview"
                            style={{
                              maxWidth: '200px',
                              maxHeight: '80px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted">
                        <p className="small mb-0">No hay logo cargado</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          
          <div className="col-lg-6">
            <Card hover={false}>
              <CardHeader>
                <h5 className="mb-0">Información de Contacto</h5>
              </CardHeader>
              <CardBody>
                <Input
                  label="Email de Contacto"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="info@casabellalrs.com"
                  className="mb-3"
                />
                <Input
                  label="Teléfono"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+58 414 XXX XXXX"
                  className="mb-3"
                />
                <Input
                  label="WhatsApp"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+58 414 XXX XXXX"
                  className="mb-3"
                />
                <TextArea
                  label="Dirección"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  placeholder="Gran Roque, Los Roques, Venezuela"
                />
              </CardBody>
            </Card>

            <Card hover={false} className="mt-4">
              <CardHeader>
                <h5 className="mb-0">Políticas</h5>
              </CardHeader>
              <CardBody>
                <div className="row g-3">
                  <div className="col-md-6">
                    <Input
                      label="Hora de Check-in"
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Hora de Check-out"
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <Input
                      label="Estadía Mínima (noches)"
                      type="number"
                      min="1"
                      value={formData.minimumNights}
                      onChange={(e) => setFormData({ ...formData, minimumNights: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <TextArea
                      label="Política de Cancelación"
                      value={formData.cancellationPolicy}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                      rows={5}
                      placeholder="Describe la política de cancelación..."
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="col-lg-6">
            <Card hover={false}>
              <CardHeader>
                <h5 className="mb-0">Métodos de Pago</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-4">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="bankTransferEnabled"
                      checked={formData.paymentMethods.bankTransfer.enabled}
                      onChange={(e) => updatePaymentMethod('bankTransfer', 'enabled', e.target.checked)}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="bankTransferEnabled">
                      Transferencia Bancaria
                    </label>
                  </div>
                  {formData.paymentMethods.bankTransfer.enabled && (
                    <div className="ms-4">
                      <Input
                        label="Banco"
                        value={formData.paymentMethods.bankTransfer.bankName}
                        onChange={(e) => updatePaymentMethod('bankTransfer', 'bankName', e.target.value)}
                        placeholder="Nombre del banco"
                        className="mb-2"
                      />
                      <Input
                        label="Titular"
                        value={formData.paymentMethods.bankTransfer.accountHolder}
                        onChange={(e) => updatePaymentMethod('bankTransfer', 'accountHolder', e.target.value)}
                        placeholder="Nombre del titular"
                        className="mb-2"
                      />
                      <Input
                        label="Número de Cuenta"
                        value={formData.paymentMethods.bankTransfer.accountNumber}
                        onChange={(e) => updatePaymentMethod('bankTransfer', 'accountNumber', e.target.value)}
                        placeholder="XXXX-XXXX-XX-XXXXXXXXXX"
                        className="mb-2"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="zelleEnabled"
                      checked={formData.paymentMethods.zelle.enabled}
                      onChange={(e) => updatePaymentMethod('zelle', 'enabled', e.target.checked)}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="zelleEnabled">
                      Zelle
                    </label>
                  </div>
                  {formData.paymentMethods.zelle.enabled && (
                    <div className="ms-4">
                      <Input
                        label="Email de Zelle"
                        type="email"
                        value={formData.paymentMethods.zelle.email}
                        onChange={(e) => updatePaymentMethod('zelle', 'email', e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="paypalEnabled"
                      checked={formData.paymentMethods.paypal.enabled}
                      onChange={(e) => updatePaymentMethod('paypal', 'enabled', e.target.checked)}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="paypalEnabled">
                      PayPal
                    </label>
                  </div>
                  {formData.paymentMethods.paypal.enabled && (
                    <div className="ms-4">
                      <Input
                        label="Email de PayPal"
                        type="email"
                        value={formData.paymentMethods.paypal.email}
                        onChange={(e) => updatePaymentMethod('paypal', 'email', e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                  )}
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="cashEnabled"
                    checked={formData.paymentMethods.cash.enabled}
                    onChange={(e) => updatePaymentMethod('cash', 'enabled', e.target.checked)}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="cashEnabled">
                    Efectivo al Llegar
                  </label>
                </div>
              </CardBody>
            </Card>

            <Card hover={false} className="mt-4">
              <CardHeader>
                <h5 className="mb-0">Textos Generales</h5>
              </CardHeader>
              <CardBody>
                <TextArea
                  label="Mensaje de Bienvenida"
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  rows={4}
                  placeholder="Mensaje que verán los huéspedes al llegar..."
                  className="mb-3"
                />
                <TextArea
                  label="Términos y Condiciones"
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                  rows={6}
                  placeholder="Términos y condiciones de la reserva..."
                />
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </form>
    </div>
  );
};
