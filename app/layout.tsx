import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Otaku Shop - Anime & Manga Store',
  description: 'Your one-stop shop for anime, manga, and otaku merchandise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
