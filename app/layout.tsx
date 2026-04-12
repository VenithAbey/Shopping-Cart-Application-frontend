import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Footer from '@/components/Footer'
import { Providers } from '@/components/Providers'
import WishlistDrawer from '@/components/WishlistDrawer'
import WaysToShopModal from '@/components/WaysToShopModal'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ShopCart - Online Shopping',
  description: 'Browse and purchase fresh products online. Shopping cart application with categories, search, and secure checkout.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Providers>
          <main className="flex-grow">
            {children}
            <WishlistDrawer />
            <WaysToShopModal />
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
