'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const categories = [
  {
    name: 'Fresh Food',
    subcategories: ['Vegetables', 'Fruits', 'Fresh Seafood', 'Meat']
  },
  {
    name: 'Bakery & Sweets',
    subcategories: ['Cakes', 'Biscuits', 'Bread', 'Pastries']
  },
  {
    name: 'Dairy & Eggs',
    subcategories: ['Milk', 'Cheese', 'Yogurt', 'Butter']
  },
  {
    name: 'Pantry',
    subcategories: ['Grains', 'Spices', 'Oils', 'Canned Goods']
  },
  {
    name: 'Drinks',
    subcategories: ['Coffee', 'Tea', 'Juice', 'Soft Drinks']
  },
  {
    name: 'Snacks',
    subcategories: ['Chips', 'Nuts', 'Cookies', 'Candy']
  }
]

export default function CategoryMegamenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  return (
    <div className="relative group">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 font-medium hover:text-red-600 transition-colors"
      >
        Categories
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Megamenu Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-4 bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden w-[700px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex h-[450px]">
            {/* Left Column - Main Categories (No scrollbar needed as height holds 9 items comfortably) */}
            <div className="w-1/3 bg-gray-50 p-4 space-y-1 flex flex-col justify-center border-r border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">Departments</h3>
              {categories.map((category) => (
                <button
                  key={category.name}
                  onMouseEnter={() => setSelectedCategory(category)}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    selectedCategory.name === category.name
                      ? 'bg-white shadow-sm text-red-600 font-semibold border border-gray-100'
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 border border-transparent'
                  }`}
                >
                  <span className="text-sm">{category.name}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${selectedCategory.name === category.name ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </button>
              ))}
            </div>

              {/* Right Column - Subcategories */}
            <div className="w-2/3 p-8 bg-white flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedCategory.name}
                </h3>
                <Link href={`/?category=${encodeURIComponent(selectedCategory.name)}`} onClick={() => setIsOpen(false)}>
                  <Button className="bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border-0 text-sm font-semibold rounded-full shadow-sm">
                    Shop All {selectedCategory.name}
                  </Button>
                </Link>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {selectedCategory.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory}
                    href={`/?category=${encodeURIComponent(selectedCategory.name)}`}
                    onClick={() => setIsOpen(false)}
                    className="group"
                  >
                    <div className="flex items-center text-gray-600 py-2 transition-all duration-200 hover:text-red-600">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3 group-hover:bg-red-500 group-hover:scale-150 transition-all duration-200" />
                      <span className="font-medium">{subcategory}</span>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-auto pt-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide">Featured Deal</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">Up to 30% off {selectedCategory.name}</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-full text-xs h-8">
                    Claim Offer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
