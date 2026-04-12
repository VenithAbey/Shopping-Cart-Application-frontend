export default function CookiesPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookies Statement</h1>
      <div className="prose prose-red max-w-none text-gray-700 space-y-6">
        <p className="leading-relaxed">
          ShopCart uses localized tokens (such as `localStorage` caching) exclusively to enhance your UI experience, such as remembering your delivery location context, maintaining your Cart session, and persisting your Wishlist items between reloads without actively tracking your behavior.
        </p>
        <p className="leading-relaxed">
          We do not deploy third-party advertising tracking cookies or analytics sniffers. By using this platform, you agree to our strictly functional persistence architecture.
        </p>
      </div>
    </div>
  )
}
