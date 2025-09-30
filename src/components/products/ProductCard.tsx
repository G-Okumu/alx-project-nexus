import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const getItemQuantity = useCartStore(state => state.getItemQuantity);
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const quantity = getItemQuantity(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? 'Removed from wishlist' : 'Added to wishlist',
      description: isLiked 
        ? `${product.name} removed from your wishlist.`
        : `${product.name} added to your wishlist.`,
    });
  };

  return (
    <Card className="group relative overflow-hidden border-card-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {hasDiscount && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2 z-10 font-semibold"
          >
            -{discountPercent}%
          </Badge>
        )}
        
        {product.featured && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 z-10"
          >
            Featured
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 z-10 h-8 w-8 rounded-full backdrop-blur-sm transition-colors ${
            isLiked 
              ? 'bg-destructive/90 text-destructive-foreground hover:bg-destructive' 
              : 'bg-background/70 hover:bg-background/90'
          }`}
          onClick={handleToggleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>

        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setImageLoading(false)}
          loading="lazy"
        />

        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}

        {/* Quick add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-white text-black hover:bg-white/90"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-semibold line-clamp-2 text-sm mb-2 hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              Ksh.{product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                Ksh.{product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>

          {quantity > 0 && (
            <Badge variant="secondary" className="text-xs">
              {quantity} in cart
            </Badge>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs ${product.inStock ? 'text-success' : 'text-destructive'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}