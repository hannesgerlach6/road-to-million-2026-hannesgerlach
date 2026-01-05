import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Road to Million 2026 | Life OS',
  description: 'Dein persönliches Operating System für Erfolg, Gesundheit und Deen',
  manifest: '/manifest.json',
  themeColor: '#0f172a',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
