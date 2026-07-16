"use client";

import React from 'react';

const AdminLoading = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '80px 0', color: 'var(--color-text-secondary)' }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '3px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: '0.875rem' }}>Yükleniyor...</span>
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminLoading;
