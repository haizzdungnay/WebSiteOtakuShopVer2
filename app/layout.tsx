import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Otaku Shop - Cửa hàng Figure Anime',
  description: 'Cửa hàng figure anime, manga và collectibles chính hãng tại Việt Nam.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingButtons />
        </AuthProvider>
      </body>
    </html>
  );
}
