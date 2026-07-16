"use client";

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Category, Subcategory } from '@/types';
import { getErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import Modal from '@/components/admin/Modal';
import ImageUploader from '@/components/admin/ImageUploader';
import AdminLoading from '@/components/admin/AdminLoading';

// ─── Category Form Modal ───────────────────────────────────────────────────────
const CategoryFormModal = ({
  isOpen, onClose, onSave, editItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editItem: Category | null;
}) => {
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', displayOrder: 0, isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name,
        description: editItem.description || '',
        imageUrl: editItem.imageUrl || '',
        displayOrder: editItem.displayOrder,
        isActive: editItem.isActive,
      });
    } else {
      setForm({ name: '', description: '', imageUrl: '', displayOrder: 0, isActive: true });
    }
  }, [editItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await adminApi.updateCategory(editItem.id, form);
        toast.success('Kategori güncellendi');
      } else {
        await adminApi.createCategory(form);
        toast.success('Kategori oluşturuldu');
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
    <Modal isOpen={isOpen} onClose={onClose} title={editItem ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Kategori Adı *</label>
          <input type="text" className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Açıklama</label>
          <textarea className="input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Sıra Numarası</label>
            <input type="number" className="input" value={form.displayOrder} onChange={e => setForm(p => ({ ...p, displayOrder: +e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
              Aktif
            </label>
          </div>
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

// ─── Subcategory Form Modal ────────────────────────────────────────────────────
const SubcategoryFormModal = ({
  isOpen, onClose, onSave, editItem, categoryId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editItem: Subcategory | null;
  categoryId: number;
}) => {
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', displayOrder: 0, isActive: true, categoryId });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editItem) {
      setForm({ name: editItem.name, description: editItem.description || '', imageUrl: editItem.imageUrl || '', displayOrder: editItem.displayOrder, isActive: editItem.isActive, categoryId });
    } else {
      setForm({ name: '', description: '', imageUrl: '', displayOrder: 0, isActive: true, categoryId });
    }
  }, [editItem, isOpen, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl || '',
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive,
      categoryId: Number(categoryId),
    };

    try {
      if (editItem) {
        await adminApi.updateSubcategory(editItem.id, payload);
        toast.success('Alt kategori güncellendi');
      } else {
        await adminApi.createSubcategory(payload);
        toast.success('Alt kategori oluşturuldu');
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
    <Modal isOpen={isOpen} onClose={onClose} title={editItem ? 'Alt Kategori Düzenle' : 'Yeni Alt Kategori'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Alt Kategori Adı *</label>
          <input type="text" className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Açıklama</label>
          <textarea className="input" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </div>
        <div className="grid-2">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Sıra</label>
            <input type="number" className="input" value={form.displayOrder} onChange={e => setForm(p => ({ ...p, displayOrder: +e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
              Aktif
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editSubcategory, setEditSubcategory] = useState<Subcategory | null>(null);
  const [activeParentId, setActiveParentId] = useState<number>(0);

  const fetchCategories = async () => {
    try {
      const res = await adminApi.getCategories();
      if (res.success) setCategories(res.data);
    } catch {
      toast.error('Kategoriler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bu kategoriyi ve tüm içeriğini silmek istediğinize emin misiniz?')) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success('Kategori silindi');
      fetchCategories();
    } catch {
      toast.error('Silme işlemi başarısız');
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    if (!confirm('Bu alt kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await adminApi.deleteSubcategory(id);
      toast.success('Alt kategori silindi');
      fetchCategories();
    } catch {
      toast.error('Silme işlemi başarısız');
    }
  };

  const handleToggleCategory = async (id: number) => {
    try {
      await adminApi.toggleCategory(id);
      fetchCategories();
    } catch { toast.error('Hata'); }
  };

  if (isLoading) return <AdminLoading />;

  return (
    <div>
      <div className="flex-between mb-8">
        <h1>Kategoriler</h1>
        <button className="btn btn-primary" onClick={() => { setEditCategory(null); setCatModalOpen(true); }}>
          <FiPlus /> Yeni Kategori
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.map(cat => (
          <div key={cat.id} className="card" style={{ overflow: 'visible' }}>
            {/* Category Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', cursor: 'pointer' }}
              onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}>
              {expandedId === cat.id ? <FiChevronDown size={16} color="var(--color-primary)" /> : <FiChevronRight size={16} />}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>{cat.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {cat.subcategoryCount} alt kategori · {cat.productCount} ürün
                </p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleToggleCategory(cat.id); }}
                className={`badge ${cat.isActive ? 'success' : ''}`}
                style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}
              >
                {cat.isActive ? 'Aktif' : 'Pasif'}
              </button>
              <button onClick={e => { e.stopPropagation(); setEditCategory(cat); setCatModalOpen(true); }} className="btn btn-secondary" style={{ padding: '6px 10px', flexShrink: 0 }}>
                <FiEdit2 size={15} />
              </button>
              <button onClick={e => { e.stopPropagation(); handleDeleteCategory(cat.id); }} className="btn btn-danger" style={{ padding: '6px 10px', flexShrink: 0 }}>
                <FiTrash2 size={15} />
              </button>
            </div>

            {/* Subcategory Accordion */}
            {expandedId === cat.id && (
              <div style={{ borderTop: '1px solid var(--color-border)', padding: '12px 20px' }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Alt Kategoriler</span>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
                    onClick={() => { setActiveParentId(cat.id); setEditSubcategory(null); setSubModalOpen(true); }}
                  >
                    <FiPlus size={14} /> Alt Kategori Ekle
                  </button>
                </div>
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  cat.subcategories.map(sub => (
                    <div key={sub.id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg-surface)', marginBottom: '8px',
                    }}>
                      <span style={{ flex: 1, fontSize: '0.9375rem' }}>{sub.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{sub.productCount || 0} ürün</span>
                      <span className={`badge ${sub.isActive ? 'success' : ''}`}>{sub.isActive ? 'Aktif' : 'Pasif'}</span>
                      <button onClick={() => { setActiveParentId(cat.id); setEditSubcategory(sub); setSubModalOpen(true); }} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                        <FiEdit2 size={13} />
                      </button>
                      <button onClick={() => handleDeleteSubcategory(sub.id)} className="btn btn-danger" style={{ padding: '4px 8px' }}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '8px 0' }}>
                    Bu kategoride henüz alt kategori yok
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Henüz kategori eklenmemiş
          </div>
        )}
      </div>

      <CategoryFormModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        onSave={fetchCategories}
        editItem={editCategory}
      />
      <SubcategoryFormModal
        isOpen={subModalOpen}
        onClose={() => setSubModalOpen(false)}
        onSave={fetchCategories}
        editItem={editSubcategory}
        categoryId={activeParentId}
      />
    </div>
  );
}
