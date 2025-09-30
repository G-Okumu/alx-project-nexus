import type { 
  Product, 
  Category, 
  ProductFilters, 
  ProductSort, 
  ProductsResponse,
  PaginationState
} from '@/types';

// Mock delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock categories data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    productCount: 45,
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel for all',
    productCount: 32,
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home and garden',
    productCount: 28,
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports equipment and accessories',
    productCount: 19,
  },
  {
    id: '5',
    name: 'Books',
    slug: 'books',
    description: 'Books, magazines, and educational materials',
    productCount: 15,
  },
];

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    brand: 'AudioTech',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    tags: ['wireless', 'bluetooth', 'noise-cancelling'],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Smartwatch Pro',
    description: 'Advanced fitness tracking smartwatch with heart rate monitoring',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
    category: 'Electronics',
    brand: 'TechWear',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    featured: true,
    tags: ['smartwatch', 'fitness', 'health'],
    createdAt: '2024-01-14T10:00:00Z',
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable organic cotton t-shirt',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    brand: 'EcoWear',
    rating: 4.4,
    reviews: 56,
    inStock: true,
    featured: false,
    tags: ['organic', 'cotton', 'sustainable'],
    createdAt: '2024-01-13T10:00:00Z',
  },
  {
    id: '4',
    name: 'Modern Desk Lamp',
    description: 'Minimalist LED desk lamp with adjustable brightness',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    category: 'Home & Garden',
    brand: 'LightCraft',
    rating: 4.7,
    reviews: 32,
    inStock: true,
    featured: false,
    tags: ['led', 'desk', 'minimalist'],
    createdAt: '2024-01-12T10:00:00Z',
  },
  {
    id: '5',
    name: 'Running Shoes',
    description: 'High-performance running shoes with advanced cushioning',
    price: 129.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Sports',
    brand: 'RunFast',
    rating: 4.5,
    reviews: 78,
    inStock: true,
    featured: true,
    tags: ['running', 'sports', 'comfort'],
    createdAt: '2024-01-11T10:00:00Z',
  },
  {
    id: '6',
    name: 'Laptop Backpack',
    description: 'Durable laptop backpack with multiple compartments',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Electronics',
    brand: 'CarryTech',
    rating: 4.3,
    reviews: 45,
    inStock: true,
    featured: false,
    tags: ['laptop', 'backpack', 'travel'],
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '7',
    name: 'Ceramic Coffee Mug',
    description: 'Handcrafted ceramic coffee mug with unique design',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
    category: 'Home & Garden',
    brand: 'CraftWare',
    rating: 4.6,
    reviews: 23,
    inStock: true,
    featured: false,
    tags: ['ceramic', 'coffee', 'handcrafted'],
    createdAt: '2024-01-09T10:00:00Z',
  },
  {
    id: '8',
    name: 'Programming Book',
    description: 'Complete guide to modern web development',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
    category: 'Books',
    brand: 'TechPress',
    rating: 4.9,
    reviews: 67,
    inStock: true,
    featured: true,
    tags: ['programming', 'web', 'development'],
    createdAt: '2024-01-08T10:00:00Z',
  },
];

// Helper functions for filtering and sorting
const applyFilters = (products: Product[], filters: ProductFilters): Product[] => {
  return products.filter(product => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }
    
    if (filters.rating && product.rating < filters.rating) {
      return false;
    }
    
    if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
      return false;
    }
    
    if (filters.featured !== undefined && product.featured !== filters.featured) {
      return false;
    }
    
    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = `${product.name} ${product.description} ${product.brand}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        product.tags.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    return true;
  });
};

const applySorting = (products: Product[], sort: ProductSort): Product[] => {
  return [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (sort.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }
    
    return sort.order === 'asc' ? comparison : -comparison;
  });
};

const applyPagination = (products: Product[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  const pagination: PaginationState = {
    page,
    limit,
    total: products.length,
    totalPages: Math.ceil(products.length / limit),
  };
  
  return { products: paginatedProducts, pagination };
};

interface GetProductsParams {
  filters?: ProductFilters;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export const productsApi = {
  async getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
    await delay(600); // Simulate network delay
    
    const {
      filters = {},
      sort = { field: 'createdAt', order: 'desc' },
      page = 1,
      limit = 12,
    } = params;
    
    let filteredProducts = applyFilters(mockProducts, filters);
    
    // Apply sorting
    filteredProducts = applySorting(filteredProducts, sort);
    
    // Apply pagination
    const { products, pagination } = applyPagination(filteredProducts, page, limit);
    
    return {
      products,
      pagination,
      categories: mockCategories,
    };
  },

  async getProduct(id: string): Promise<Product | null> {
    await delay(300);
    return mockProducts.find(product => product.id === id) || null;
  },

  async getCategories(): Promise<Category[]> {
    await delay(200);
    return mockCategories;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await delay(400);
    return mockProducts.filter(product => product.featured);
  },

  async searchProducts(query: string): Promise<Product[]> {
    await delay(500);
    const searchTerm = query.toLowerCase();
    return mockProducts.filter(product => {
      const searchableText = `${product.name} ${product.description} ${product.brand}`.toLowerCase();
      return searchableText.includes(searchTerm);
    });
  },
};