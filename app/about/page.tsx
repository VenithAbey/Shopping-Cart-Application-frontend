import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center">About ShopCart</h1>
      <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
        We are on a mission to redefine grocery shopping by bringing the freshest products right to your doorstep with zero friction.
      </p>
      
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
          <Image 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop" 
            alt="Fresh Groceries" 
            fill 
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Farm to Doorstep</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Founded in 2026, ShopCart partners directly with local farmers and verified wholesale suppliers. 
            By cutting out the middlemen, we ensure that the apples, milk, and breads you buy are significantly fresher than what sits on traditional supermarket shelves.
          </p>
          <div className="flex gap-4">
            <div className="p-4 bg-red-50 rounded-xl">
              <h3 className="font-bold text-red-600 text-xl">100k+</h3>
              <p className="text-sm border-gray-600 font-medium">Daily Orders</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <h3 className="font-bold text-green-600 text-xl">50+</h3>
              <p className="text-sm border-gray-600 font-medium">Local Farms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
