"use client";

import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="container" style={{ padding: '32px 16px 56px' }}>
      <div className="skeleton" style={{ width: '120px', height: '16px', borderRadius: '6px', marginBottom: '10px' }} />
      <div className="skeleton" style={{ width: '180px', height: '32px', borderRadius: '8px', marginBottom: '10px' }} />
      <div className="skeleton" style={{ width: '240px', height: '16px', borderRadius: '6px', marginBottom: '32px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="category-card" style={{ pointerEvents: 'none' }}>
            <div className="skeleton category-card-icon" />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '50%', height: '20px', borderRadius: '6px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '70%', height: '14px', borderRadius: '6px' }} />
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .skeleton {
          background: linear-gradient(90deg, var(--color-bg-surface) 25%, var(--color-bg-elevated) 50%, var(--color-bg-surface) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSkeleton;
