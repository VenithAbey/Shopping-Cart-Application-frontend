import Navigation from '@/components/Navigation'
import HeroBanner from '@/components/HeroBanner'
import ProductCatalog from '@/components/ProductCatalog'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroBanner />
      <ProductCatalog allowBrowseWithoutLogin={true} />
    </div>
  )
}
