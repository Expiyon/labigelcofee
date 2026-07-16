"use client";

import React, { useRef, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { FiUpload, FiX } from 'react-icons/fi';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
}

const ImageUploader = ({ currentImageUrl, onUpload, onRemove }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImageUrl || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen bir resim dosyası seçin');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalı');
      return;
    }

    // Local preview
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const res = await adminApi.uploadImage(file);
      if (res.success) {
        onUpload(res.data);
        toast.success('Görsel yüklendi');
      } else {
        toast.error('Görsel yüklenemedi');
        setPreview(currentImageUrl || '');
      }
    } catch {
      toast.error('Görsel yüklenirken hata oluştu');
      setPreview(currentImageUrl || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onRemove?.();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="image-uploader"
      />

      {preview ? (
        <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '160px' }}>
          <Image
            src={preview}
            alt="Preview"
            fill
            style={{ objectFit: 'cover' }}
            unoptimized={preview.startsWith('blob:')}
          />
          {!uploading && (
            <button
              onClick={handleRemove}
              type="button"
              style={{
                position: 'absolute', top: '8px', right: '8px',
                background: 'rgba(0,0,0,0.7)', border: 'none',
                borderRadius: '50%', width: '28px', height: '28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white',
              }}
            >
              <FiX size={14} />
            </button>
          )}
          {uploading && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '0.875rem',
            }}>
              Yükleniyor...
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor="image-uploader"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '8px', height: '160px', border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            color: 'var(--color-text-muted)', transition: 'all var(--transition)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <FiUpload size={24} />
          <span style={{ fontSize: '0.875rem' }}>Görsel yüklemek için tıklayın</span>
          <span style={{ fontSize: '0.75rem' }}>PNG, JPG, WEBP — maks. 5MB</span>
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
