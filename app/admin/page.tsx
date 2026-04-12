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

interface AdminOrder {
  id: string
  date: string
  total: number
  status: string
  items: number
  customerName: string
  email: string
}

export default function AdminPage() {
  const authState = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('catalog')
  const [activeCategoryTab, setActiveCategoryTab] = useState('All')
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
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

    const loadAdminData = async () => {
      try {
        const prodRes = await fetch('http://localhost:8080/api/products')
        if (prodRes.ok) {
          const data = await prodRes.json()
          setProducts(data.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            description: p.description,
            price: p.price,
            category: typeof p.category === 'object' ? p.category.name : p.category,
            stock: p.stock
          })))
        }
      } catch (e) {
        console.error('Failed to load products API', e)
        // Fallback dummy
        setProducts([
          { id: '1', name: 'Fresh Vegetables Mix', description: 'Organic fresh vegetables', price: 12.99, category: 'vegetables', stock: 50 }
        ])
      }

      setCategories([
        { id: '1', name: 'Fresh Food' },
        { id: '2', name: 'Bakery & Sweets' },
        { id: '3', name: 'Dairy & Eggs' },
        { id: '4', name: 'Pantry' },
        { id: '5', name: 'Drinks' },
        { id: '6', name: 'Snacks' }
      ])

      const token = localStorage.getItem('authToken')
      
      try {
        if (token) {
          const ordersRes = await fetch('http://localhost:8080/api/orders/all', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (ordersRes.ok) {
            const data = await ordersRes.json()
            setOrders(data.map((o: any) => ({
              id: o.orderNumber,
              date: new Date(o.createdAt).toLocaleDateString(),
              total: o.totalAmount,
              status: o.status.toLowerCase(),
              items: o.items.length,
              customerName: o.user?.name || 'Guest',
              email: o.user?.email || ''
            })))
          }
        }
      } catch (e) {
        console.error('Failed to load global orders', e)
        const savedOrdersStr = localStorage.getItem('saved_orders')
        if (savedOrdersStr) {
          setOrders(JSON.parse(savedOrdersStr))
        }
      }

      setLoading(false)
    }

    loadAdminData()
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
    
    try {
      const token = localStorage.getItem('authToken')
      const targetCategory = categories.find(c => c.name === formData.category)
      const categoryId = targetCategory ? targetCategory.id : '1'

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: '',
        categoryId: categoryId
      }

      if (token) {
        const res = await fetch('http://localhost:8080/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        })

        if (!res.ok) throw new Error('Failed backend item addition')
        const savedData = await res.json()
        setProducts([...products, {
          id: String(savedData.id),
          name: savedData.name,
          description: savedData.description,
          price: savedData.price,
          category: typeof savedData.category === 'object' ? savedData.category.name : savedData.category,
          stock: savedData.stock
        }])
      } else {
        throw new Error('No authorization token available')
      }
    } catch (e) {
      console.error('Failed to post product to backend, applying optimistic UI fallback', e)
      const newProduct: AdminProduct = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock)
      }
      setProducts([...products, newProduct])
    }

    setFormData({ name: '', description: '', price: '', category: '', stock: '' })
    setShowProductForm(false)
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        await fetch(`http://localhost:8080/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      }
    } catch (e) {
      console.error('Failed backend delete', e)
    }
    // Optimistic / clean-up state
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
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'catalog'
                ? 'text-blue-400 border-blue-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Catalog
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

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Catalog Management</h2>
              <Button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
              <form onSubmit={(e) => {
                const input = e.currentTarget.querySelector('input') as HTMLInputElement
                handleAddCategory(e, input)
              }} className="flex gap-2 max-w-md">
                <Input
                  type="text"
                  placeholder="Create a new category..."
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                />
                <Button type="submit" className="bg-slate-600 hover:bg-slate-500 text-white">
                  Add Category
                </Button>
              </form>
            </Card>

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

            {/* Category Sub-Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
              <button
                onClick={() => setActiveCategoryTab('All')}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${
                  activeCategoryTab === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Products
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryTab(category.name)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors capitalize ${
                    activeCategoryTab === category.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {products
                .filter(p => activeCategoryTab === 'All' || (p.category || 'Uncategorized') === activeCategoryTab)
                .map(product => (
                  <Card key={product.id} className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{product.name}</h3>
                        <p className="text-slate-400 text-sm">{product.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-slate-400">
                          <span>Category: <span className="capitalize">{product.category}</span></span>
                          <span>Price: Rs. {product.price.toFixed(2)}</span>
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
              {products.filter(p => activeCategoryTab === 'All' || (p.category || 'Uncategorized') === activeCategoryTab).length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No products found in this category.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Orders</h2>
            {orders.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                <p className="text-slate-400">No recent orders found</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id} className="bg-slate-800 border-slate-700 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold">{order.id}</h3>
                        <p className="text-slate-400 text-sm">{order.date}</p>
                        <p className="text-slate-300 mt-2"><strong>Customer:</strong> {order.customerName} ({order.email})</p>
                        <p className="text-slate-300"><strong>Items:</strong> {order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-400">Rs. {order.total.toFixed(2)}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-semibold capitalize">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
