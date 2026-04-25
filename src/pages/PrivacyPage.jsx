import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-500 mb-10 text-sm">Last updated: April 2026</p>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes name, email address, phone number, delivery address, and payment details.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>We use the information we collect to process transactions, send order confirmations, provide customer support, and improve our services. We do not sell your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@shopcart.com" className="text-red-600 hover:underline">privacy@shopcart.com</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
