"use client";

import React, { useState, useCallback } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ProductCard from '@/components/public/ProductCard';
import { publicApi } from '@/lib/api';
import { Product } from '@/types';
import { FiSearch, FiX } from 'react-icons/fi';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await publicApi.searchProducts(searchQuery.trim());
      if (res.success) {
        setResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <main>
      <Header />

      <div className="container" style={{ paddingTop: '24px', paddingBottom: '40px' }}>
        {/* Search Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'var(--color-bg-card)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '0 16px',
          marginBottom: '32px',
          boxShadow: '0 0 20px var(--color-primary-glow)',
        }}>
          <FiSearch size={20} color="var(--color-primary)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ürün ara... (Örn: Latte, Waffle, Tost)"
            autoFocus
            style={{
              flex: 1, minWidth: 0, background: 'transparent', border: 'none',
              color: 'var(--color-text-primary)', outline: 'none',
              padding: '16px 0', fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}>
              <FiX size={20} />
            </button>
          )}
          <button
            onClick={() => handleSearch(query)}
            className="btn btn-primary"
            style={{ padding: '8px 20px', borderRadius: 'var(--radius-xl)' }}
          >
            Ara
          </button>
        </div>

        {/* Results */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-primary)' }}>
            Aranıyor...
          </div>
        )}

        {!isLoading && hasSearched && (
          <>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>&quot;{query}&quot;</span> için {results.length} sonuç bulundu
            </p>

            {results.length > 0 ? (
              <div className="grid-2">
                {results.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</p>
                <p style={{ marginBottom: '16px' }}>Aradığınız ürün bulunamadı.</p>
                <Link href="/menu" className="btn btn-secondary">Tüm Menüye Bak</Link>
              </div>
            )}
          </>
        )}

        {!hasSearched && !isLoading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🍽️</p>
            <p>Aramak istediğiniz ürünü yazın</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
