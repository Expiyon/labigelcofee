"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import LoadingSkeleton from '@/components/public/LoadingSkeleton';
import { publicApi } from '@/lib/api';
import { Category, CategoryGroup } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { GiForkKnifeSpoon, GiCoffeeCup } from 'react-icons/gi';
import { FiChevronRight } from 'react-icons/fi';

const GROUP_CHOICES: { key: CategoryGroup; slug: string; label: string; desc: string; Icon: typeof GiForkKnifeSpoon }[] = [
  { key: 'FOOD', slug: 'yiyecek', label: 'Yiyecekler', desc: 'Kahvaltıdan tatlıya, tüm lezzetlerimiz', Icon: GiForkKnifeSpoon },
  { key: 'DRINK', slug: 'icecek', label: 'İçecekler', desc: 'Kahveden frozene, tüm içeceklerimiz', Icon: GiCoffeeCup },
];

export default function MenuPage() {
  const { settings } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await publicApi.getCategories();
        if (categoriesRes.success) {
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (settings?.siteName) {
      document.title = `${settings.siteName} | Dijital Menü`;
    }
  }, [settings]);

  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingSkeleton />
      </>
    );
  }

  return (
    <main style={{ minHeight: '100vh' }}>
      <Header />

      <div className="container" style={{ padding: '48px 16px 64px' }}>
        <div className="section-block" style={{ marginBottom: '48px' }}>
          <span className="ghost-text">Menümüz</span>
          <span className="section-kicker">Ye, İç, Oyna</span>
          <h1 className="section-heading">Menülerimiz</h1>
          <div className="divider-gold" />
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '24px', fontSize: '0.9375rem' }}>
            Önce bir bölüm seçin, ardından kategorileri keşfedin.
          </p>
        </div>

        <div className="grid-2" style={{ maxWidth: '760px', margin: '0 auto' }}>
          {GROUP_CHOICES.map(({ key, slug, label, desc, Icon }) => {
            const count = categories.filter(c => c.group === key).length;
            if (count === 0) return null;
            return (
              <Link key={key} href={`/menu/${slug}`} className="menu-choice-card">
                <div className="menu-choice-icon">
                  <Icon size={40} />
                </div>
                <h2 className="menu-choice-title">{label}</h2>
                <p className="menu-choice-desc">{desc}</p>
                <span className="menu-choice-cta">
                  Keşfet <FiChevronRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
