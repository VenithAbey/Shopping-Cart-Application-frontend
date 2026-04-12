'use client'

import Link from 'next/link'
import { ArrowUp, Instagram, Facebook, Twitter, Youtube, AlertCircle } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#1a1a1a] text-white pt-12 pb-6 mt-16 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Top Row: Logo & Back to Top */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <span className="text-xl font-bold tracking-tight">ShopCart</span>
          </Link>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Back to top <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Link Columns & Social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-800 pb-12 mb-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Customer Service</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="mailto:support@shopcart.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Help & Support</Link></li>
              <li><Link href="mailto:contact@shopcart.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Contact Us</Link></li>
              <li><Link href="/feedback" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Feedback</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">About ShopCart</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="/about" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">About Us</Link></li>
              <li><Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Privacy Centre</Link></li>
            </ul>
          </div>

          {/* Column 3 - Social */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Connect on Social</h3>
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-b border-gray-800 py-8 mb-4">
          <p className="text-xs text-gray-400 leading-relaxed max-w-5xl">
            For all ShopCart online liquor orders, ShopCart acts as an agent on behalf of our licensed partners. It is against the law to sell or supply alcohol to, or to obtain alcohol on behalf of, a person under the age of 18 years. If you wish to voluntarily exclude yourself from being able to purchase alcohol from our site, you can find out more at our <Link href="#" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Alcohol Self Exclusion page</Link>.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 pt-4">
          <p>© ShopCart Group Limited 1997-2026 - All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Privacy Policy</Link>
            <Link href="/cookies" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Cookies Statement</Link>
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Terms & Conditions</Link>
            <Link href="/accessibility" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Accessibility</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
