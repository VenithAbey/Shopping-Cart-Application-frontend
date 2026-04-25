import { createContext, useState, useEffect, useContext } from 'react'

export const WishlistContext = createContext({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  isPinned: () => false,
})

export const useWishlist = () => useContext(WishlistContext)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }, [items])

  const addItem = (item) => setItems(prev => {
    if (prev.find(p => p.id === item.id)) return prev
    return [...prev, item]
  })

  const removeItem = (id) => setItems(prev => prev.filter(p => String(p.id) !== id))
  const isPinned = (id) => items.some(p => String(p.id) === id)

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isPinned }}>
      {children}
    </WishlistContext.Provider>
  )
}
