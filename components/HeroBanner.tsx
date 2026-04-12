'use client'

import { useState, useEffect, useContext } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, BookOpen, Tag, ShoppingBag, PlusSquare, ClipboardList, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AuthContext } from '@/contexts/AuthContext'

const slides = [
  {
    id: 1,
    title: 'Fresh seasonal produce delivered straight to your door.',
    subtitle: 'Farm fresh veggies, ripe fruits, and organic options to keep you healthy.',
    bgColor: 'bg-green-700',
    buttonText: 'Shop Fresh',
    href: '/?category=Fresh%20Food',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Weekend BBQ Essentials',
    subtitle: 'Premium cuts, fresh buns, and everything you need for the perfect outdoor grill.',
    bgColor: 'bg-red-700',
    buttonText: 'View Specials',
    href: '/?deals=true',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Stock up on Pantry Staples',
    subtitle: 'Buy in bulk and save on everyday essentials for your household.',
    bgColor: 'bg-blue-700',
    buttonText: 'Shop Pantry',
    href: '/?category=Pantry',
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?q=80&w=800&auto=format&fit=crop'
  }
]

const quickLinks = [
  { name: 'Weekly Catalogue', icon: BookOpen, color: 'text-green-600', isNew: true, href: '/?deals=true' },
  { name: 'All Specials & Offers', icon: Tag, color: 'text-yellow-500', href: '/?deals=true' },
  { name: 'Ways to Shop', icon: ShoppingBag, color: 'text-green-700', action: 'openWaysToShop' },
  { name: 'Healthy & Organic', icon: PlusSquare, color: 'text-green-800', href: '/?category=Fresh%20Food' },
  { name: 'Plan with Lists', icon: ClipboardList, color: 'text-gray-600', action: 'openWishlist' },
  { name: 'Trending Products', icon: TrendingUp, color: 'text-red-500', href: '/?category=Bakery%20%26%20Sweets' },
]

export default function HeroBanner() {
  const authState = useContext(AuthContext)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused])

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))

  return (
    <section className="max-w-[1400px] mx-auto w-full px-4 py-8">
      {/* Container forced to exact height on desktop for perfect leveling */}
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[450px]">
        
        {/* Left Side: Carousel (approx 70% width) */}
        <div className="flex-1 flex flex-col w-full h-[450px] overflow-hidden rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100">
          
          {/* Main Slide Area */}
          <div className="relative flex-1 bg-gray-100 overflow-hidden group">
            {/* The sliding container */}
            <div 
              className="absolute inset-0 flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="min-w-full h-full flex flex-col md:flex-row">
                  {/* Left Text Box */}
                  <div className={`${slide.bgColor} text-white w-full md:w-[55%] p-10 xl:p-14 flex flex-col justify-center`}>
                    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 xl:mb-6 leading-tight tracking-tight">{slide.title}</h2>
                    <p className="text-base xl:text-lg text-white/90 mb-8 max-w-sm leading-relaxed">{slide.subtitle}</p>
                    <div>
                      <Link
                        href={slide.href}
                        className="inline-block bg-white text-gray-900 px-6 xl:px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>
                  
                  {/* Right Image Box */}
                  <div className="relative w-full md:w-[45%] h-64 md:h-full bg-gray-200">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Footer Controls */}
          <div className="h-14 bg-white flex items-center justify-between px-6 border-t border-gray-100 shrink-0">
            <div className="text-sm font-semibold text-gray-500 tracking-widest">
              0{currentSlide + 1} / 0{slides.length}
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="text-gray-400 hover:text-black transition-colors"
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="w-5 h-5" fill="currentColor" /> : <Pause className="w-5 h-5" fill="currentColor" />}
              </button>
              
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              
              <button onClick={prevSlide} className="text-gray-400 hover:text-black transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextSlide} className="text-gray-400 hover:text-black transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Links (approx 30% width) */}
        <div className="w-full lg:w-[320px] xl:w-[380px] flex flex-col h-[450px]">
          {/* Header block strictly sized */}
          <div className="shrink-0 mb-4 px-1">
            <h2 className="text-xl font-extrabold text-gray-900 mb-0.5 tracking-tight">
              {authState?.user ? `Welcome back, ${authState.user.name}` : 'Welcome to ShopCart'}
            </h2>
            <p className="text-[13px] text-gray-500 mb-1">
              {authState?.user ? 'Ready to pick up where you left off?' : 'Get the most out of your shop'}
            </p>
            {authState?.user ? (
              <span className="text-sm font-bold text-green-600">
                You are logged in
              </span>
            ) : (
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  window.dispatchEvent(new Event('openLoginModal'))
                }}
                className="text-sm font-bold text-red-600 hover:text-red-700 underline decoration-red-600/30 underline-offset-4 transition-colors"
               >
                Log in or sign up
              </button>
            )}
          </div>

          {/* Links block filling remaining height evenly */}
          <div className="flex flex-col flex-1 gap-2.5">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return link.action ? (
                <button
                  key={index}
                  onClick={() => window.dispatchEvent(new Event(link.action))}
                  className="flex-1 flex items-center justify-between px-5 md:px-4 xl:px-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group bg-white hover:-translate-y-0.5 text-left"
                >
                  <div className="flex flex-col justify-center">
                    {link.isNew && <span className="text-[10px] uppercase font-bold text-red-500 leading-none mb-1 tracking-wider">New</span>}
                    <span className="text-[13px] xl:text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <div className={`flex items-center justify-center p-2 rounded-full bg-gray-50 group-hover:bg-red-50 transition-colors ${link.color} group-hover:text-red-600`}>
                    <Icon className="w-4 h-4 xl:w-5 xl:h-5" />
                  </div>
                </button>
              ) : (
                <Link 
                  key={index}
                  href={link.href || '#'}
                  className="flex-1 flex items-center justify-between px-5 md:px-4 xl:px-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group bg-white hover:-translate-y-0.5"
                >
                  <div className="flex flex-col justify-center">
                    {link.isNew && <span className="text-[10px] uppercase font-bold text-red-500 leading-none mb-1 tracking-wider">New</span>}
                    <span className="text-[13px] xl:text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <div className={`flex items-center justify-center p-2 rounded-full bg-gray-50 group-hover:bg-red-50 transition-colors ${link.color} group-hover:text-red-600`}>
                    <Icon className="w-4 h-4 xl:w-5 xl:h-5" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        
      </div>
    </section>
  )
}
