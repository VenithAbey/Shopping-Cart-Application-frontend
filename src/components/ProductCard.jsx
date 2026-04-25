import { useState, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { CartContext } from '@/contexts/CartContext'
import { WishlistContext } from '@/contexts/WishlistContext'
import { ShoppingCart, Heart } from 'lucide-react'

export default function ProductCard({ product }) {
  const { addItem } = useContext(CartContext)
  const { addItem: addWishlist, removeItem: removeWishlist, isPinned } = useContext(WishlistContext)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const pinned = isPinned(String(product.id))

  const handleToggleWishlist = () => {
    if (pinned) removeWishlist(String(product.id))
    else addWishlist(product)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addItem(String(product.id), product.name, product.price, product.imageUrl || '', quantity)
      setAdded(true)
      setQuantity(1)
      setTimeout(() => setAdded(false), 1500)
    } finally {
      setIsAdding(false)
    }
  }

  const imageUrl = product.imageUrl || ''
  const categoryName = typeof product.category === 'object' ? product.category?.name : product.category

  return (
    <div className="bg-white border rounded-lg hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all flex flex-col h-full group p-4 border-gray-200">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-white mb-2 overflow-hidden flex-shrink-0">
        <button
          onClick={(e) => { e.preventDefault(); handleToggleWishlist() }}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors text-gray-400 hover:text-red-500"
        >
          <Heart className={`w-5 h-5 transition-colors ${pinned ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%239ca3af" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">No Image</div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-[28px] font-bold text-gray-900 leading-none">Rs. {Number(product.price).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Rs. {Number(product.price).toFixed(2)} / 1KG</p>
        </div>

        <h3 className="text-gray-800 text-[15px] leading-snug line-clamp-3 mb-4">
          <span className="font-semibold">{product.name}</span> <span className="text-gray-500 font-normal capitalize">({categoryName})</span><br />
          <span className="text-xs text-gray-500 font-normal line-clamp-1 mt-0.5">{product.description}</span>
        </h3>

        <div className="mt-auto pt-2 space-y-2">
          {product.stock === 0 ? (
            <div className="flex items-center justify-center h-10 w-full bg-gray-100 text-gray-500 font-bold rounded text-sm mb-2">Out of Stock</div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between border border-gray-300 rounded h-10 w-full overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors" disabled={isAdding}>−</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center text-sm font-semibold text-gray-900 border-none focus:ring-0 p-0"
                  min="1"
                  max={product.stock}
                  disabled={isAdding}
                />
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors" disabled={isAdding}>+</button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className={`w-full h-10 rounded font-bold transition-all ${added ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#00803c] hover:bg-[#006A32] text-white'}`}
              >
                {isAdding ? 'Adding...' : added ? 'Added ✓' : 'Add to cart'}
              </Button>
              <button
                onClick={(e) => { e.preventDefault(); handleToggleWishlist() }}
                className="w-full py-1 text-center text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1.5 mt-0.5"
              >
                <Heart className={`w-3.5 h-3.5 ${pinned ? 'fill-red-500 text-red-500' : ''}`} />
                {pinned ? 'Saved to List' : 'Save to List'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
