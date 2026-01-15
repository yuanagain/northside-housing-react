import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anchormatch Explorer',
  description: 'Professional housing proximity analysis for healthcare workers. Interactive maps with commute times, amenities, and property insights.',
  keywords: 'healthcare housing, medical professionals, proximity analysis, hospital commuting, apartments',
  openGraph: {
    title: 'Anchormatch Explorer',
    description: 'Professional housing proximity analysis for healthcare workers.',
    type: 'website',
    url: 'https://app.anchormatch.com',
  },
  twitter: {
    card: 'summary',
    title: 'Anchormatch Explorer',
    description: 'Professional housing proximity analysis for healthcare workers.',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { url: '/favicon.ico', sizes: '256x256', type: 'image/x-icon' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <script
            async
            defer
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`}
          />
        )}
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}