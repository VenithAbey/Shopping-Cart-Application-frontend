'use client'

import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthContext } from '@/contexts/AuthContext'
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react'

interface AdminProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
}

interface Category {
  id: string
  name: string
}

export default function AdminPage() {
  const authState = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  })

  useEffect(() => {
    // Check if user is admin
    if (authState?.user?.role !== 'admin') {
      return
    }

    // Simulate loading data
    setTimeout(() => {
      setProducts([
        { id: '1', name: 'Fresh Vegetables Mix', description: 'Organic fresh vegetables', price: 12.99, category: 'vegetables', stock: 50 },
        { id: '2', name: 'Organic Tomatoes', description: 'Fresh red tomatoes from farm', price: 8.99, category: 'vegetables', stock: 40 }
      ])
      setCategories([
        { id: '1', name: 'vegetables' },
        { id: '2', name: 'fruits' },
        { id: '3', name: 'cakes' },
        { id: '4', name: 'biscuits' }
      ])
      setLoading(false)
    }, 500)
  }, [authState])

  if (authState?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Navigation />
        <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-slate-400 text-lg mb-4">Access Denied</p>
            <p className="text-slate-500 mb-6">You don&apos;t have permission to access the admin panel</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Back to Home
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newProduct: AdminProduct = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock)
    }

    setProducts([...products, newProduct])
    setFormData({ name: '', description: '', price: '', category: '', stock: '' })
    setShowProductForm(false)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const handleAddCategory = (e: React.FormEvent, input: HTMLInputElement) => {
    e.preventDefault()
    if (input.value.trim()) {
      setCategories([...categories, { id: Date.now().toString(), name: input.value }])
      input.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage products and categories</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'text-blue-400 border-blue-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'text-blue-400 border-blue-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'text-blue-400 border-blue-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Orders
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Products</h2>
              <Button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {showProductForm && (
              <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Product Name</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Stock</label>
                      <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1 block">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Add Product
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      variant="outline"
                      className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="space-y-3">
              {products.map(product => (
                <Card key={product.id} className="bg-slate-800 border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{product.name}</h3>
                      <p className="text-slate-400 text-sm">{product.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-slate-400">
                        <span>Category: {product.category}</span>
                        <span>Price: ${product.price.toFixed(2)}</span>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-slate-700">
                        <Edit2 className="w-4 h-4 text-blue-400" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product.id)}
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-700"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
            
            <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
              <form onSubmit={(e) => {
                const input = e.currentTarget.querySelector('input') as HTMLInputElement
                handleAddCategory(e, input)
              }} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="New category name"
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Category
                </Button>
              </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => (
                <Card key={category.id} className="bg-slate-800 border-slate-700 p-4 flex items-center justify-between">
                  <p className="text-white font-semibold capitalize">{category.name}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-slate-700"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Orders</h2>
            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <p className="text-slate-400">Order management coming soon</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
