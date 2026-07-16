"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { publicApi } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiInfo } from 'react-icons/fi';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await publicApi.getProductBySlug(slug);
        if (res.success) {
          setProduct(res.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
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

  if (error || !product) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '60px 16px' }}>
          <p style={{ fontSize: '2rem', marginBottom: '16px' }}>😕</p>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Ürün bulunamadı.</p>
          <Link href="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
        </div>
      </>
    );
  }

  return (
    <main>
      <Header />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 0 40px' }}>
        {/* Image */}
        <div style={{ position: 'relative', width: '100%', height: '300px', background: 'var(--color-bg-card)' }}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
              🍽️
            </div>
          )}

          {/* Back button overlay */}
          <button
            onClick={() => router.back()}
            aria-label="Geri dön"
            style={{
              position: 'absolute', top: '16px', left: '16px',
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(11,14,19,0.7)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-primary-light)', border: '1px solid rgba(198,161,91,0.4)',
              cursor: 'pointer',
            }}
          >
            <FiArrowLeft size={18} />
          </button>

          {product.isFeatured && (
            <div style={{
              position: 'absolute', top: '16px', right: '16px',
              padding: '4px 12px', borderRadius: '999px',
              background: 'var(--color-primary)', color: '#12100A',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              ⭐ Öne Çıkan
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '24px 16px' }}>
          {/* Breadcrumb */}
          {product.categoryName && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginBottom: '8px' }}>
              {product.categoryName} / {product.subcategoryName}
            </p>
          )}

          <h1 style={{
            fontSize: '2rem', fontWeight: 500, marginBottom: '12px',
            fontFamily: 'var(--font-heading)', color: 'var(--color-primary-light)',
          }}>
            {product.name}
          </h1>

          {product.description && (
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              {product.description}
            </p>
          )}

          {/* Badges */}
          {(product.calories || product.weightGrams) && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              {product.calories ? (
                <div className="badge" style={{ padding: '8px 14px', fontSize: '0.875rem' }}>
                  🔥 {product.calories} kcal
                </div>
              ) : null}
              {product.weightGrams ? (
                <div className="badge" style={{ padding: '8px 14px', fontSize: '0.875rem' }}>
                  ⚖️ {product.weightGrams} g
                </div>
              ) : null}
            </div>
          )}

          {/* Price */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px', background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
            marginBottom: '20px',
          }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Fiyat</span>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Ingredients */}
          {product.ingredients && (
            <div style={{
              padding: '16px',
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                <FiInfo size={16} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>İçindekiler / Alerjenler</span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {product.ingredients}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
