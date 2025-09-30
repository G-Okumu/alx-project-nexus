export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface ProductFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  brand?: string;
  tags?: string[];
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationState;
  categories: Category[];
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Auth API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}