export type CategoryGroup = 'FOOD' | 'DRINK';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  group: CategoryGroup;
  displayOrder: number;
  isActive: boolean;
  subcategoryCount?: number;
  productCount?: number;
  subcategories?: Subcategory[];
  products?: Product[];
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  categoryName?: string;
  productCount?: number;
  products?: Product[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  ingredients?: string;
  price: number;
  imageUrl?: string;
  calories?: number;
  weightGrams?: number;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  subcategoryName?: string;
  categoryName?: string;
}

export type UserRole = 'ADMIN' | 'EDITOR';

export interface User {
  email: string;
  fullName: string;
  role: UserRole;
}

export interface UserAccount {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  instagramUrl?: string;
  phone?: string;
  address?: string;
  aboutText?: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalSubcategories: number;
  recentProducts: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: UserRole;
}
