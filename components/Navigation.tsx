'use client'

import { useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthContext } from '@/contexts/AuthContext'
import { CartContext } from '@/contexts/CartContext'
import { Menu, X, ShoppingCart, LogOut, User, Search } from 'lucide-react'
import LoginModal from '@/components/auth/LoginModal'
import CategoryMegamenu from '@/components/CategoryMegamenu'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('Set your delivery address')
  const [tempAddress, setTempAddress] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('deliveryAddress')
    if (saved) setDeliveryAddress(saved)
    
    const handleOpenLogin = () => setShowLoginModal(true)
    window.addEventListener('openLoginModal', handleOpenLogin)
    return () => window.removeEventListener('openLoginModal', handleOpenLogin)
  }, [])

  const handleSaveLocation = () => {
    if (tempAddress.trim()) {
      setDeliveryAddress(tempAddress.trim())
      localStorage.setItem('deliveryAddress', tempAddress.trim())
      setShowLocationModal(false)
    }
  }

  const authState = useContext(AuthContext)
  const cartState = useContext(CartContext)

  const handleLogout = () => {
    authState.logout()
  }

  const cartCount = cartState?.items?.length || 0

  return (
    <>
      {/* Top Red Banner */}
      <div className="bg-red-600 text-white py-2 px-4">
        <div className="max-w-[1400px] mx-auto w-full px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-80 transition-opacity font-bold">🛒 ShopCart</Link>
            <span className="hidden sm:inline">Fresh products, delivered</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/orders" className="hover:opacity-80">My Orders</Link>
            {authState?.user?.role === 'admin' && (
              <Link href="/admin" className="hover:opacity-80">Admin</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto w-full px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="text-3xl font-bold text-red-600">🛒</div>
            </Link>

            {/* Categories - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-6">
              <CategoryMegamenu />
              <Link href="/" className="text-gray-700 font-medium hover:text-red-600 transition-colors">
                Deals
              </Link>
              <button 
                onClick={() => setShowLocationModal(true)}
                className="flex flex-col items-start px-2 py-1 hover:bg-gray-100 rounded-md transition-colors text-left"
              >
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-none">Delivery to:</span>
                <span className="text-[15px] font-bold text-red-600 line-clamp-1 leading-tight">{deliveryAddress}</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="What can we help you find?"
                  className="w-full bg-gray-100 border-0 rounded-lg pl-4 pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {authState?.user ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
                    <User className="w-5 h-5 mr-2" />
                    {authState.user.name}
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  variant="ghost"
                  className="text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-5 h-5 mr-2" />
                  Sign in
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden ml-auto"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 border-0 rounded-lg pl-4 pr-10"
              />
              <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-2 pb-4">
              <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Categories
              </Link>
              <Link href="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Cart ({cartCount})
              </Link>
              {authState?.user ? (
                <>
                  {authState.user.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      Admin
                    </Link>
                  )}
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
                >
                  Sign in
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Choose your location</h2>
              <button onClick={() => setShowLocationModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Delivery options and delivery speeds may vary for different locations.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter a Sri Lankan delivery address</label>
                <Input
                  type="text"
                  placeholder="e.g. 123 Galle Road, Colombo"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>
              <Button
                onClick={handleSaveLocation}
                disabled={!tempAddress.trim()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2"
              >
                Apply Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
