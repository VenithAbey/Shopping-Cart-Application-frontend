'use client'

import { useState, useEffect, useContext } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, BookOpen, Tag, ShoppingBag, PlusSquare, ClipboardList, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { AuthContext } from '@/contexts/AuthContext'

const slides = [
  {
    id: 1,
    title: 'Fresh seasonal produce delivered straight to your door.',
    subtitle: 'Farm fresh veggies, ripe fruits, and organic options to keep you healthy.',
    bgColor: 'bg-green-700',
    buttonText: 'Shop Fresh',
    href: '/?category=Fresh%20Food',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200&auto=format&fit=crop&crop=center'
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
    <section className="max-w-[1400px] mx-auto w-full px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

        {/* ── Carousel ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100">

          {/* Slide area — fixed height adapts per breakpoint */}
          <div className="relative overflow-hidden group" style={{ minHeight: 0 }}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="min-w-full flex flex-row">

                  {/* Text side */}
                  <div className={`${slide.bgColor} text-white w-[55%] sm:w-[50%] p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center overflow-hidden`}>
                    <h2 className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 sm:mb-3 leading-tight tracking-tight line-clamp-4">
                      {slide.title}
                    </h2>
                    <p className="hidden sm:block text-xs sm:text-sm text-white/90 mb-4 leading-relaxed line-clamp-3">
                      {slide.subtitle}
                    </p>
                    <div className="shrink-0">
                      <Link
                        href={slide.href}
                        className="inline-block bg-white text-gray-900 px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>

                  {/* Image side */}
                  <div className="relative w-[45%] sm:w-[50%] bg-white overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover object-center scale-95"
                    />
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Footer controls */}
          <div className="h-11 sm:h-14 bg-white flex items-center justify-between px-4 sm:px-6 border-t border-gray-100 shrink-0">
            <div className="text-xs sm:text-sm font-semibold text-gray-500 tracking-widest">
              0{currentSlide + 1} / 0{slides.length}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-gray-400 hover:text-black transition-colors"
                aria-label={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />}
              </button>
              <div className="w-px h-5 bg-gray-200" />
              <button onClick={prevSlide} className="text-gray-400 hover:text-black transition-colors">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button onClick={nextSlide} className="text-gray-400 hover:text-black transition-colors">
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Quick Links — hidden on mobile, shown on lg+ ───────────────── */}
        <div className="hidden lg:flex w-full lg:w-[300px] xl:w-[360px] flex-col">
          {/* Welcome header */}
          <div className="shrink-0 mb-3 px-1">
            <h2 className="text-lg xl:text-xl font-extrabold text-gray-900 mb-0.5 tracking-tight">
              {authState?.user ? `Welcome back, ${authState.user.name}` : 'Welcome to ShopCart'}
            </h2>
            <p className="text-[12px] xl:text-[13px] text-gray-500 mb-1">
              {authState?.user ? 'Ready to pick up where you left off?' : 'Get the most out of your shop'}
            </p>
            {authState?.user ? (
              <span className="text-sm font-bold text-green-600">You are logged in</span>
            ) : (
              <button
                onClick={() => window.dispatchEvent(new Event('openLoginModal'))}
                className="text-sm font-bold text-red-600 hover:text-red-700 underline decoration-red-600/30 underline-offset-4 transition-colors"
              >
                Log in or sign up
              </button>
            )}
          </div>

          {/* Quick link cards */}
          <div className="flex flex-col flex-1 gap-2">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              const cls = "flex-1 flex items-center justify-between px-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group bg-white hover:-translate-y-0.5"
              const inner = (
                <>
                  <div className="flex flex-col justify-center py-2">
                    {link.isNew && <span className="text-[10px] uppercase font-bold text-red-500 leading-none mb-1 tracking-wider">New</span>}
                    <span className="text-[13px] font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <div className={`flex items-center justify-center p-2 rounded-full bg-gray-50 group-hover:bg-red-50 transition-colors ${link.color} group-hover:text-red-600`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </>
              )
              return link.action ? (
                <button key={index} onClick={() => window.dispatchEvent(new Event(link.action!))} className={`${cls} text-left`}>
                  {inner}
                </button>
              ) : (
                <Link key={index} href={link.href || '#'} className={cls}>
                  {inner}
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Mobile Quick Links — shown only on small screens ──────────── */}
        <div className="lg:hidden grid grid-cols-3 gap-2">
          {quickLinks.map((link, index) => {
            const Icon = link.icon
            const cls = "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all text-center"
            const inner = (
              <>
                <div className={`p-2 rounded-full bg-gray-50 ${link.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-gray-700 leading-tight">
                  {link.name}
                </span>
              </>
            )
            return link.action ? (
              <button key={index} onClick={() => window.dispatchEvent(new Event(link.action!))} className={cls}>
                {inner}
              </button>
            ) : (
              <Link key={index} href={link.href || '#'} className={cls}>
                {inner}
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
