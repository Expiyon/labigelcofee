import React from 'react';

export default function UIDesignGuidePage() {
  return (
    <div>
      <h1 className="mb-8">UI Tasarım Rehberi</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>Labigel Cafe dijital menü ve admin panelinde kullanılan tasarım bileşenleri.</p>

      <div className="grid-2">
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Renk Paleti</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-between" style={{ padding: '16px', background: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontWeight: 600 }}>Primary (Parlak Kırmızı)</span>
              <span>#E31E24</span>
            </div>
            <div className="flex-between" style={{ padding: '16px', background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontWeight: 600 }}>Background Dark</span>
              <span>#0D0D0D</span>
            </div>
            <div className="flex-between" style={{ padding: '16px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontWeight: 600 }}>Card Background</span>
              <span>#1A1A1A</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Tipografi (Poppins)</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ marginBottom: '8px' }}>Heading 1 (36px, Bold)</h1>
              <h2 style={{ marginBottom: '8px' }}>Heading 2 (28px, SemiBold)</h2>
              <h3 style={{ marginBottom: '8px' }}>Heading 3 (20px, SemiBold)</h3>
              <p>Normal metin (16px, Regular). Bu bir paragraf örneğidir. Sistem genelinde okunabilirlik için Poppins font ailesi kullanılmaktadır.</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Butonlar</h2>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">Primary Buton</button>
            <button className="btn btn-secondary">Secondary Buton</button>
            <button className="btn btn-danger">Tehlike Butonu</button>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Form Elemanları</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" className="input" placeholder="Standart input..." />
            <input type="text" className="input" placeholder="Focus durumu..." style={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px var(--color-primary-glow)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
