'use client'

import Link from 'next/link'

const categories = [
  { id: 1, name: 'Outdoor Furniture', emoji: '🪑', color: 'bg-green-200' },
  { id: 2, name: 'Outdoor Pillows', emoji: '🛋️', color: 'bg-green-200' },
  { id: 3, name: 'Outdoor Rugs', emoji: '🧶', color: 'bg-green-200' },
  { id: 4, name: 'Planters', emoji: '🪴', color: 'bg-green-200' },
  { id: 5, name: 'Lawn & Garden', emoji: '🌱', color: 'bg-green-200' },
  { id: 6, name: 'All Outdoor Living', emoji: '🏡', color: 'bg-green-200' },
]

export default function CategoryShowcase() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link key={category.id} href="/">
            <div className="group cursor-pointer">
              <div className={`${category.color} rounded-full w-full aspect-square flex items-center justify-center mb-4 group-hover:shadow-lg transition-all transform group-hover:scale-105`}>
                <span className="text-5xl md:text-6xl">{category.emoji}</span>
              </div>
              <h3 className="text-center text-sm md:text-base font-medium text-gray-800 group-hover:text-red-600 transition-colors">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
