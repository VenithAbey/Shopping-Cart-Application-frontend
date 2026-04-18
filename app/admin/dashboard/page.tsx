'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Trash2, Edit2, Users, KeyRound, LogOut, Shield } from 'lucide-react'

interface AdminProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl: string
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
  fullItems?: any[]
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null)
  const [activeTab, setActiveTab] = useState('catalog')
  const [activeCategoryTab, setActiveCategoryTab] = useState('All')
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' })
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' })
  const [productSearch, setProductSearch] = useState('')
  
  // Admin creation state
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userStr = localStorage.getItem('adminUser')
    if (!token || !userStr) { router.replace('/admin'); return }
    const parsed = JSON.parse(userStr)
    if (parsed.role !== 'admin') { router.replace('/admin'); return }
    setAdminUser(parsed)
    loadData(token)
  }, [])

  const loadData = async (token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    try {
      const prodRes = await fetch(`${apiUrl}/products`)
      if (prodRes.ok) {
        const data = await prodRes.json()
        setProducts(data.map((p: any) => ({
          id: String(p.id), name: p.name, description: p.description,
          price: p.price, category: typeof p.category === 'object' ? p.category.name : p.category,
          stock: p.stock, imageUrl: p.imageUrl || ''
        })))
      }
    } catch (e) { console.error('Products load failed', e) }

    try {
      const catRes = await fetch(`${apiUrl}/categories`)
      if (catRes.ok) {
        const data = await catRes.json()
        setCategories(data.map((c: any) => ({ id: String(c.id), name: c.name })))
      }
    } catch (e) { console.error('Categories load failed', e) }

    try {
      const ordersRes = await fetch(`${apiUrl}/orders/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (ordersRes.ok) {
        const data = await ordersRes.json()
        setOrders(data.map((o: any) => ({
          id: o.orderNumber, date: new Date(o.createdAt).toLocaleDateString(),
          total: o.totalAmount, status: o.status.toLowerCase(),
          items: o.items.length, customerName: o.user?.name || 'Guest', email: o.user?.email || '',
          fullItems: o.items
        })))
      }
    } catch (e) { console.error('Orders load failed', e) }

    setLoading(false)
  }

  const loadUsers = async () => {
    const token = localStorage.getItem('adminToken')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    try {
      const res = await fetch(`${apiUrl}/users/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data.map((u: any) => ({
          id: String(u.id), name: u.name, email: u.email, role: u.role,
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'
        })))
      }
    } catch (e) { console.error('Users load failed', e) }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('adminToken')
    const targetCategory = categories.find(c => c.name === formData.category)
    if (!targetCategory) { alert('Please select a valid category'); return }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    try {
      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: formData.name, description: formData.description, price: parseFloat(formData.price), stock: parseInt(formData.stock), imageUrl: formData.imageUrl, categoryId: Number(targetCategory.id) })
      })
      if (res.ok) {
        const saved = await res.json()
        setProducts([...products, { id: String(saved.id), name: saved.name, description: saved.description, price: saved.price, category: typeof saved.category === 'object' ? saved.category.name : saved.category, stock: saved.stock }])
        setFormData({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' })
        setShowProductForm(false)
      } else {
        const err = await res.json()
        alert('Failed to add product: ' + (err.message || res.status))
      }
    } catch (e) {
      console.error('Add product failed', e)
      alert('Network error — make sure the backend is running.')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const token = localStorage.getItem('adminToken')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    try {
      await fetch(`${apiUrl}/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    } catch (e) { console.error('Delete failed', e) }
    setProducts(products.filter(p => p.id !== id))
  }

  const handleEditProduct = async (id: string) => {
    const token = localStorage.getItem('adminToken')
    const targetCategory = categories.find(c => c.name === editForm.category)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    try {
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: editForm.name, description: editForm.description, price: parseFloat(editForm.price), stock: parseInt(editForm.stock), imageUrl: editForm.imageUrl, categoryId: targetCategory?.id || '1' })
      })
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, ...editForm, price: parseFloat(editForm.price), stock: parseInt(editForm.stock), category: editForm.category, imageUrl: editForm.imageUrl } : p))
        setEditingProductId(null)
      }
    } catch (e) { console.error('Edit product failed', e) }
  }


  const handleResetPassword = async (userId: string) => {
    if (!newPassword.trim() || !oldPassword.trim()) return
    const token = localStorage.getItem('adminToken')
    setPwError('')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    try {
      const res = await fetch(`${apiUrl}/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, password: newPassword })
      })
      const data = await res.json()
      if (!res.ok) { setPwError(data.message || 'Failed to update password'); return }
      setResetPasswordUserId(null); setNewPassword(''); setOldPassword(''); setPwError('')
      alert('Password updated successfully!')
    } catch (e) { console.error('Password reset failed', e) }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    const token = localStorage.getItem('adminToken')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    try {
      await fetch(`${apiUrl}/users/${userId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      setUsers(users.filter(u => u.id !== userId))
    } catch (e) { console.error('Delete user failed', e) }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('adminToken')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    try {
      const res = await fetch(`${apiUrl}/auth/admin-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newAdminName, email: newAdminEmail, password: newAdminPassword })
      })
      if (res.ok) {
        alert('Admin account created successfully!')
        setShowAddAdmin(false); setNewAdminName(''); setNewAdminEmail(''); setNewAdminPassword('')
        loadUsers()
      } else {
        const err = await res.json()
        alert('Failed to create admin: ' + err.message)
      }
    } catch (e) {
      console.error('Failed to create admin', e)
    }
  }

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out of the Admin Portal?")) {
      localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser')
      router.replace('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-500" />
          <span className="font-bold text-white text-lg">ShopCart Admin Portal</span>
        </div>
        <div className="flex items-center gap-4">
          {adminUser && (
            <span className="text-slate-400 text-sm hidden md:block">
              Signed in as <span className="text-white font-semibold">{adminUser.name}</span>
            </span>
          )}
          <button onClick={() => router.push('/')} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
            ← View Store
          </button>
          <button onClick={handleSignOut} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your store — products, orders, and users</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {['catalog', 'orders', 'users'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); if (tab === 'users') loadUsers() }}
              className={`px-4 py-2 font-semibold border-b-2 capitalize transition-colors ${activeTab === tab ? 'text-blue-400 border-blue-400' : 'text-slate-400 border-transparent hover:text-white'}`}>
              {tab === 'users' ? <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Users</span> : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white">Catalog Management</h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-400"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Button onClick={() => setShowProductForm(!showProductForm)} className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </div>
            </div>

            {showProductForm && (
              <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Product Name</label>
                      <Input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-slate-700 border-slate-600 text-white" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Category</label>
                      <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2" required>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Price</label>
                      <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="bg-slate-700 border-slate-600 text-white" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Stock</label>
                      <Input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="bg-slate-700 border-slate-600 text-white" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1 block">Image URL (Optional)</label>
                    <Input type="text" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1 block">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2" rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Product</Button>
                    <Button type="button" onClick={() => setShowProductForm(false)} variant="outline" className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white">Cancel</Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Category Sub-Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
              <button onClick={() => setActiveCategoryTab('All')} className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${activeCategoryTab === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>All Products</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategoryTab(cat.name)} className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${activeCategoryTab === cat.name ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{cat.name}</button>
              ))}
            </div>

            <div className="space-y-3">
              {products
                .filter(p => activeCategoryTab === 'All' || p.category === activeCategoryTab)
                .filter(p => !productSearch.trim() || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.description.toLowerCase().includes(productSearch.toLowerCase()))
                .map(product => (
                <Card key={product.id} className="bg-slate-800 border-slate-700 p-4">
                  {editingProductId === product.id ? (
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div><label className="text-xs text-slate-400 mb-1 block">Name</label>
                          <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="bg-slate-700 border-slate-600 text-white h-8 text-sm" /></div>
                        <div><label className="text-xs text-slate-400 mb-1 block">Category</label>
                          <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full bg-slate-700 border border-slate-600 text-white rounded p-1.5 text-sm">
                            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                          </select></div>
                        <div><label className="text-xs text-slate-400 mb-1 block">Price</label>
                          <Input type="number" step="0.01" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="bg-slate-700 border-slate-600 text-white h-8 text-sm" /></div>
                        <div><label className="text-xs text-slate-400 mb-1 block">Stock</label>
                          <Input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} className="bg-slate-700 border-slate-600 text-white h-8 text-sm" /></div>
                      </div>
                      <div><label className="text-xs text-slate-400 mb-1 block">Image URL</label>
                        <Input value={editForm.imageUrl} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} className="bg-slate-700 border-slate-600 text-white h-8 text-sm" placeholder="https://..." /></div>
                      <div><label className="text-xs text-slate-400 mb-1 block">Description</label>
                        <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 text-sm" rows={2} /></div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEditProduct(product.id)} className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingProductId(null)} className="text-slate-400">Cancel</Button>
                      </div>
                    </div>
                  ) : (
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
                        <Button variant="ghost" size="icon" className="hover:bg-slate-700" onClick={() => { setEditingProductId(product.id); setEditForm({ name: product.name, description: product.description, price: String(product.price), category: product.category, stock: String(product.stock), imageUrl: product.imageUrl || '' }) }}>
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </Button>
                        <Button onClick={() => handleDeleteProduct(product.id)} variant="ghost" size="icon" className="hover:bg-slate-700"><Trash2 className="w-4 h-4 text-red-400" /></Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Orders</h2>
            {orders.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700 p-6 text-center"><p className="text-slate-400">No orders found</p></Card>
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
                        <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-semibold capitalize">{order.status}</span>
                      </div>
                    </div>

                    {/* Order Items Breakdown */}
                    {order.fullItems && order.fullItems.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-700">
                        <p className="text-sm font-semibold text-slate-300 mb-3">Purchased Items:</p>
                        <div className="space-y-2">
                          {order.fullItems.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm bg-slate-700/30 p-2 rounded">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-slate-700 rounded text-center text-blue-400 font-bold text-xs flex items-center justify-center">
                                  {item.quantity}x
                                </span>
                                <span className="text-slate-300">{item.product?.name || 'Unknown item'}</span>
                              </div>
                              <span className="text-slate-400">
                                Rs. {((item.product?.price || item.price || 0) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <Button onClick={() => setShowAddAdmin(!showAddAdmin)} className="bg-red-600 hover:bg-red-700 text-white">
                <Shield className="w-4 h-4 mr-2" /> Add Administrator
              </Button>
            </div>

            {showAddAdmin && (
              <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-red-500"/> Create Secure Admin Account</h3>
                <form onSubmit={handleAddAdmin} autoComplete="off" className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Full Name</label>
                      <Input type="text" value={newAdminName} onChange={e => setNewAdminName(e.target.value)} className="bg-slate-700 border-slate-600 text-white" required autoComplete="off" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Email</label>
                      <Input type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} className="bg-slate-700 border-slate-600 text-white" required autoComplete="off" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Password</label>
                      <Input type="password" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} className="bg-slate-700 border-slate-600 text-white" minLength={6} required autoComplete="new-password" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">Create Admin</Button>
                    <Button type="button" onClick={() => setShowAddAdmin(false)} variant="outline" className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white">Cancel</Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="space-y-3">
              {users.length === 0 && (
                <Card className="bg-slate-800 border-slate-700 p-6 text-center"><p className="text-slate-400">No users found. Check backend connection.</p></Card>
              )}
              {users.map(user => (
                <Card key={user.id} className="bg-slate-800 border-slate-700 p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{user.name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-slate-600 text-slate-300'}`}>{user.role}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{user.email}</p>
                      <p className="text-slate-500 text-xs mt-1">Joined: {user.createdAt}</p>
                    </div>

                    {resetPasswordUserId === user.id && (
                      <div className="flex flex-col gap-2 w-full mt-2 p-3 bg-slate-700/50 rounded-xl">
                        <p className="text-xs text-slate-400 font-semibold">Change Password for {user.name}</p>
                        <Input type="password" placeholder="Current password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
                        <Input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
                        {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleResetPassword(user.id)} className="bg-green-600 hover:bg-green-700 text-white">Update Password</Button>
                          <Button size="sm" variant="ghost" onClick={() => { setResetPasswordUserId(null); setNewPassword(''); setOldPassword(''); setPwError('') }} className="text-slate-400">Cancel</Button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={() => { setResetPasswordUserId(user.id); setNewPassword('') }} variant="ghost" size="sm" className="text-slate-300 hover:text-white gap-1">
                        <KeyRound className="w-4 h-4" /> Reset PW
                      </Button>
                      <Button onClick={() => handleDeleteUser(user.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
