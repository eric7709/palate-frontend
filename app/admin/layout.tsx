import type { Metadata, Viewport } from 'next'
import ProtectAdmin from '../../src/shared/provider/ProtectAdmin'
import Sidebar from '@/components/Sidebar'
import { TopNav } from '@/components/TopNav'

export const metadata: Metadata = {
  title: {
    default: 'The Safron Hotel Lagos – Restaurant & Room Management',
    template: '%s | The Safron Hotel',
  },
  description:
    'Streamline your hotel and restaurant operations – orders, menu, tables, rooms, and real-time updates, all in one place.',
  keywords: [
    'hotel',
    'restaurant',
    'POS',
    'order management',
    'menu',
    'dining',
    'room management',
    'The Safron Hotel',
  ],
  authors: [{ name: 'The Safron Team' }],
  openGraph: {
    title: 'The Safron Hotel – Modern Hotel & Restaurant Management',
    description:
      'Efficient order tracking, real-time kitchen updates, room service, and seamless dining experience.',
    type: 'website',
    locale: 'en_US',
    siteName: 'The Safron Hotel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Safron Hotel – Hotel & Restaurant Management',
    description: 'Streamline your hotel operations with The Safron Hotel management system.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1a1c21',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectAdmin>
      <div className="grid grid-cols-[auto_1fr] h-full min-w-250">
        <Sidebar />
        <div className="flex flex-col h-full bg-white overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectAdmin>
  )
}