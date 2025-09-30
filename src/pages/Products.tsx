import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { useProductsStore } from '@/stores/productsStore';
import type { ProductSort } from '@/types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const {
    products,
    categories,
    pagination,
    sort,
    isLoading,
    error,
    fetchProducts,
    setSort,
    setPagination,
    setFilters,
    clearError,
  } = useProductsStore();

  // Handle search query from URL
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setFilters({ search: searchQuery });
    }
  }, [searchParams, setFilters]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-') as [ProductSort['field'], ProductSort['order']];
    setSort({ field, order });
  };

  const handlePageChange = (page: number) => {
    setPagination({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'rating-desc', label: 'Highest Rated' },
  ];

  const currentSortValue = `${sort.field}-${sort.order}`;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={() => { clearError(); fetchProducts(); }}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters categories={categories} className="sticky top-24" />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground mt-1">
                {isLoading ? (
                  'Loading products...'
                ) : (
                  `Showing ${products.length} of ${pagination.total} products`
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters categories={categories} />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={currentSortValue} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-input rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-muted-foreground">Loading products...</p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && products.length > 0 && (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Grid className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}