import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/hooks/use-toast';

export default function Cart() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCartStore();
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(productId);
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart.',
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast({
      title: 'Item removed',
      description: `${productName} has been removed from your cart.`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart.',
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild>
            <Link to="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground mt-1">
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={handleClearCart}>
              Clear Cart
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {item.product.name}
                        </h3>
                        {item.product.brand && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.product.brand}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">
                            Ksh.{item.product.price.toFixed(2)}
                          </span>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              Ksh.{item.product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          Ksh.{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>Ksh.{total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Ksh.{(total * 0.08).toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>Ksh.{(total * 1.08).toFixed(2)}</span>
              </div>

              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}