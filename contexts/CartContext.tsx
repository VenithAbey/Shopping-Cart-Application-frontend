import React, { useState, useEffect, useCallback } from 'react'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface CartContextType {
  items: CartItem[]
  total: number
  addItem: (productId: string, name: string, price: number, image: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

export const CartContext = React.createContext<CartContextType>({
  items: [],
  total: 0,
  addItem: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
})

export const useCart = () => {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartContext provider')
  }
  return context
}

function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
}

function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Load cart: from API if logged in, from localStorage if guest
  const loadCart = useCallback(async () => {
    const token = getToken()
    if (token) {
      try {
        const res = await fetch('/api/cart', { headers: authHeaders() })
        if (res.ok) {
          const data = await res.json()
          // Map Spring Boot CartItem shape to frontend CartItem
          const mapped: CartItem[] = data.map((ci: any) => ({
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
    // Guest: load from localStorage
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        } else if (parsed && Array.isArray(parsed.items)) {
          setItems(parsed.items)
        }
      } catch (e) {
        console.error('Error parsing local cart', e)
      }
    }
  }, [])

  useEffect(() => { loadCart() }, [loadCart])

  // Persist guest cart to localStorage whenever items change
  useEffect(() => {
    if (!getToken()) {
      const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      localStorage.setItem('cart', JSON.stringify({ items, total: totalCost }))
    }
  }, [items])

  const addItem = useCallback(async (
    productId: string, name: string, price: number, image: string, quantity = 1
  ) => {
    const token = getToken()
    if (token) {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ productId: Number(productId), quantity }),
      })
      if (res.ok) {
        await loadCart()
        return
      }
    }
    // Guest: update localStorage
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId)
      if (existing) {
        return prev.map(i => i.productId === productId
          ? { ...i, quantity: i.quantity + quantity }
          : i)
      }
      return [...prev, { id: Date.now().toString(), productId, name, price, quantity, image }]
    })
  }, [loadCart])

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    const token = getToken()
    if (token) {
      await fetch(`/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ productId: 0, quantity }),
      })
      await loadCart()
      return
    }
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
  }, [loadCart])

  const removeItem = useCallback(async (itemId: string) => {
    const token = getToken()
    if (token) {
      await fetch(`/api/cart/${itemId}`, { method: 'DELETE', headers: authHeaders() })
      await loadCart()
      return
    }
    setItems(prev => prev.filter(i => i.id !== itemId))
  }, [loadCart])

  const clearCart = useCallback(async () => {
    const token = getToken()
    if (token) {
      await fetch('/api/cart/clear', { method: 'DELETE', headers: authHeaders() })
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
