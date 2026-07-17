"use client";

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { UserAccount, UserRole } from '@/types';
import { getErrorMessage } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import Modal from '@/components/admin/Modal';
import AdminLoading from '@/components/admin/AdminLoading';

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  EDITOR: 'Görsel Editörü',
};

// ─── User Form Modal ───────────────────────────────────────────────────────────
const UserFormModal = ({
  isOpen, onClose, onSave, editItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editItem: UserAccount | null;
}) => {
  const [form, setForm] = useState({
    email: '', password: '', fullName: '',
    role: 'EDITOR' as UserRole, isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editItem) {
      setForm({
        email: editItem.email,
        password: '',
        fullName: editItem.fullName,
        role: editItem.role,
        isActive: editItem.isActive,
      });
    } else {
      setForm({ email: '', password: '', fullName: '', role: 'EDITOR', isActive: true });
    }
  }, [editItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await adminApi.updateUser(editItem.id, {
          fullName: form.fullName,
          role: form.role,
          isActive: form.isActive,
          ...(form.password ? { password: form.password } : {}),
        });
        toast.success('Kullanıcı güncellendi');
      } else {
        await adminApi.createUser({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          role: form.role,
        });
        toast.success('Kullanıcı oluşturuldu');
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
    <Modal isOpen={isOpen} onClose={onClose} title={editItem ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Ad Soyad *</label>
          <input type="text" className="input" required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>E-posta *</label>
          <input
            type="email" className="input" required
            value={form.email}
            disabled={!!editItem}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
          {editItem && (
            <p style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>E-posta adresi değiştirilemez.</p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
            {editItem ? 'Yeni Şifre' : 'Şifre *'}
          </label>
          <input
            type="password" className="input"
            required={!editItem}
            minLength={6}
            placeholder={editItem ? 'Değiştirmek istemiyorsanız boş bırakın' : '••••••••'}
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Rol *</label>
          <select
            className="input"
            value={form.role}
            onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}
          >
            <option value="ADMIN">Admin — panele tam erişim</option>
            <option value="EDITOR">Görsel Editörü — sadece ürün görseli değiştirebilir</option>
          </select>
        </div>

        {editItem && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
            Aktif
          </label>
        )}

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
export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserAccount | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      if (res.success) setUsers(res.data);
    } catch {
      toast.error('Kullanıcılar yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (u: UserAccount) => {
    if (!confirm(`"${u.fullName}" kullanıcısını silmek istediğinize emin misiniz?`)) return;
    try {
      await adminApi.deleteUser(u.id);
      toast.success('Kullanıcı silindi');
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Silme başarısız'));
    }
  };

  if (isLoading) return <AdminLoading />;

  return (
    <div>
      <div className="flex-between mb-8">
        <h1>Kullanıcılar <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>({users.length})</span></h1>
        <button className="btn btn-primary" onClick={() => { setEditUser(null); setModalOpen(true); }}>
          <FiPlus /> Yeni Kullanıcı
        </button>
      </div>

      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: '24px', maxWidth: '640px' }}>
        <FiUsers style={{ verticalAlign: '-2px', marginRight: '4px' }} />
        <strong>Admin</strong> panelin tüm bölümlerine erişebilir. <strong>Görsel Editörü</strong> rolündeki
        kullanıcılar yalnızca Ürünler sayfasını görür ve ürün fotoğraflarını değiştirebilir; başka bir şeye
        erişemezler.
      </p>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
              {['Ad Soyad', 'E-posta', 'Rol', 'Durum', 'İşlemler'].map(h => (
                <th key={h} style={{ padding: '14px 16px', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9375rem' }}>
                  {u.fullName}
                  {u.email === currentUser?.email && (
                    <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>(siz)</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge ${u.role === 'ADMIN' ? 'primary' : ''}`}>{ROLE_LABELS[u.role]}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge ${u.isActive ? 'success' : ''}`}>{u.isActive ? 'Aktif' : 'Pasif'}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setEditUser(u); setModalOpen(true); }} className="btn btn-secondary" style={{ padding: '6px 10px' }}>
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="btn btn-danger"
                      style={{ padding: '6px 10px' }}
                      disabled={u.email === currentUser?.email}
                      title={u.email === currentUser?.email ? 'Kendi hesabınızı silemezsiniz' : undefined}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Kullanıcı bulunamadı</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchUsers}
        editItem={editUser}
      />
    </div>
  );
}
