import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Terms & Conditions</h1>
        <p className="text-gray-500 mb-10 text-sm">Last updated: April 2026</p>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using ShopCart, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Use of Service</h2>
            <p>You agree to use ShopCart only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the site.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Orders & Payment</h2>
            <p>All orders are subject to product availability. We reserve the right to refuse or cancel any order at our discretion. Payment must be made at the time of purchase.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Contact</h2>
            <p>For any questions regarding these Terms, contact us at <a href="mailto:legal@shopcart.com" className="text-red-600 hover:underline">legal@shopcart.com</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
