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
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <span className="text-xl font-bold tracking-tight">ShopCart</span>
          </div>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Back to top <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Customer Service</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="#" className="hover:underline hover:text-white">Help & Support</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Feedback</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Product Safety</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Product Recalls</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Return Policy</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Scam Warning</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Shop Groceries Online</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="#" className="hover:underline hover:text-white">View My Account</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Pick up</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Delivery</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Delivery Now</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">New to Online Shopping?</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Shop for your Business</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Useful Links</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="#" className="hover:underline hover:text-white">Store Locations & Trading Hours</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Everyday Rewards</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Recipes & Easy Dinner Ideas</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">ShopCart Catalogue</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Our pricing</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Meal Planner</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">ShopCart App</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">About ShopCart</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="#" className="hover:underline hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Our Brands</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Privacy Centre</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Community</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Suppliers</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">Become an Affiliate</Link></li>
              <li><Link href="#" className="hover:underline hover:text-white">About Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Partners and Social */}
        <div className="flex flex-col lg:flex-row justify-between border-t border-gray-800 pt-8 mb-12 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 tracking-tight">Our Partners</h3>
            <div className="flex flex-wrap gap-2">
              {/* Partner Placeholders */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-700">
                  <span className="text-gray-400 font-bold text-xs uppercase">Brand {i}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 tracking-tight">Connect on Social</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Acknowledgement and Accessibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-800 pt-8 mb-12">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full border border-orange-500 flex items-center justify-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-orange-500"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">
                We acknowledge the Traditional Owners and Custodians of Country throughout the land.
              </p>
              <p className="text-xs text-gray-400 mb-2">We pay our respects to all First Nations peoples and acknowledge Elders past and present.</p>
              <Link href="#" className="text-xs font-bold hover:underline">Read more about our commitment to reconciliation</Link>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
              <AlertCircle className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">
                ShopCart aims to create more inclusive access for team members and customers with disabilities.
              </p>
              <Link href="#" className="text-xs font-bold hover:underline">Website accessibility</Link>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-b border-gray-800 py-8 mb-4">
          <p className="text-xs text-gray-400 leading-relaxed max-w-5xl">
            For all ShopCart online liquor orders, ShopCart acts as an agent on behalf of our licensed partners. It is against the law to sell or supply alcohol to, or to obtain alcohol on behalf of, a person under the age of 18 years. If you wish to voluntarily exclude yourself from being able to purchase alcohol from our site, you can find out more at our <Link href="#" className="underline hover:text-white">Alcohol Self Exclusion page</Link>.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 pt-4">
          <p>© ShopCart Group Limited 1997-2026 - All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:underline hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:underline hover:text-white">Cookies Statement</Link>
            <Link href="#" className="hover:underline hover:text-white">Terms & Conditions</Link>
            <Link href="#" className="hover:underline hover:text-white">Accessibility</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
