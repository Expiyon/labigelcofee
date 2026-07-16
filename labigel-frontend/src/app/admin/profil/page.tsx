"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { adminApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Şifre en az 6 karakter olmalı');
      return;
    }

    setIsSaving(true);
    try {
      const res = await adminApi.changePassword({
        currentPassword,
        newPassword,
      });
      if (res.success) {
        toast.success(res.message || 'Şifre başarıyla güncellendi');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Şifre güncellenemedi (Mevcut şifreniz yanlış olabilir)'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="mb-8">Profil</h1>

      <div className="grid-2">
        {/* User Info Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiUser size={20} color="var(--color-primary)" />
            Hesap Bilgileri
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Ad Soyad
              </label>
              <div style={{
                padding: '12px 16px',
                background: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <FiUser size={16} color="var(--color-text-muted)" />
                <span>{user?.fullName || '...'}</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                E-posta
              </label>
              <div style={{
                padding: '12px 16px',
                background: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <FiMail size={16} color="var(--color-text-muted)" />
                <span>{user?.email || '...'}</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Rol
              </label>
              <div>
                <span className="badge primary" style={{ fontSize: '0.875rem', padding: '6px 12px' }}>
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiLock size={20} color="var(--color-primary)" />
            Şifre Değiştir
          </h2>

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
                Mevcut Şifre
              </label>
              <input
                type="password"
                className="input"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
                Yeni Şifre
              </label>
              <input
                type="password"
                className="input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                className="input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              <FiSave /> {isSaving ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
