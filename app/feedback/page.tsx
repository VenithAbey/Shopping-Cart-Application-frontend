import { Button } from '@/components/ui/button'

export default function FeedbackPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">We Value Your Feedback</h1>
      <p className="text-gray-600 mb-8">
        Your thoughts help us improve ShopCart. Please let us know how we can make your grocery shopping experience even better.
      </p>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">What is your feedback about?</label>
          <select className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            <option>Website Experience</option>
            <option>Product Variety</option>
            <option>Delivery Quality</option>
            <option>Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Details</label>
          <textarea 
            className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[150px]"
            placeholder="Tell us what you think..."
          />
        </div>
        
        <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
          Submit Feedback
        </Button>
      </form>
    </div>
  )
}
