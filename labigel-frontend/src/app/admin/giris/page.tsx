"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@labigel.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login({ email, password });
      // Redirect to admin dashboard after successful login
      router.push('/admin');
    } catch (error) {
      setErrorMsg(getErrorMessage(error, 'E-posta veya şifre hatalı'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'var(--color-bg-dark)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
        height: '400px',
        background: 'var(--color-primary-glow)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <div className="card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px 32px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 16px' }}>
            <Image
              src="/images/logo.png"
              alt="Labigel Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>
            Labigel <span style={{ color: 'var(--color-primary)' }}>Admin</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Yönetim paneline giriş yapın
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
              E-posta
            </label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@labigel.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
              Şifre
            </label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Error message */}
          {errorMsg && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              fontSize: '0.875rem',
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '4px', padding: '14px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
          ♠ Labigel Cafe Yönetim Paneli ♠
        </div>
      </div>
    </div>
  );
}
