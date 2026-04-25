import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'

const API_URL = '/api'

export const CartContext = createContext({
  items: [],
  total: 0,
  addItem: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartContext provider')
  return context
}

function getToken() {
  return localStorage.getItem('authToken')
}

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const loadCart = useCallback(async () => {
    const token = getToken()
    if (token) {
      try {
        const res = await fetch(`${API_URL}/cart`, { headers: authHeaders() })
        if (res.ok) {
          const data = await res.json()
          const mapped = data.map((ci) => ({
            id: String(ci.id),
            productId: String(ci.product.id),
            name: ci.product.name,
            price: ci.product.price,
            quantity: ci.quantity,
            image: ci.product.imageUrl || '',
          }))
          setItems(mapped)
          return
        }
      } catch (e) {
        console.error('Failed to load cart from API, falling back to localStorage', e)
      }
    }
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setItems(parsed)
        else if (parsed && Array.isArray(parsed.items)) setItems(parsed.items)
      } catch (e) {
        console.error('Error parsing local cart', e)
      }
    }
  }, [])

  useEffect(() => { loadCart() }, [loadCart])

  useEffect(() => {
    if (!getToken()) {
      const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      localStorage.setItem('cart', JSON.stringify({ items, total: totalCost }))
    }
  }, [items])

  const addItem = useCallback(async (productId, name, price, image, quantity = 1) => {
    const token = getToken()
    if (token) {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ productId: Number(productId), quantity }),
      })
      if (res.ok) { await loadCart(); return }
    }
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId)
      if (existing) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i)
      return [...prev, { id: Date.now().toString(), productId, name, price, quantity, image }]
    })
  }, [loadCart])

  const updateItem = useCallback(async (itemId, quantity) => {
    const token = getToken()
    if (token) {
      await fetch(`${API_URL}/cart/update/${itemId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ productId: 0, quantity }),
      })
      await loadCart()
      return
    }
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
  }, [loadCart])

  const removeItem = useCallback(async (itemId) => {
    const token = getToken()
    if (token) {
      await fetch(`${API_URL}/cart/${itemId}`, { method: 'DELETE', headers: authHeaders() })
      await loadCart()
      return
    }
    setItems(prev => prev.filter(i => i.id !== itemId))
  }, [loadCart])

  const clearCart = useCallback(async () => {
    const token = getToken()
    if (token) {
      await fetch(`${API_URL}/cart/clear`, { method: 'DELETE', headers: authHeaders() })
    }
    setItems([])
    localStorage.removeItem('cart')
  }, [])

  return (
    <CartContext.Provider value={{ items, total, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
