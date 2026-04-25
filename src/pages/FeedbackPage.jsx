import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle } from 'lucide-react'

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '', rating: '5' })

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">Share Your Feedback</h1>
        <p className="text-gray-500 text-center mb-10">Help us improve ShopCart with your thoughts.</p>

        {submitted ? (
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
            <p className="text-gray-500">Your feedback has been received.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select name="rating" value={form.rating} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                {['5', '4', '3', '2', '1'].map(r => <option key={r} value={r}>{r} Star{r !== '1' ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your experience..." required rows={5}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">Submit Feedback</Button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  )
}
