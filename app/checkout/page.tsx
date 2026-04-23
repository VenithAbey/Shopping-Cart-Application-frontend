'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CheckCircle } from 'lucide-react'

import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  useEffect(() => {
    if (user) {
      const parts = user.name.split(' ')
      setFormData(prev => ({
        ...prev,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: user.email || ''
      }))
    }
  }, [user])



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate order submission
    try {
      // In real app, call your Spring Boot API
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        items: items,
        total: total * 1.1, // Including 10% tax
        status: 'pending'
      }

      // Build Backend Payload
      const orderPayload = {
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        items: items.map(i => ({ productId: Number(i.id), quantity: i.quantity }))
      }

      const token = localStorage.getItem('authToken')
      
      if (token && user) {
        // Post directly to SQL Database for Authenticated Users
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
        const res = await fetch(`${apiUrl}/orders`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        })
        if (!res.ok) throw new Error('Order placement failed with Backend server')
      } else {
        // Fallback simulate API call for Guests (who have no database ID)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newOrderInfo = {
          id: `ORD-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString(),
          total: total * 1.1,
          status: 'pending',
          items: items.length,
          customerName: `${formData.firstName} ${formData.lastName}`.trim() || formData.email || 'Guest',
          email: formData.email,
          fullItems: items
        }

        const existingOrdersStr = localStorage.getItem('saved_orders')
        const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : []
        localStorage.setItem('saved_orders', JSON.stringify([newOrderInfo, ...existingOrders]))
      }

      // Natively clear the global cart context
      await clearCart()

      setOrderPlaced(true)
    } catch (error) {
      alert('Failed to place order. Please try again.')
    }
  }


  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
            <p className="text-slate-400 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
            
            <div className="bg-slate-700 rounded p-4 mb-6 text-left">
              <p className="text-slate-300 mb-2"><strong>Order Number:</strong> ORD-{Date.now().toString().slice(-6)}</p>
              <p className="text-slate-300 mb-2"><strong>Email:</strong> {formData.email}</p>
              <p className="text-slate-300"><strong>Total Amount:</strong> Rs. {(total * 1.1).toFixed(2)}</p>
            </div>

            <p className="text-slate-400 mb-6">A confirmation email has been sent to {formData.email}</p>

            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/orders" className="block">
                <Button variant="outline" className="w-full bg-slate-700 hover:bg-slate-600 border-slate-600 text-white">
                  View My Orders
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Navigation />
        <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-slate-400 text-lg mb-4">Your cart is empty</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const tax = total * 0.1
  const finalTotal = total + tax

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
        <Link href="/cart" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">First Name</label>
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Last Name</label>
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1 block">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1 block">Phone</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1 block">Address</label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">City</label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1 block">Zip Code</label>
                    <Input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1 block">Card Number</label>
                    <Input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">Expiry Date</label>
                      <Input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1 block">CVV</label>
                      <Input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-slate-800 border-slate-700 p-6 sticky top-20">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="text-white">{item.name}</p>
                        <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-blue-400 font-semibold">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-2">
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Subtotal</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Tax (10%)</span>
                    <span>Rs. {tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-bold">
                    <span>Total</span>
                    <span className="text-blue-400">Rs. {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-6"
                >
                  Place Order
                </Button>

                <Button
                  type="button"
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-600 mt-2"
                >
                  Continue Shopping
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
