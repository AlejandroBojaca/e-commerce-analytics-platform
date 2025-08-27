import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Product } from '@/types'

interface ProductsState {
  products: Product[]
  selectedProduct: Product | null
  isLoading: boolean
  searchTerm: string
  selectedCategory: string | null
  
  // Actions
  setProducts: (products: Product[]) => void
  setSelectedProduct: (product: Product | null) => void
  setIsLoading: (loading: boolean) => void
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string | null) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  
  // Getters
  getFilteredProducts: () => Product[]
  getCategories: () => string[]
}

export const useProductsStore = create<ProductsState>()(
  devtools((set, get) => ({
    products: [],
    selectedProduct: null,
    isLoading: false,
    searchTerm: '',
    selectedCategory: null,

    setProducts: (products) => set({ products }, false, 'setProducts'),
    
    setSelectedProduct: (selectedProduct) => 
      set({ selectedProduct }, false, 'setSelectedProduct'),
    
    setIsLoading: (isLoading) => set({ isLoading }, false, 'setIsLoading'),
    
    setSearchTerm: (searchTerm) => set({ searchTerm }, false, 'setSearchTerm'),
    
    setSelectedCategory: (selectedCategory) => 
      set({ selectedCategory }, false, 'setSelectedCategory'),
    
    addProduct: (product) =>
      set((state) => ({
        products: [...state.products, product]
      }), false, 'addProduct'),
    
    updateProduct: (id, updates) =>
      set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      }), false, 'updateProduct'),

    getFilteredProducts: () => {
      const { products, searchTerm, selectedCategory } = get()
      
      return products.filter(product => {
        const matchesSearch = searchTerm === '' || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesCategory = selectedCategory === null || 
          product.category === selectedCategory
        
        return matchesSearch && matchesCategory
      })
    },

    getCategories: () => {
      const { products } = get()
      const categories = Array.from(new Set(products.map(p => p.category)))
      return categories.sort()
    }
  }), { name: 'products-store' })
)
    