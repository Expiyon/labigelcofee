"use client";

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Category, Product, Subcategory } from '@/types';
import { getErrorMessage, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import Modal from '@/components/admin/Modal';
import ImageUploader from '@/components/admin/ImageUploader';
import AdminLoading from '@/components/admin/AdminLoading';

// ─── Product Form Modal ────────────────────────────────────────────────────────
const ProductFormModal = ({
  isOpen, onClose, onSave, editItem, categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editItem: Product | null;
  categories: Category[];
}) => {
  const [form, setForm] = useState({
    name: '', description: '', ingredients: '',
    price: '', imageUrl: '', calories: '',
    weightGrams: '', displayOrder: 0,
    isActive: true, isFeatured: false,
    subcategoryId: '' as string | number,
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editItem) {
      // Find category and subcategory from editItem.subcategoryName
      let catId: number | '' = '';
      let subId: number | '' = '';
      if (editItem.subcategoryName) {
        for (const cat of categories) {
          const match = cat.subcategories?.find(s => s.name === editItem.subcategoryName);
          if (match) {
            catId = cat.id;
            subId = match.id;  // ← correct subcategory id
            break;
          }
        }
      }
      // Product without subcategory: match category by name
      if (!catId && editItem.categoryName) {
        catId = categories.find(c => c.name === editItem.categoryName)?.id || '';
      }
      setSelectedCategoryId(catId);
      if (catId) {
        const cat = categories.find(c => c.id === catId);
        setSubcategories(cat?.subcategories || []);
      }

      setForm({
        name: editItem.name,
        description: editItem.description || '',
        ingredients: editItem.ingredients || '',
        price: String(editItem.price),
        imageUrl: editItem.imageUrl || '',
        calories: editItem.calories ? String(editItem.calories) : '',
        weightGrams: editItem.weightGrams ? String(editItem.weightGrams) : '',
        displayOrder: editItem.displayOrder || 0,
        isActive: editItem.isActive,
        isFeatured: editItem.isFeatured,
        subcategoryId: subId,  // ← correct: actual subcategory id
      });
    } else {
      setSelectedCategoryId('');
      setSubcategories([]);
      setForm({
        name: '', description: '', ingredients: '',
        price: '', imageUrl: '', calories: '',
        weightGrams: '', displayOrder: 0,
        isActive: true, isFeatured: false, subcategoryId: '',
      });
    }
  }, [editItem, isOpen, categories]);

  const handleCategoryChange = (catId: number) => {
    setSelectedCategoryId(catId);
    const cat = categories.find(c => c.id === catId);
    setSubcategories(cat?.subcategories || []);
    setForm(p => ({ ...p, subcategoryId: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) { toast.error('Lütfen bir kategori seçin'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        calories: form.calories ? parseInt(form.calories) : null,
        weightGrams: form.weightGrams ? parseInt(form.weightGrams) : null,
        categoryId: Number(selectedCategoryId),
        subcategoryId: form.subcategoryId ? Number(form.subcategoryId) : null,
      };
      if (editItem) {
        await adminApi.updateProduct(editItem.id, payload);
        toast.success('Ürün güncellendi');
      } else {
        await adminApi.createProduct(payload);
        toast.success('Ürün oluşturuldu');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Hata oluştu'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'} size="lg">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="grid-2">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Ürün Adı *</label>
            <input type="text" className="input" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Fiyat (₺) *</label>
            <input type="number" className="input" required min="0" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Kategori *</label>
            <select
              className="input"
              value={selectedCategoryId}
              onChange={e => handleCategoryChange(+e.target.value)}
              required
            >
              <option value="">Kategori seçin</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
              Alt Kategori <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(opsiyonel)</span>
            </label>
            <select
              className="input"
              value={form.subcategoryId}
              onChange={e => setForm(p => ({ ...p, subcategoryId: e.target.value }))}
              disabled={!selectedCategoryId || subcategories.length === 0}
            >
              <option value="">Alt kategori yok</option>
              {subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Açıklama</label>
          <textarea className="input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>İçindekiler / Alerjenler</label>
          <textarea className="input" rows={2} value={form.ingredients} onChange={e => setForm(p => ({ ...p, ingredients: e.target.value }))} placeholder="Süt, gluten, fındık..." />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Görsel</label>
          <ImageUploader
            currentImageUrl={form.imageUrl}
            onUpload={(url) => setForm(p => ({ ...p, imageUrl: url }))}
            onRemove={() => setForm(p => ({ ...p, imageUrl: '' }))}
          />
        </div>

        <div className="grid-2">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Kalori (kcal)</label>
            <input type="number" className="input" min="0" value={form.calories} onChange={e => setForm(p => ({ ...p, calories: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Gramaj (g)</label>
            <input type="number" className="input" min="0" value={form.weightGrams} onChange={e => setForm(p => ({ ...p, weightGrams: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
            Aktif
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} />
            ⭐ Öne Çıkan
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'passive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const fetchAll = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        adminApi.getProducts({ size: 200 }),
        adminApi.getCategories(),
      ]);
      if (productsRes.success) {
        const data = productsRes.data;
        setProducts(Array.isArray(data) ? data : data.content);
      }
      if (categoriesRes.success) setCategories(categoriesRes.data);
    } catch {
      toast.error('Veriler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Ürün silindi');
      fetchAll();
    } catch { toast.error('Silme başarısız'); }
  };

  const handleToggle = async (id: number) => {
    try {
      await adminApi.toggleProduct(id);
      fetchAll();
    } catch { toast.error('Hata'); }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchActive = filterActive === 'all' || (filterActive === 'active' ? p.isActive : !p.isActive);
    return matchSearch && matchActive;
  });

  if (isLoading) return <AdminLoading />;

  return (
    <div>
      <div className="flex-between mb-8">
        <h1>Ürünler <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>({products.length})</span></h1>
        <button className="btn btn-primary" onClick={() => { setEditProduct(null); setModalOpen(true); }}>
          <FiPlus /> Yeni Ürün
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{
          flex: 1, minWidth: '200px',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--color-bg-card)', padding: '0 14px',
          borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
        }}>
          <FiSearch size={16} color="var(--color-text-muted)" />
          <input
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', color: 'inherit', outline: 'none', padding: '10px 0', width: '100%', fontFamily: 'inherit' }}
          />
        </div>
        {(['all', 'active', 'passive'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterActive(f)}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-md)',
              border: filterActive === f ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: filterActive === f ? 'var(--color-primary-glow)' : 'var(--color-bg-card)',
              color: filterActive === f ? 'var(--color-primary-light)' : 'var(--color-text-primary)',
              fontFamily: 'inherit', cursor: 'pointer', fontSize: '0.875rem',
            }}
          >
            {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : 'Pasif'}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
              {['Ürün', 'Kategori', 'Fiyat', 'Kalori', 'Durum', 'İşlemler'].map(h => (
                <th key={h} style={{ padding: '14px 16px', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--color-bg-surface)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                      {product.imageUrl && (
                        <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{product.name}</p>
                      {product.isFeatured && <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)' }}>⭐ Öne Çıkan</span>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  {product.categoryName}
                  <br />
                  <span style={{ fontSize: '0.75rem' }}>{product.subcategoryName}</span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-primary)' }}>{formatPrice(product.price)}</td>
                <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  {product.calories ? `${product.calories} kcal` : '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => handleToggle(product.id)}
                    className={`badge ${product.isActive ? 'success' : ''}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    {product.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setEditProduct(product); setModalOpen(true); }} className="btn btn-secondary" style={{ padding: '6px 10px' }}>
                      <FiEdit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="btn btn-danger" style={{ padding: '6px 10px' }}>
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Ürün bulunamadı</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchAll}
        editItem={editProduct}
        categories={categories}
      />
    </div>
  );
}
