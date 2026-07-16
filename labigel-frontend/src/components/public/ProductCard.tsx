"use client";

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/urun/${product.slug}`} className="card" style={{ display: 'flex', padding: '12px', gap: '12px' }}>
      <div style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        flexShrink: 0,
        background: 'var(--color-bg-surface)',
      }}>
        {product.imageUrl ? (
          <Image 
            src={product.imageUrl} 
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            Görsel Yok
          </div>
        )}
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{
            fontSize: '1.1875rem', fontWeight: 500, marginBottom: '4px',
            fontFamily: 'var(--font-heading)', letterSpacing: '0.3px',
          }}>
            {product.name}
          </h3>
          {product.description && (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.description}
            </p>
          )}
        </div>
        
        <div className="flex-between" style={{ marginTop: '8px' }}>
          <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatPrice(product.price)}
          </span>
          {(product.calories || product.weightGrams) && (
            <span className="badge" style={{ color: 'var(--color-text-muted)', background: 'transparent' }}>
              {product.calories && `${product.calories} kcal`} {product.weightGrams && `| ${product.weightGrams}g`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
