"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProductsStore } from '@/store/products'
import { formatCurrency } from '@/lib/utils'
import { Search, Filter, Plus, Package, TrendingUp, TrendingDown } from 'lucide-react'
import { useEffect, useState } from 'react'

// Mock products data for demonstration
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 45,
    imageUrl: '/api/placeholder/200/200',
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    category: 'Clothing',
    price: 24.99,
    stock: 120,
    imageUrl: '/api/placeholder/200/200',
    description: 'Comfortable organic cotton t-shirt'
  },
  {
    id: '3',
    name: 'Smart Water Bottle',
    category: 'Fitness',
    price: 34.99,
    stock: 8, // Low stock
    imageUrl: '/api/placeholder/200/200',
    description: 'Track your hydration with this smart bottle'
  },
  {
    id: '4',
    name: 'Leather Wallet',
    category: 'Accessories',
    price: 59.99,
    stock: 78,
    imageUrl: '/api/placeholder/200/200',
    description: 'Premium leather wallet with RFID protection'
  },
  {
    id: '5',
    name: 'Gaming Mouse',
    category: 'Electronics',
    price: 79.99,
    stock: 2, // Critical stock
    imageUrl: '/api/placeholder/200/200',
    description: 'High-precision gaming mouse'
  }
]

export default function ProductsPage() {
  const {
    products,
    searchTerm,
    selectedCategory,
    setProducts,
    setSearchTerm,
    setSelectedCategory,
    getFilteredProducts,
    getCategories
  } = useProductsStore()

  const [loading, setLoading] = useState(true)

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [setProducts])

  const filteredProducts = getFilteredProducts()
  const categories = getCategories()

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return { label: 'Critical', variant: 'destructive' as const, icon: TrendingDown }
    if (stock <= 20) return { label: 'Low', variant: 'warning' as const, icon: TrendingDown }
    return { label: 'In Stock', variant: 'success' as const, icon: TrendingUp }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage your product catalog and inventory
            </p>
          </div>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select 
                value={selectedCategory || undefined} 
                onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
              >
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3 mb-4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setSelectedCategory(null)
              }}>
                Clear filters
              </Button>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock)
              const StockIcon = stockStatus.icon
              
              return (
                <Card key={product.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        
                        <div className="flex items-center space-x-1">
                          <StockIcon className="w-3 h-3" />
                          <Badge variant={stockStatus.variant} className="text-xs">
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold">
                          {formatCurrency(product.price)}
                        </span>
                        
                        <span className="text-sm text-muted-foreground">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Summary Stats */}
        {!loading && products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Product Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <div className="text-sm text-muted-foreground">Total Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {products.filter(p => p.stock <= 5).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Critical Stock</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {products.filter(p => p.stock > 5 && p.stock <= 20).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Low Stock</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}