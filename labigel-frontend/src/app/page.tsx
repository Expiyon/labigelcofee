"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiPhone, FiMapPin, FiInstagram, FiClock, FiMap } from 'react-icons/fi';
import { LuCoffee, LuUtensils, LuDices, LuTreePalm } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/public/Footer';

const ADDRESS = 'Kardelen, 277 Sokak Batıkent Yolu No:2/1, 06370 Yenimahalle/Ankara';
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed&hl=tr&z=17`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;

const CONCEPTS = [
  { icon: LuCoffee, title: 'Özel Kahveler', desc: 'Özenle demlenen çekirdek kahveler ve el yapımı içecekler.' },
  { icon: LuUtensils, title: 'Dünya Mutfağı', desc: 'Usta aşçılarımızın hazırladığı leziz tabaklar ve atıştırmalıklar.' },
  { icon: LuDices, title: 'Oyun Salonu', desc: 'Okey, tavla ve masa oyunları için ferah, nezih bir aile salonu.' },
  { icon: LuTreePalm, title: 'Geniş Teras', desc: 'Açık havada, yeşillikler içinde konforlu bir keyif alanı.' },
];

export default function LandingPage() {
  const { settings } = useAuth();
  const phoneDisplay = settings?.phone || '+90 544 566 1070';
  const telHref = `tel:${phoneDisplay.replace(/[^+\d]/g, '')}`;

  useEffect(() => {
    if (settings?.siteName) {
      document.title = `${settings.siteName} | Batıkent Cafe & Restoran`;
    } else {
      document.title = "Labigel Cafe Batıkent | Ye, İç, Oyna!";
    }
  }, [settings]);

  return (
    <div style={{ background: 'var(--color-bg-dark)', minHeight: '100vh', color: 'var(--color-text-primary)', overflowX: 'hidden' }}>

      {/* ─── Minimal Transparent Navigation ──────────────────────────────────── */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'linear-gradient(to bottom, rgba(11, 14, 19, 0.75), transparent)',
        padding: '22px 0',
      }}>
        <div className="container flex-between" style={{ padding: '0 24px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative', width: '46px', height: '46px' }}>
              <Image
                src={settings?.logoUrl || "/images/logo.png"}
                alt="Labigel Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '1px', color: 'var(--color-text-primary)' }}>
                {settings?.siteName || 'Labigel'}
              </span>
              <span style={{ display: 'block', fontSize: '0.625rem', color: 'var(--color-primary)', letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 700, marginTop: '-2px' }}>
                Batıkent
              </span>
            </div>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#hikaye" className="nav-link nav-link-desktop">Hikayemiz</a>
            <a href="#iletisim" className="nav-link nav-link-desktop">İletişim</a>
            <Link href="/galeri" className="nav-link nav-link-desktop">Galeri</Link>
            <Link href="/menu" className="nav-link" style={{ color: 'var(--color-primary)' }}>Menü</Link>
          </nav>
        </div>
      </header>

      {/* ─── Hero Section (Full-bleed, Elegant Serif) ────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg">
          <Image
            src="/images/tabela-gunduz.jpg"
            alt="Labigel Cafe Batıkent"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 32%' }}
            priority
          />
        </div>
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="container" style={{ padding: '0 24px' }}>
            <div className="animate-fade-in" style={{ maxWidth: '760px' }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '5px',
                color: 'var(--color-primary-light)', textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                Ankara • Batıkent
              </span>

              <h1 className="hero-title">
                Her Keyfin Bir<br />
                Labigel&apos;i Var.
              </h1>

              <p style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: '44px',
                maxWidth: '540px',
              }}>
                Kahvenin, lezzetin ve oyunun tek mekânda buluştuğu nezih bir deneyim.
                Ye, iç, oyna; anın tadını çıkar.
              </p>

              <div className="hero-btn-group">
                <Link href="/menu" className="btn-outline-pill">
                  Menüye Göz Atın
                </Link>
                <a href={telHref} className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-primary)' }}>
                  <FiPhone size={15} color="var(--color-primary)" /> Rezervasyon
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Story Section (Ghost Watermark) ─────────────────────────────────── */}
      <section id="hikaye" className="responsive-section">
        <div className="container section-block" style={{ maxWidth: '860px' }}>
          <span className="ghost-text">Hikayemiz</span>
          <h2 className="section-heading">Tek Mekânda, Sayısız Keyif Hikayesi</h2>
          <div className="divider-gold" />
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1.125rem',
            lineHeight: 2,
            marginTop: '36px',
          }}>
            Labigel, lezzetin oyunla buluştuğu, her anın özenle tasarlandığı özel bir deneyim sunar.
            Kahvenin sıcaklığı, dünya mutfağının zenginliği ve masa oyunlarının neşesi burada bir araya geliyor.
            Batıkent&apos;in kalbinde, geniş bahçeli ve modern konseptimizle her ziyaret,
            damakta ve hafızada iz bırakan bir keşif…
          </p>
        </div>
      </section>

      {/* ─── Concepts / Menus Section ────────────────────────────────────────── */}
      <section className="responsive-section" style={{ paddingTop: '20px' }}>
        <div className="container section-block" style={{ marginBottom: '72px' }}>
          <span className="ghost-text">Menümüz</span>
          <h2 className="section-heading">Menülerimiz</h2>
          <div className="divider-gold" />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', marginTop: '28px' }}>
            Her konsept için özenle hazırlanmış lezzetlerimiz
          </p>
        </div>

        <div className="container">
          <div className="grid-4" style={{ gap: '32px' }}>
            {CONCEPTS.map((concept) => {
              const Icon = concept.icon;
              return (
                <Link key={concept.title} href="/menu" className="concept-card">
                  <div className="concept-circle">
                    <Icon size={40} strokeWidth={1.1} />
                  </div>
                  <h3 className="concept-title">{concept.title}</h3>
                  <p className="concept-desc">{concept.desc}</p>
                </Link>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <Link href="/menu" className="btn-outline-pill">
              Dijital Menüyü İncele
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Gallery Section ─────────────────────────────────────────────────── */}
      <section className="responsive-section" style={{ background: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container section-block" style={{ marginBottom: '72px' }}>
          <span className="ghost-text">Atmosfer</span>
          <h2 className="section-heading">Labigel Atmosferi</h2>
          <div className="divider-gold" />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', marginTop: '28px', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
            Modern mimarimiz ve sıcak ışıklandırmamızla oluşturduğumuz ortamı keşfedin.
          </p>
        </div>

        <div className="container">
          <div className="grid-3">
            {[
              { src: '/images/facade.jpg', title: 'Işıltılı Gece Görünümü', desc: 'Modern dış cephe ve estetik ışıklar' },
              { src: '/images/garden.jpg', title: 'Açık Hava Terası', desc: 'Ferah okey masaları ve konforlu koltuklar' },
              { src: '/images/signpost.jpg', title: 'Karşılama ve Giriş', desc: 'Ye, İç, Oyna' },
            ].map((img, idx) => (
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
                  background: 'linear-gradient(to top, rgba(11,14,19,0.95) 0%, rgba(11,14,19,0.35) 50%, transparent 100%)',
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
      </section>

      {/* ─── Daylight Section — brighter, sunnier atmosphere layer ───────────── */}
      <section className="responsive-section">
        <div className="container section-block" style={{ marginBottom: '72px' }}>
          <span className="ghost-text">Gündüz</span>
          <h2 className="section-heading light">Gün Işığında Labigel</h2>
          <div className="divider-gold" />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', marginTop: '28px', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
            Güneşli bahçemizde, taze lezzetler ve keyifli sohbetlerle geçen anlar.
          </p>
        </div>

        <div className="container">
          <div className="grid-2">
            {[
              { src: '/images/tabela-gunduz.jpg', title: "Batıkent'in Kalbinde", desc: 'Gül bahçeleri arasında güneşli karşılama' },
              { src: '/images/bahce-icecekler.jpg', title: 'Bahçede Öğle Keyfi', desc: 'Taze içecekler ve atıştırmalıklarla' },
              { src: '/images/cay-atistirmalik.jpg', title: 'Çay Eşliğinde', desc: 'Bahçemizde huzurlu bir durak' },
              { src: '/images/pasta.jpg', title: 'Tatlı Bir Ara', desc: 'Güneşin altında bir dilim keyif' },
            ].map((img, idx) => (
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
                  background: 'linear-gradient(to top, rgba(11,14,19,0.9) 0%, rgba(11,14,19,0.25) 55%, transparent 100%)',
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

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/galeri" className="btn-outline-pill">
              Tüm Galeriyi Gör
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Contact & Map Section ───────────────────────────────────────────── */}
      <section id="iletisim" className="responsive-section">
        <div className="container">
          <div className="contact-grid">

            {/* Left side: Information */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="section-kicker" style={{ textAlign: 'left' }}>Ziyaret Edin</span>
              <h2 className="section-title" style={{ color: 'var(--color-primary)' }}>
                Kapımız Her Zaman<br />Sizlere Açık
              </h2>

              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9, fontSize: '1.0625rem', marginBottom: '40px' }}>
                Rezervasyon yaptırarak yerinizi ayırtın veya aklınıza takılan sorular için bizimle
                iletişime geçin. Labigel Batıkent ekibi olarak size hizmet etmekten keyif duyacağız.
              </p>

              <div className="contact-detail-grid">

                <a href={telHref} style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-primary)' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Telefon</span>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiPhone color="var(--color-primary)" /> {phoneDisplay}
                  </span>
                </a>

                <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-primary)' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Konum</span>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiMapPin color="var(--color-primary)" style={{ flexShrink: 0 }} /> Batıkent, Ankara
                  </span>
                </a>

                <a href="https://www.instagram.com/labigelbatikent/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-primary)' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Sosyal Medya</span>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiInstagram color="var(--color-primary)" /> @labigelbatikent
                  </span>
                </a>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Çalışma Saatleri</span>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiClock color="var(--color-primary)" /> Her Gün: 12:00 - 00:30
                  </span>
                </div>

              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', fontFamily: 'var(--font-accent)' }}>
                  &quot;{settings?.aboutText || 'Batıkent’in en prestijli cafe ve masa oyunu salonunda her ayrıntı sizin konforunuz için tasarlandı.'}&quot;
                </p>
              </div>
            </div>

            {/* Right side: Interactive Map Card */}
            <div className="card map-card">
              <iframe
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Labigel Batıkent Konum"
              />
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="map-directions-btn"
              >
                <FiMap size={14} />
                <span>Yol Tarifi Al</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
