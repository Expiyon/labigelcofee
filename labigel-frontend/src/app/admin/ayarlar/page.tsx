"use client";

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { SiteSettings } from '@/types';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';
import ImageUploader from '@/components/admin/ImageUploader';
import AdminLoading from '@/components/admin/AdminLoading';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    logoUrl: '',
    primaryColor: '#E31E24',
    secondaryColor: '#0D0D0D',
    fontFamily: 'Poppins',
    instagramUrl: '',
    phone: '',
    address: '',
    aboutText: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminApi.getSettings();
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch {
        toast.error('Ayarlar yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await adminApi.updateSettings(settings);
      if (res.success) {
        toast.success('Ayarlar başarıyla kaydedildi');
      }
    } catch {
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <AdminLoading />;

  return (
    <div>
      <div className="flex-between mb-8">
        <h1>Site Ayarları</h1>
        <button onClick={handleSubmit} className="btn btn-primary" disabled={isSaving}>
          <FiSave /> {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Genel Ayarlar</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Site Adı</label>
              <input type="text" name="siteName" className="input" value={settings.siteName} onChange={handleChange} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Logo</label>
              <ImageUploader
                currentImageUrl={settings.logoUrl}
                onUpload={(url) => setSettings(prev => ({ ...prev, logoUrl: url }))}
                onRemove={() => setSettings(prev => ({ ...prev, logoUrl: '' }))}
              />
            </div>
            
            <div className="grid-2">
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Ana Renk</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} style={{ height: '44px', width: '44px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  <input type="text" className="input" value={settings.primaryColor} readOnly />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>İkincil Renk</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="color" name="secondaryColor" value={settings.secondaryColor} onChange={handleChange} style={{ height: '44px', width: '44px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  <input type="text" className="input" value={settings.secondaryColor} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>İletişim & Sosyal Medya</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Telefon Numarası</label>
              <input type="text" name="phone" className="input" value={settings.phone || ''} onChange={handleChange} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Instagram URL</label>
              <input type="text" name="instagramUrl" className="input" value={settings.instagramUrl || ''} onChange={handleChange} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Açık Adres</label>
              <textarea name="address" className="input" rows={3} value={settings.address || ''} onChange={handleChange} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Hakkımızda Metni</label>
              <textarea name="aboutText" className="input" rows={4} value={settings.aboutText || ''} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
