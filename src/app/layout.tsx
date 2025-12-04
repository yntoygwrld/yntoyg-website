import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '$YNTOYG | From YN to YG - The Transformation',
  description: 'The ultimate memecoin transformation. From Young N****s to Young Gentlemen. $YNTOYG on Solana.',
  keywords: ['memecoin', 'solana', 'crypto', 'yntoyg', 'quarter-zip', 'transformation'],
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
