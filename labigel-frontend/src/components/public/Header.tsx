"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { settings } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11, 14, 19, 0.85)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--color-border)',
      padding: '12px 16px'
    }}>
      <div className="container flex-between">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '44px', height: '44px' }}>
            <Image
              src={settings?.logoUrl || "/images/logo.png"}
              alt={settings?.siteName || "Labigel Logo"}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-heading)', letterSpacing: '1px', lineHeight: 1.1,
            }}>
              {settings?.siteName || 'Labigel'}
            </h1>
            <p style={{
              fontSize: '0.625rem', color: 'var(--color-primary)', letterSpacing: '4px',
              textTransform: 'uppercase', fontWeight: 700, marginTop: '1px',
            }}>
              Ye, İç, Oyna
            </p>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/menu" className="nav-link nav-link-desktop">Menü</Link>
          <Link href="/arama" aria-label="Ürün ara" style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'transparent',
            border: '1px solid rgba(198, 161, 91, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            transition: 'all var(--transition)',
          }}>
            <FiSearch size={17} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
