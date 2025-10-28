import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'JH Figure Store - Chuyên Figure, Mô hình Anime chính hãng',
  description:
    'Cửa hàng figure anime, manga và collectibles chính hãng tại Việt Nam. PVC Figure, Scale Figure, Nendoroid, Gundam và nhiều hơn nữa.',
  keywords:
    'figure, anime figure, manga, nendoroid, scale figure, PVC figure, gundam, mô hình anime',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
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
