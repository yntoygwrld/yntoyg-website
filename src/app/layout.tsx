import type { Metadata } from 'next'
import { Inter, Playfair_Display, Permanent_Marker } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const marker = Permanent_Marker({ weight: '400', subsets: ['latin'], variable: '--font-marker' })

export const metadata: Metadata = {
  title: '$YNTOYG | From YN to YG',
  description: 'The ultimate memecoin transformation. From Young N****s to Young Gentlemen. $YNTOYG on Solana.',
  keywords: ['memecoin', 'solana', 'crypto', 'yntoyg', 'quarter-zip', 'transformation'],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: '$YNTOYG | From YN to YG',
    description: 'The ultimate memecoin transformation. $YNTOYG on Solana.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$YNTOYG | From YN to YG',
    description: 'The ultimate memecoin transformation. $YNTOYG on Solana.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${marker.variable} font-sans`}>{children}</body>
    </html>
  )
}
