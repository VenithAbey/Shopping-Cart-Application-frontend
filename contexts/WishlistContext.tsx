'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/components/ProductCatalog'

interface WishlistContextType {
  items: Product[]
  addItem: (item: Product) => void
  removeItem: (id: string) => void
  isPinned: (id: string) => boolean
}

export const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  isPinned: () => false
})

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  // Sync to localStorage on array mutation
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }, [items])

  const addItem = (item: Product) => setItems(prev => {
    if (prev.find(p => p.id === item.id)) return prev
    return [...prev, item]
  })

  const removeItem = (id: string) => setItems(prev => prev.filter(p => String(p.id) !== id))

  const isPinned = (id: string) => items.some(p => String(p.id) === id)

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isPinned }}>
      {children}
    </WishlistContext.Provider>
  )
}
