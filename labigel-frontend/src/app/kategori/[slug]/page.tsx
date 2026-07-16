"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ProductCard from '@/components/public/ProductCard';
import { publicApi } from '@/lib/api';
import { Category, Product, Subcategory } from '@/types';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [activeSubId, setActiveSubId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await publicApi.getCategoryBySlug(slug);
        if (res.success && res.data) {
          setCategory(res.data);
          const hasDirectProducts = res.data.products?.some((p: Product) => p.isActive);
          const firstActive = res.data.subcategories?.find((s: Subcategory) => s.isActive);
          // null = "Genel" tab (products without subcategory)
          if (!hasDirectProducts && firstActive) setActiveSubId(firstActive.id);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--color-primary)' }}>Yükleniyor...</div>
        </div>
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '60px 16px' }}>
          <p style={{ fontSize: '2rem', marginBottom: '16px' }}>😕</p>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Kategori bulunamadı.</p>
          <Link href="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
        </div>
      </>
    );
  }

  const directProducts = category.products?.filter(p => p.isActive) || [];
  const activeSubcategory = category.subcategories?.find(s => s.id === activeSubId);
  const activeProducts = activeSubId === null
    ? directProducts
    : activeSubcategory?.products?.filter(p => p.isActive) || [];
  const activeSubs = category.subcategories?.filter(s => s.isActive) || [];
  const tabCount = activeSubs.length + (directProducts.length > 0 ? 1 : 0);

  return (
    <main>
      <Header />

      {/* Category Header */}
      <div style={{
        padding: '20px 16px',
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: '73px',
        zIndex: 40,
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={() => router.back()}
              aria-label="Geri dön"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'transparent', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(198, 161, 91, 0.4)',
                color: 'var(--color-primary)', cursor: 'pointer',
              }}
            >
              <FiArrowLeft size={18} />
            </button>
            <h1 style={{
              fontSize: '1.5rem', fontWeight: 500,
              fontFamily: 'var(--font-heading)', letterSpacing: '0.5px',
              color: 'var(--color-primary-light)',
            }}>
              {category.name}
            </h1>
          </div>

          {/* Subcategory tabs (+ "Genel" tab for products without subcategory) */}
          {tabCount > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                ...(directProducts.length > 0 ? [{ id: null as number | null, name: 'Genel' }] : []),
                ...activeSubs,
              ].map((sub) => (
                <button
                  key={sub.id ?? 'genel'}
                  onClick={() => setActiveSubId(sub.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: activeSubId === sub.id ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: activeSubId === sub.id ? 'var(--color-primary)' : 'transparent',
                    color: activeSubId === sub.id ? '#12100A' : 'var(--color-text-secondary)',
                    fontSize: '0.8125rem',
                    fontWeight: activeSubId === sub.id ? 700 : 500,
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'inherit',
                    transition: 'all var(--transition)',
                  }}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="container" style={{ paddingTop: '24px', paddingBottom: '40px' }}>
        {activeProducts.length > 0 ? (
          <div className="grid-2">
            {activeProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '16px' }}>🍽️</p>
            <p>Bu bölümde henüz ürün bulunmuyor.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
