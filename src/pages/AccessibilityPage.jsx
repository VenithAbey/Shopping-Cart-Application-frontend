import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function AccessibilityPage() {
  return (
    <div>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Accessibility</h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          ShopCart is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Our Commitment</h2>
        <p className="text-gray-700 mb-6">We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. If you encounter any accessibility barriers, please contact us.</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h2>
        <p className="text-gray-700">Email us at <a href="mailto:accessibility@shopcart.com" className="text-red-600 hover:underline">accessibility@shopcart.com</a> and we will do our best to accommodate your needs.</p>
      </div>
      <Footer />
    </div>
  )
}
