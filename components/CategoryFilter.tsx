'use client'

import { Button } from '@/components/ui/button'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <Button
          key={category}
          onClick={() => onCategoryChange(category)}
          variant={selectedCategory === category ? 'default' : 'outline'}
          className={`capitalize ${
            selectedCategory === category
              ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
              : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
          }`}
        >
          {category === 'all' ? 'All Products' : category}
        </Button>
      ))}
    </div>
  )
}
