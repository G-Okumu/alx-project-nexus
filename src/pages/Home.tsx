import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductsStore } from '@/stores/productsStore';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { products, fetchProducts, isLoading } = useProductsStore();
  
  const featuredProducts = products.filter(product => product.featured).slice(0, 4);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-light via-background to-accent-light">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-primary-light text-primary border-primary/20" variant="outline">
              New Collection Available
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Discover Amazing{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Products
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Shop the latest trends and discover unique products from trusted brands. 
              Quality guaranteed with fast, free shipping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="text-lg px-8" asChild>
                    <Link to="/register">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-8 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-accent/30 rounded-full blur-lg animate-bounce-subtle" />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EcoStore?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
                <p className="text-muted-foreground">
                  Free shipping on all orders over $50. Fast delivery guaranteed.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Shopping</h3>
                <p className="text-muted-foreground">
                  Your data is protected with industry-leading security measures.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
                <p className="text-muted-foreground">
                  30-day return policy. No questions asked, full refund guaranteed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground text-lg">
                Discover our hand-picked selection of premium products
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                      <div className="h-6 bg-muted rounded w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="text-center">
              <Button size="lg" variant="outline" asChild>
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  View All Products
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and discover your next favorite product today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                  <Link to="/register">Create Account</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            ) : (
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}