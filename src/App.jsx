import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import WishlistDrawer from '@/components/WishlistDrawer'
import WaysToShopModal from '@/components/WaysToShopModal'
import Footer from '@/components/Footer'

import HomePage from '@/pages/HomePage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrdersPage from '@/pages/OrdersPage'
import AboutPage from '@/pages/AboutPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'
import CookiesPage from '@/pages/CookiesPage'
import AccessibilityPage from '@/pages/AccessibilityPage'
import FeedbackPage from '@/pages/FeedbackPage'
import AdminLoginPage from '@/pages/AdminLoginPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Routes>
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </div>
      {/* Global overlays */}
      <WishlistDrawer />
      <WaysToShopModal />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
