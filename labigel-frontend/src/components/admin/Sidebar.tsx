"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  FiHome, 
  FiLayers, 
  FiBox, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiUser,
  FiBook
} from 'react-icons/fi';

const menuItems = [
  { path: '/admin', name: 'Dashboard', icon: FiHome },
  { path: '/admin/kategoriler', name: 'Kategoriler', icon: FiLayers },
  { path: '/admin/urunler', name: 'Ürünler', icon: FiBox },
  { path: '/admin/ayarlar', name: 'Site Ayarları', icon: FiSettings },
  { path: '/admin/profil', name: 'Profil', icon: FiUser },
  { path: '/admin/tasarim-rehberi', name: 'UI Rehberi', icon: FiBook },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/admin/giris') return null;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 60,
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
          display: 'none', // Shown via CSS media query below
        }}
        className="mobile-toggle"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '280px',
          height: '100vh',
          background: 'var(--color-bg-card)',
          borderRight: '1px solid var(--color-border)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 800 }}>Labigel Admin</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Yönetim Paneli</p>
        </div>

        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link 
                href={item.path} 
                key={item.path}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--color-primary-glow)' : 'transparent',
                  color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-primary)',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all var(--transition)'
                }}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '24px 16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--color-bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-primary)'
            }}>
              <FiUser size={20} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'Yükleniyor...'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button 
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--color-danger)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '1rem',
              fontFamily: 'inherit',
              transition: 'all var(--transition)'
            }}
          >
            <FiLogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
