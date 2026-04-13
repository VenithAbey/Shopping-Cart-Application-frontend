'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

import { AuthContext } from '@/contexts/AuthContext'
import { useContext } from 'react'

interface Order {
  id: string
  date: string
  total: number
  status: 'pending' | 'completed' | 'shipped'
  items: number
  customerName?: string
  fullItems?: any[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const authState = useContext(AuthContext)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token && authState?.user) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
          const res = await fetch(`${apiUrl}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            const mappedOrders = data.map((o: any) => ({
              id: o.orderNumber,
              date: new Date(o.createdAt).toLocaleDateString(),
              total: o.totalAmount,
              status: o.status.toLowerCase(),
              items: o.items.length,
              customerName: o.user?.name,
              fullItems: o.items
            }))
            setOrders(mappedOrders)
            return
          }
        }
      } catch (err) {
        console.error('Failed to fetch from backend', err)
      }

      // Guest Fallback
      const savedOrdersStr = localStorage.getItem('saved_orders')
      if (savedOrdersStr) {
        setOrders(JSON.parse(savedOrdersStr))
      }
    }

    fetchOrders().finally(() => setLoading(false))
  }, [authState])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'shipped':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and manage your orders</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="bg-white border-gray-200 p-8 text-center shadow-sm">
            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="bg-white border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Order ID</p>
                    <p className="text-gray-900 font-semibold">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Date</p>
                    <p className="text-gray-900 font-semibold">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between md:flex-col">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Total</p>
                      <p className="text-gray-900 font-semibold text-lg">Rs. {order.total.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 mt-2 md:mt-0">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
