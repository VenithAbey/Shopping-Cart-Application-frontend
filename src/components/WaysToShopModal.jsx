import { useEffect, useState } from 'react'
import { X, Search, MousePointerClick, Truck } from 'lucide-react'

export default function WaysToShopModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('openWaysToShop', handleOpen)
    return () => window.removeEventListener('openWaysToShop', handleOpen)
  }, [])

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity flex items-center justify-center p-4"
        onClick={() => setIsOpen(false)}
      >
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="bg-red-600 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">How to shop with us</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { Icon: Search, title: '1. Browse & Search', desc: 'Explore thousands of fresh products or use our search bar to find exactly what you need instantly.' },
                { Icon: MousePointerClick, title: '2. Add to Cart', desc: 'Click the green cart button on any item. We automatically calculate your taxes and subtotal in real-time.' },
                { Icon: Truck, title: '3. Relax & Receive', desc: 'Set your delivery location at the top and check out securely. We will deliver it straight to your door!' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button onClick={() => setIsOpen(false)} className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors">
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
