"use client";

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { DashboardStats } from '@/types';
import { formatPrice } from '@/lib/utils';
import { FiBox, FiLayers, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';
import AdminLoading from '@/components/admin/AdminLoading';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <AdminLoading />;

  const statCards = [
    { title: 'Toplam Ürün', value: stats?.totalProducts || 0, icon: FiBox, color: 'var(--color-primary)' },
    { title: 'Aktif Ürün', value: stats?.activeProducts || 0, icon: FiCheckCircle, color: 'var(--color-success)' },
    { title: 'Toplam Kategori', value: stats?.totalCategories || 0, icon: FiLayers, color: 'var(--color-warning)' },
    { title: 'Alt Kategori', value: stats?.totalSubcategories || 0, icon: FiLayers, color: 'var(--color-text-primary)' },
  ];

  return (
    <div>
      <h1 className="mb-8">Dashboard</h1>
      
      <div className="grid-4 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card" style={{ padding: '24px' }}>
              <div className="flex-between">
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>{stat.title}</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{stat.value}</h3>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color
                }}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Son Eklenen Ürünler</h2>
        
        {stats?.recentProducts && stats.recentProducts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.recentProducts.map((product) => (
              <div key={product.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg-dark)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="flex-center" style={{ height: '100%' }}>📷</div>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem' }}>{product.name}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{product.categoryName}</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatPrice(product.price)}</p>
                  <span className={`badge ${product.isActive ? 'success' : ''}`}>
                    {product.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>Henüz ürün eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}
