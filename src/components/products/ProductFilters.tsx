import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useProductsStore } from '@/stores/productsStore';
import type { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
  className?: string;
}

export function ProductFilters({ categories, className }: ProductFiltersProps) {
  const { filters, setFilters, clearFilters } = useProductsStore();
  const [priceRange, setPriceRange] = useState([filters.priceRange?.min || 0, filters.priceRange?.max || 500]);
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    if (checked) {
      setFilters({ category: categoryName });
    } else {
      setFilters({ category: undefined });
    }
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    setFilters({
      priceRange: {
        min: value[0],
        max: value[1],
      },
    });
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    setFilters({
      rating: checked ? rating : undefined,
    });
  };

  const handleAvailabilityChange = (inStock: boolean, checked: boolean) => {
    setFilters({
      inStock: checked ? inStock : undefined,
    });
  };

  const hasActiveFilters = !!(
    filters.category ||
    filters.priceRange ||
    filters.rating ||
    filters.inStock !== undefined ||
    filters.featured
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1">
            {filters.category && (
              <Badge variant="secondary" className="text-xs">
                {filters.category}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 ml-1 hover:bg-transparent"
                  onClick={() => setFilters({ category: undefined })}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {filters.priceRange && (
              <Badge variant="secondary" className="text-xs">
                ksh.{filters.priceRange.min}-ksh.{filters.priceRange.max}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 ml-1 hover:bg-transparent"
                  onClick={() => setFilters({ priceRange: undefined })}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {filters.rating && (
              <Badge variant="secondary" className="text-xs">
                {filters.rating}+ stars
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 ml-1 hover:bg-transparent"
                  onClick={() => setFilters({ rating: undefined })}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Categories</span>
              {openSections.categories ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.category === category.name}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.name, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {category.name}
                  <span className="text-muted-foreground ml-1">
                    ({category.productCount})
                  </span>
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Price Range</span>
              {openSections.price ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-3">
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Ksh. {priceRange[0]}</span>
                <span>Ksh. {priceRange[1]}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Rating */}
        <Collapsible open={openSections.rating} onOpenChange={() => toggleSection('rating')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Rating</span>
              {openSections.rating ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) =>
                    handleRatingChange(rating, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-normal cursor-pointer flex items-center"
                >
                  {rating}+ stars
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Availability */}
        <Collapsible open={openSections.availability} onOpenChange={() => toggleSection('availability')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Availability</span>
              {openSections.availability ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock === true}
                onCheckedChange={(checked) =>
                  handleAvailabilityChange(true, checked as boolean)
                }
              />
              <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                In Stock Only
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}