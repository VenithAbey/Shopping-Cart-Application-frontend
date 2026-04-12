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
          const res = await fetch('http://localhost:8080/api/orders', {
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
        return 'bg-green-500/10 text-green-400'
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400'
      default:
        return 'bg-slate-500/10 text-slate-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-slate-400">View and manage your orders</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-slate-400 text-lg mb-4">No orders yet</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="bg-slate-800 border-slate-700 p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Order ID</p>
                    <p className="text-white font-semibold">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Date</p>
                    <p className="text-white font-semibold">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between md:flex-col">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Total</p>
                      <p className="text-white font-semibold text-lg">Rs. {order.total.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
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
