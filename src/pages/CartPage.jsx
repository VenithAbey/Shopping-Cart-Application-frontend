import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items, total, updateItem, removeItem } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{items.length} items in your cart</p>
        </div>

        {items.length === 0 ? (
          <Card className="bg-white border-gray-200 p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-700">Continue Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <Card key={item.id} className="bg-white border-gray-200 p-4 flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3C/svg%3E' }}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold mb-1">{item.name}</h3>
                    <p className="text-red-600 font-semibold mb-3">Rs. {item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateItem(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded text-sm">−</button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 text-center bg-gray-100 text-gray-900 rounded text-sm border border-gray-300"
                        min="1"
                      />
                      <button onClick={() => updateItem(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded text-sm">+</button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-between">
                    <p className="text-gray-900 font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-white border-gray-200 p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Rs. {total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Shipping</span><span>Free</span></div>
                  <div className="flex justify-between text-gray-600"><span>Tax (10%)</span><span>Rs. {(total * 0.1).toFixed(2)}</span></div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-900 font-bold text-lg">
                    <span>Total</span><span>Rs. {(total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/checkout" className="block">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 mb-3">Proceed to Checkout</Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full bg-white hover:bg-gray-100 text-gray-900 border-gray-300">Continue Shopping</Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
