import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://otakushop.vn';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Otaku Shop - Cửa hàng Figure Anime Chính Hãng',
    template: '%s | Otaku Shop',
  },
  description: 'Cửa hàng figure anime, manga và collectibles chính hãng tại Việt Nam. Nendoroid, Scale Figure, Figma với giá tốt nhất.',
  keywords: [
    'figure anime',
    'mô hình anime',
    'nendoroid',
    'scale figure',
    'figma',
    'otaku shop',
    'figure chính hãng',
    'anime figure vietnam',
    'mua figure anime',
  ],
  authors: [{ name: 'Otaku Shop' }],
  creator: 'Otaku Shop',
  publisher: 'Otaku Shop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: BASE_URL,
    siteName: 'Otaku Shop',
    title: 'Otaku Shop - Cửa hàng Figure Anime Chính Hãng',
    description: 'Cửa hàng figure anime, manga và collectibles chính hãng tại Việt Nam.',
    images: [
      {
        url: `${BASE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Otaku Shop - Figure Anime Chính Hãng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Otaku Shop - Cửa hàng Figure Anime Chính Hãng',
    description: 'Cửa hàng figure anime, manga và collectibles chính hãng tại Việt Nam.',
    images: [`${BASE_URL}/images/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '2uSnitV-aG-ECPMH2MKOmruZFK14_9HoMAZICJ0fNH4',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.png" sizes="32x32" />
        <link rel="icon" href="/favicon.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <FloatingButtons />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
