'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
  category: { id: number; name: string }
}

const CATEGORIES = ['All', 'Fresh Food', 'Bakery & Sweets', 'Dairy & Eggs', 'Pantry', 'Drinks', 'Snacks']

const SUBCATEGORIES: Record<string, string[]> = {
  'Fresh Food': ['All Fresh Food', 'Vegetables', 'Fruits', 'Fresh Seafood', 'Meat'],
  'Bakery & Sweets': ['All Bakery & Sweets', 'Cakes', 'Biscuits', 'Bread', 'Pastries'],
  'Dairy & Eggs': ['All Dairy & Eggs', 'Milk', 'Cheese', 'Yogurt', 'Butter'],
  'Pantry': ['All Pantry', 'Grains', 'Spices', 'Oils', 'Canned Goods'],
  'Drinks': ['All Drinks', 'Coffee', 'Tea', 'Juice', 'Soft Drinks'],
  'Snacks': ['All Snacks', 'Chips', 'Nuts', 'Cookies', 'Candy']
};

function ProductCatalogInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get('category') || 'All'
  const subcategoryParam = searchParams.get('subcategory') || `All ${categoryParam}`
  const urlSearchTerm = searchParams.get('search') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Sync local search state when URL param changes
  useEffect(() => {
    setSearchTerm(urlSearchTerm)
  }, [urlSearchTerm])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (categoryParam !== 'All') params.append('categoryName', categoryParam)
      if (searchTerm.trim()) params.append('search', searchTerm.trim())

      const url = `/api/products${params.toString() ? '?' + params.toString() : ''}`
      const res = await fetch(url)

      if (!res.ok) throw new Error('Failed to fetch products')
      const data: Product[] = await res.json()
      setProducts(data)
    } catch (err) {
      setError('Could not load products. Please make sure the backend is running and the database is seeded.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [categoryParam, searchTerm])

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounce)
  }, [fetchProducts])

  const isDealsMode = searchParams.get('deals') === 'true'

  // Client-side filtering ensures instant UI updates when switching tabs.
  let filtered = categoryParam === 'All'
    ? products
    : products.filter(p => p.category?.name === categoryParam)

  // Frontend subcategory filtering based on exact string match in title or description.
  if (categoryParam !== 'All' && !subcategoryParam.startsWith('All ')) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(subcategoryParam.toLowerCase()) || 
      p.description.toLowerCase().includes(subcategoryParam.toLowerCase())
    )
  }

  if (isDealsMode) {
    filtered = filtered.map(p => ({
      ...p,
      price: p.price * 0.85, // 15% automatic discount
      description: `🔥 DEAL ${p.description}`
    }))
  }

  const setCategory = (cat: string) => {
    if (cat === 'All') {
      router.push('/')
    } else {
      router.push(`/?category=${encodeURIComponent(cat)}`)
    }
  }

  const setSubcategory = (sub: string) => {
    router.push(`/?category=${encodeURIComponent(categoryParam)}&subcategory=${encodeURIComponent(sub)}`)
  }

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {isDealsMode ? "💥 Today's Special Deals" : "Helping you find great value"}
          </h2>
          {isDealsMode && (
             <span className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider rounded-lg border border-red-200">
               15% OFF ALL ITEMS
             </span>
          )}
        </div>
        <p className="text-gray-600 text-[15px]">
          {isDealsMode ? "Don't miss out on these exclusive massive price drops!" : "Browse our selection of quality products at great prices"}
        </p>
      </div>

      {/* Pill Tabs for Categories */}
      <div className="mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isSelected = categoryParam === cat
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border cursor-pointer
                  ${isSelected 
                    ? 'bg-[#00803c] text-white border-[#00803c] shadow-md shadow-green-900/10' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Secondary Pill Tabs for Subcategories */}
      {categoryParam !== 'All' && SUBCATEGORIES[categoryParam] && (
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max border-t border-gray-200 pt-4">
            {SUBCATEGORIES[categoryParam].map((sub) => {
              const isSelected = subcategoryParam === sub
              return (
                <button
                  key={sub}
                  onClick={() => setSubcategory(sub)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border
                    ${isSelected 
                      ? 'bg-red-50 text-red-700 border-red-200 font-bold' 
                      : 'bg-white text-gray-600 border-transparent hover:bg-gray-100'
                    }`}
                >
                  {sub}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#00803c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center min-h-96 bg-white border border-gray-100 rounded-2xl mb-12">
          <div className="text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-900 font-bold text-lg">No products found</p>
            <p className="text-gray-500 text-sm mt-2">Check back later or try adjusting filters</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-12">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductCatalog({ allowBrowseWithoutLogin = false }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <ProductCatalogInner />
      </Suspense>
    </div>
  )
}
