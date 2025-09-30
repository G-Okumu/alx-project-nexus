import { create } from 'zustand';
import type { 
  Product, 
  Category, 
  ProductFilters, 
  ProductSort, 
  PaginationState, 
  LoadingState 
} from '@/types';
import { productsApi } from '@/lib/api/products';

interface ProductsState extends LoadingState {
  products: Product[];
  categories: Category[];
  filters: ProductFilters;
  sort: ProductSort;
  pagination: PaginationState;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setSort: (sort: ProductSort) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  clearFilters: () => void;
  clearError: () => void;
}

const initialFilters: ProductFilters = {};

const initialSort: ProductSort = {
  field: 'createdAt',
  order: 'desc',
};

const initialPagination: PaginationState = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  // Initial state
  products: [],
  categories: [],
  filters: initialFilters,
  sort: initialSort,
  pagination: initialPagination,
  isLoading: false,
  error: null,

  // Actions
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters, sort, pagination } = get();
      const response = await productsApi.getProducts({
        filters,
        sort,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      set({
        products: response.products,
        categories: response.categories,
        pagination: response.pagination,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      set({
        products: [],
        isLoading: false,
        error: message,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await productsApi.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  setFilters: (newFilters: Partial<ProductFilters>) => {
    const { filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    
    set({
      filters: updatedFilters,
      pagination: { ...get().pagination, page: 1 }, // Reset to page 1 when filters change
    });
    
    // Automatically fetch products when filters change
    get().fetchProducts();
  },

  setSort: (sort: ProductSort) => {
    set({
      sort,
      pagination: { ...get().pagination, page: 1 }, // Reset to page 1 when sort changes
    });
    
    // Automatically fetch products when sort changes
    get().fetchProducts();
  },

  setPagination: (newPagination: Partial<PaginationState>) => {
    const { pagination } = get();
    const updatedPagination = { ...pagination, ...newPagination };
    
    set({ pagination: updatedPagination });
    
    // Automatically fetch products when pagination changes
    get().fetchProducts();
  },

  clearFilters: () => {
    set({
      filters: initialFilters,
      pagination: { ...get().pagination, page: 1 },
    });
    
    // Automatically fetch products when filters are cleared
    get().fetchProducts();
  },

  clearError: () => {
    set({ error: null });
  },
}));