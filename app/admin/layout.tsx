import type { Metadata, Viewport } from 'next'
import ProtectAdmin from '../../src/shared/provider/ProtectAdmin'
import Sidebar from '@/components/Sidebar'
import { TopNav } from '@/components/TopNav'

export const metadata: Metadata = {
  title: {
    default: 'Palate – Modern Restaurant & Hotel Management System',
    template: '%s | Palate',
  },
  description:
    'Streamline your restaurant and hotel operations – orders, menu, tables, rooms, and real-time updates, all in one place.',
  keywords: [
    'restaurant',
    'hotel',
    'POS',
    'order management',
    'menu management',
    'dining',
    'room management',
    'hospitality',
    'Palate',
  ],
  authors: [{ name: 'Palate Team' }],
  openGraph: {
    title: 'Palate – Modern Restaurant & Hotel Management System',
    description:
      'Efficient order tracking, real-time kitchen updates, room service, and seamless dining experience.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Palate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palate – Restaurant & Hotel Management System',
    description: 'Streamline your hospitality operations with Palate management system.',
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
  themeColor: '#2563EB', // ← blue accent to match your logo
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