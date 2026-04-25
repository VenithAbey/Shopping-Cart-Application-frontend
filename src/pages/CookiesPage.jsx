import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function CookiesPage() {
  return (
    <div>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Cookies Statement</h1>
        <p className="text-gray-500 mb-10 text-sm">Last updated: April 2026</p>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What Are Cookies?</h2>
            <p>Cookies are small text files placed on your device when you visit our website. They help us provide a better experience by remembering your preferences and login status.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">How We Use Cookies</h2>
            <p>We use essential cookies to keep you logged in and remember your cart. We also use analytics cookies to understand how visitors use our site and improve it over time.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Note that disabling certain cookies may affect the functionality of ShopCart.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
