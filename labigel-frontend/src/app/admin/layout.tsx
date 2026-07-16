"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/admin/giris') {
      router.push('/admin/giris');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>Yükleniyor...</div>
      </div>
    );
  }

  const isLoginPage = pathname === '/admin/giris';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        minWidth: 0,
        marginLeft: isLoginPage ? 0 : '280px',
        padding: isLoginPage ? 0 : '32px',
        background: 'var(--color-bg-dark)',
        transition: 'margin-left 0.3s ease'
      }} className="admin-main">
        {children}
      </main>
    </div>
  );
}
