"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { FiInstagram } from 'react-icons/fi';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import InstagramEmbed from '@/components/public/InstagramEmbed';
import { useAuth } from '@/hooks/useAuth';

const REEL_URL = 'https://www.instagram.com/reel/DZXxIuMs0lc/';

const PHOTOS = [
  { src: '/images/tabela-gunduz.jpg', title: "Batıkent'in Kalbinde", desc: 'Gül bahçeleri arasında güneşli karşılama' },
  { src: '/images/facade.jpg', title: 'Işıltılı Gece Görünümü', desc: 'Modern dış cephe ve estetik ışıklar' },
  { src: '/images/bahce-icecekler.jpg', title: 'Bahçede Öğle Keyfi', desc: 'Taze içecekler ve atıştırmalıklarla' },
  { src: '/images/garden.jpg', title: 'Açık Hava Terası', desc: 'Ferah okey masaları ve konforlu koltuklar' },
  { src: '/images/cay-atistirmalik.jpg', title: 'Çay Eşliğinde', desc: 'Bahçemizde huzurlu bir durak' },
  { src: '/images/signpost.jpg', title: 'Gece Karşılaması', desc: 'Ye, İç, Oyna' },
  { src: '/images/pasta.jpg', title: 'Tatlı Bir Ara', desc: 'Güneşin altında bir dilim keyif' },
];

export default function GaleriPage() {
  const { settings } = useAuth();

  useEffect(() => {
    document.title = `${settings?.siteName || 'Labigel'} | Galeri`;
  }, [settings]);

  return (
    <main style={{ minHeight: '100vh' }}>
      <Header />

      <div className="container" style={{ padding: '48px 16px 24px' }}>
        <div className="section-block" style={{ marginBottom: '48px' }}>
          <span className="ghost-text">Galeri</span>
          <span className="section-kicker">Ye, İç, Oyna</span>
          <h1 className="section-heading">Galeri</h1>
          <div className="divider-gold" />
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '24px', fontSize: '0.9375rem', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
            Gündüzüyle gecesiyle, lezzetiyle atmosferiyle Labigel Batıkent&apos;ten kareler.
          </p>
        </div>

        <div className="grid-3">
          {PHOTOS.map((img, idx) => (
            <div key={idx} className="card gallery-card">
              <Image
                src={img.src}
                alt={img.title}
                fill
                style={{ objectFit: 'cover' }}
                className="gallery-img"
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(11,14,19,0.92) 0%, rgba(11,14,19,0.3) 50%, transparent 100%)',
                display: 'flex', alignItems: 'flex-end', padding: '28px',
              }}>
                <div>
                  <h4 style={{ fontSize: '1.375rem', fontWeight: 500, fontFamily: 'var(--font-heading)', color: 'white' }}>{img.title}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-primary-light)', marginTop: '4px', letterSpacing: '1px' }}>{img.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Video Highlight ─────────────────────────────────────────────────── */}
      <div className="container" style={{ padding: '56px 16px 64px' }}>
        <div className="section-block" style={{ marginBottom: '40px' }}>
          <span className="ghost-text">Hareket</span>
          <h2 className="section-heading light">Hareket Halinde Labigel</h2>
          <div className="divider-gold" />
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '24px', fontSize: '0.9375rem' }}>
            Instagram&apos;daki son paylaşımımızı buradan izleyin.
          </p>
        </div>

        <InstagramEmbed url={REEL_URL} />

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a
            href={REEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}
          >
            <FiInstagram size={15} /> Instagram&apos;da Aç
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
