export default function PrivacyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Centre</h1>
      
      <div className="prose prose-red max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Data Collection</h2>
          <p className="leading-relaxed">
            At ShopCart, we collect only the information necessary to fulfill your orders and enhance your secure shopping experience. This includes your name, email, encrypted payment tokens, and delivery endpoints.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data Usage</h2>
          <p className="leading-relaxed">
            Your data is strictly used for order processing, logistics routing, and platform analytics. We do not sell your personal demographic data to third-party advertising brokers under any circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Security Protcols</h2>
          <p className="leading-relaxed">
            We enforce strict JWT authorization protocols and enterprise-grade AES encryption for all data packets transmitted between our React frontend clusters and our Spring Boot microservices.
          </p>
        </section>
      </div>
    </div>
  )
}
