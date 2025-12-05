import type { Metadata } from 'next'
import { Inter, Playfair_Display, Permanent_Marker } from 'next/font/google'
import Script from 'next/script'
import CustomCursor from '@/components/CustomCursor'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const marker = Permanent_Marker({ weight: '400', subsets: ['latin'], variable: '--font-marker' })

export const metadata: Metadata = {
  title: '$YNTOYG | From YN to YG',
  description: 'The ultimate transformation. From YN to YG. $YNTOYG on Solana.',
  keywords: ['solana', 'crypto', 'yntoyg', 'quarter-zip', 'transformation', 'yg', 'gentleman'],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: '$YNTOYG | From YN to YG',
    description: 'The ultimate transformation. From YN to YG. $YNTOYG on Solana.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$YNTOYG | From YN to YG',
    description: 'The ultimate transformation. From YN to YG. $YNTOYG on Solana.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${marker.variable} font-sans`}>
        <CustomCursor />
        {children}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
