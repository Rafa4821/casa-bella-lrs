import { useState, useEffect } from 'react';
import { getSettings } from '../services/settingsService';

/**
 * Hook to load and access global settings
 * @returns {Object} settings object and loading state
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get WhatsApp URL
  const getWhatsAppUrl = () => {
    if (!settings?.whatsappNumber) return '#';
    // Remove any non-digit characters
    const cleanNumber = settings.whatsappNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  // Helper to format WhatsApp number for display
  const getWhatsAppDisplay = () => {
    return settings?.whatsappNumber || '+58 414 XXX XXXX';
  };

  return {
    settings,
    loading,
    getWhatsAppUrl,
    getWhatsAppDisplay,
    contactEmail: settings?.contactEmail || 'info@casabellalrs.com',
    contactPhone: settings?.contactPhone || '+58 414 XXX XXXX',
    whatsappNumber: settings?.whatsappNumber || '+58 414 XXX XXXX',
    address: settings?.address || 'Gran Roque, Archipiélago Los Roques, Venezuela',
  };
};
