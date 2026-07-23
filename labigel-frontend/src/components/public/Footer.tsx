"use client";

import Link from 'next/link';
import { FiInstagram, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

interface FooterProps {
  settings?: {
    instagramUrl?: string;
    phone?: string;
    address?: string;
    siteName?: string;
  };
}

const Footer = ({ settings: propSettings }: FooterProps) => {
  const { settings: contextSettings } = useAuth();
  const settings = propSettings || contextSettings;

  const instagramHandle = settings?.instagramUrl
    ? settings.instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/^@/, '').replace(/\/$/, '')
    : 'labigelbatikent';
  const instagramHref = `https://www.instagram.com/${instagramHandle}/`;
  const telHref = settings?.phone ? `tel:${settings.phone.replace(/[^+\d]/g, '')}` : null;

  return (
    <footer style={{
      background: 'var(--color-bg-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '64px 16px 32px',
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{
            color: 'var(--color-text-primary)', fontSize: '2rem', fontWeight: 600,
            fontFamily: 'var(--font-heading)', letterSpacing: '1px',
          }}>
            {settings?.siteName || 'Labigel'}
          </p>
          <p style={{
            color: 'var(--color-primary)', fontSize: '0.6875rem', letterSpacing: '5px',
            textTransform: 'uppercase', fontWeight: 700, marginTop: '6px',
          }}>
            Ye • İç • Oyna
          </p>
          <div className="divider-gold" />
        </div>

        {/* Footer nav */}
        <nav style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '40px' }}>
          <Link href="/" className="nav-link">Ana Sayfa</Link>
          <Link href="/menu" className="nav-link">Menü</Link>
          <Link href="/galeri" className="nav-link">Galeri</Link>
          <Link href="/arama" className="nav-link">Ara</Link>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-secondary)', transition: 'color var(--transition)' }}
          >
            <FiInstagram size={18} color="var(--color-primary)" />
            <span style={{ fontSize: '0.9375rem' }}>@{instagramHandle}</span>
          </a>

          {telHref && (
            <a
              href={telHref}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-secondary)' }}
            >
              <FiPhone size={18} color="var(--color-primary)" />
              <span style={{ fontSize: '0.9375rem' }}>{settings?.phone}</span>
            </a>
          )}

          {settings?.address && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--color-text-secondary)', textAlign: 'center', maxWidth: '320px' }}>
              <FiMapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.875rem' }}>{settings.address}</span>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Dijital Menü Sistemi
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
