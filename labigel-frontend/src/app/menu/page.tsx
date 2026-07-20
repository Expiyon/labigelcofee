"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import LoadingSkeleton from '@/components/public/LoadingSkeleton';
import { publicApi } from '@/lib/api';
import { Category, CategoryGroup } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryIcon } from '@/lib/categoryIcon';
import { FiChevronRight } from 'react-icons/fi';

const GROUP_TABS: { key: CategoryGroup; label: string }[] = [
  { key: 'FOOD', label: 'Yiyecekler' },
  { key: 'DRINK', label: 'İçecekler' },
];

export default function MenuPage() {
  const { settings } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<CategoryGroup>('FOOD');

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
            Her damak tadı için özenle hazırlanmış lezzetlerimizi keşfedin.
          </p>
        </div>

        {categories.length > 0 ? (
          <>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}>
              {GROUP_TABS.map(tab => {
                const count = categories.filter(c => c.group === tab.key).length;
                if (count === 0) return null;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveGroup(tab.key)}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '999px',
                      border: activeGroup === tab.key ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: activeGroup === tab.key ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                      color: activeGroup === tab.key ? '#12100A' : 'var(--color-text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '0.9375rem',
                      fontWeight: activeGroup === tab.key ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition)',
                    }}
                  >
                    {tab.label} <span style={{ opacity: 0.75, fontWeight: 400 }}>({count})</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {categories.filter(c => c.group === activeGroup).map((category) => {
              const Icon = getCategoryIcon(category.name);
              const itemCount = category.productCount || 0;
              return (
                <Link
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="category-card"
                >
                  <div className="category-card-icon">
                    {category.imageUrl ? (
                      <Image src={category.imageUrl} alt={category.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <Icon size={28} color="var(--color-primary)" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 className="category-card-title">{category.name}</h2>
                    <p className="category-card-desc">
                      {category.description || `${itemCount} ${itemCount === 1 ? 'ürün' : 'çeşit ürün'}`}
                    </p>
                  </div>
                  <FiChevronRight size={20} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                </Link>
              );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>☕</p>
            <p>Menü hazırlanıyor...</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
