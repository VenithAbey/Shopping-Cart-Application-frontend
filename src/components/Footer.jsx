import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-[#1a1a1a] text-white pt-12 pb-6 mt-16 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <span className="text-xl font-bold tracking-tight">ShopCart</span>
          </Link>
          <button onClick={scrollToTop} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium px-4 py-2 rounded-md transition-colors">
            Back to top <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-800 pb-12 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Customer Service</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="mailto:support@shopcart.com" className="hover:underline hover:text-white">Help & Support</a></li>
              <li><a href="mailto:contact@shopcart.com" className="hover:underline hover:text-white">Contact Us</a></li>
              <li><Link to="/feedback" className="hover:underline hover:text-white">Feedback</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">About ShopCart</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/about" className="hover:underline hover:text-white">About Us</Link></li>
              <li><Link to="/privacy" className="hover:underline hover:text-white">Privacy Centre</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Connect on Social</h3>
            <div className="flex gap-4">
              {[InstagramIcon, FacebookIcon, TwitterIcon, YoutubeIcon].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-b border-gray-800 py-8 mb-4">
          <p className="text-xs text-gray-400 leading-relaxed max-w-5xl">
            For all ShopCart online liquor orders, ShopCart acts as an agent on behalf of our licensed partners. It is against the law to sell or supply alcohol to, or to obtain alcohol on behalf of, a person under the age of 18 years.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 pt-4">
          <p>© ShopCart Group Limited 1997-2026 - All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:underline hover:text-white">Privacy Policy</Link>
            <Link to="/cookies" className="hover:underline hover:text-white">Cookies Statement</Link>
            <Link to="/terms" className="hover:underline hover:text-white">Terms & Conditions</Link>
            <Link to="/accessibility" className="hover:underline hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
