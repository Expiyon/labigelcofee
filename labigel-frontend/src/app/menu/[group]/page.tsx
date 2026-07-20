"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import LoadingSkeleton from '@/components/public/LoadingSkeleton';
import { publicApi } from '@/lib/api';
import { Category, CategoryGroup } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryIcon } from '@/lib/categoryIcon';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';

const GROUP_BY_SLUG: Record<string, { key: CategoryGroup; title: string }> = {
  yiyecek: { key: 'FOOD', title: 'Yiyecekler' },
  icecek: { key: 'DRINK', title: 'İçecekler' },
};

export default function MenuGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { settings } = useAuth();
  const groupSlug = params.group as string;
  const group = GROUP_BY_SLUG[groupSlug];

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await publicApi.getCategories();
        if (res.success) setCategories(res.data);
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (settings?.siteName && group) {
      document.title = `${settings.siteName} | ${group.title}`;
    }
  }, [settings, group]);

  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingSkeleton />
      </>
    );
  }

  if (!group) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '60px 16px' }}>
          <p style={{ fontSize: '2rem', marginBottom: '16px' }}>😕</p>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Bölüm bulunamadı.</p>
          <Link href="/menu" className="btn btn-primary">Menüye Dön</Link>
        </div>
        <Footer />
      </>
    );
  }

  const groupCategories = categories.filter(c => c.group === group.key);

  return (
    <main style={{ minHeight: '100vh' }}>
      <Header />

      <div className="container" style={{ padding: '32px 16px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button
            onClick={() => router.back()}
            aria-label="Geri dön"
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'transparent', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(198, 161, 91, 0.4)',
              color: 'var(--color-primary)', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <FiArrowLeft size={18} />
          </button>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 500,
            fontFamily: 'var(--font-heading)', letterSpacing: '0.5px',
            color: 'var(--color-primary-light)',
          }}>
            {group.title}
          </h1>
        </div>

        {groupCategories.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {groupCategories.map((category) => {
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
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>☕</p>
            <p>Bu bölümde henüz kategori yok.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
