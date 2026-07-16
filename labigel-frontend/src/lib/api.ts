import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  AuthResponse,
  Category,
  DashboardStats,
  LoginRequest,
  Product,
  SiteSettings,
  Subcategory,
  User,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap the nested `data` so callers get `ApiResponse<T>` directly.
// Axios response shape:  { data: ApiResponse<T>, status, headers, ... }
// After interceptor:     ApiResponse<T>  ← this is what we use
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      if (
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/giris'
      ) {
        window.location.href = '/admin/giris';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Shared request payload types ──────────────────────────────────────────────
export interface CategoryPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SubcategoryPayload extends CategoryPayload {
  categoryId: number;
}

export interface ProductPayload {
  name: string;
  description?: string;
  ingredients?: string;
  price: number;
  imageUrl?: string;
  calories?: number | null;
  weightGrams?: number | null;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: number;
  subcategoryId?: number | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ProductListParams {
  page?: number;
  size?: number;
}

// Admin product listing may be paginated (Spring `Page<T>`) or a plain array.
export type ProductListResponse = Product[] | { content: Product[] };

// ─── Public API ────────────────────────────────────────────────────────────────
export const publicApi = {
  getCategories: (): Promise<ApiResponse<Category[]>> => api.get('/public/categories'),
  getCategoryBySlug: (slug: string): Promise<ApiResponse<Category>> => api.get(`/public/categories/${slug}`),
  getSubcategoryBySlug: (slug: string): Promise<ApiResponse<Subcategory>> => api.get(`/public/subcategories/${slug}`),
  getProductBySlug: (slug: string): Promise<ApiResponse<Product>> => api.get(`/public/products/${slug}`),
  getFeaturedProducts: (): Promise<ApiResponse<Product[]>> => api.get('/public/products/featured'),
  searchProducts: (q: string): Promise<ApiResponse<Product[]>> => api.get(`/public/search?q=${encodeURIComponent(q)}`),
  getSettings: (): Promise<ApiResponse<SiteSettings>> => api.get('/public/settings'),
};

// ─── Admin API ─────────────────────────────────────────────────────────────────
export const adminApi = {
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => api.post('/auth/login', data),
  getMe: (): Promise<ApiResponse<User>> => api.get('/auth/me'),
  changePassword: (data: ChangePasswordPayload): Promise<ApiResponse<null>> => api.put('/auth/password', data),
  getDashboardStats: (): Promise<ApiResponse<DashboardStats>> => api.get('/admin/dashboard/stats'),

  // Categories
  getCategories: (): Promise<ApiResponse<Category[]>> => api.get('/admin/categories'),
  createCategory: (data: CategoryPayload): Promise<ApiResponse<Category>> => api.post('/admin/categories', data),
  updateCategory: (id: number, data: CategoryPayload): Promise<ApiResponse<Category>> => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: number): Promise<ApiResponse<null>> => api.delete(`/admin/categories/${id}`),
  toggleCategory: (id: number): Promise<ApiResponse<null>> => api.patch(`/admin/categories/${id}/toggle`),

  // Subcategories
  createSubcategory: (data: SubcategoryPayload): Promise<ApiResponse<Subcategory>> => api.post('/admin/subcategories', data),
  updateSubcategory: (id: number, data: SubcategoryPayload): Promise<ApiResponse<Subcategory>> => api.put(`/admin/subcategories/${id}`, data),
  deleteSubcategory: (id: number): Promise<ApiResponse<null>> => api.delete(`/admin/subcategories/${id}`),
  toggleSubcategory: (id: number): Promise<ApiResponse<null>> => api.patch(`/admin/subcategories/${id}/toggle`),

  // Products
  getProducts: (params?: ProductListParams): Promise<ApiResponse<ProductListResponse>> => api.get('/admin/products', { params }),
  createProduct: (data: ProductPayload): Promise<ApiResponse<Product>> => api.post('/admin/products', data),
  updateProduct: (id: number, data: ProductPayload): Promise<ApiResponse<Product>> => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: number): Promise<ApiResponse<null>> => api.delete(`/admin/products/${id}`),
  toggleProduct: (id: number): Promise<ApiResponse<null>> => api.patch(`/admin/products/${id}/toggle`),

  // Settings
  getSettings: (): Promise<ApiResponse<SiteSettings>> => api.get('/admin/settings'),
  updateSettings: (data: SiteSettings): Promise<ApiResponse<SiteSettings>> => api.put('/admin/settings', data),

  // File upload
  uploadImage: (file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
