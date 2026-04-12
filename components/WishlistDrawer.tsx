'use client'

import { useContext, useEffect, useState } from 'react'
import { WishlistContext } from '@/contexts/WishlistContext'
import { X, Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { CartContext } from '@/contexts/CartContext'

export default function WishlistDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem } = useContext(WishlistContext)
  const { addItem } = useContext(CartContext)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('openWishlist', handleOpen)
    return () => window.removeEventListener('openWishlist', handleOpen)
  }, [])

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 text-red-600">
            <Heart className="w-5 h-5 fill-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Your Lists</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 mt-20">
              <Heart className="w-16 h-16 text-gray-200" />
              <p>Your list is completely empty.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 bg-white border border-gray-100 p-3 rounded-xl shadow-sm relative">
                <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0 py-1">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-auto">Rs. {Number(item.price).toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <button 
                      onClick={() => removeItem(String(item.id))}
                      className="text-xs text-red-500 font-medium hover:underline"
                    >
                      Remove
                    </button>
                    <button 
                      onClick={() => {
                        addItem(String(item.id), item.name, item.price, item.imageUrl || '', 1)
                      }}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
