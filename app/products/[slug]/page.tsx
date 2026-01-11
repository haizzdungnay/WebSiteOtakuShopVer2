import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://otakushop.vn';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      select: {
        name: true,
        shortDescription: true,
        description: true,
        price: true,
        comparePrice: true,
        images: true,
        category: {
          select: { name: true }
        },
        brand: {
          select: { name: true }
        }
      }
    });

    if (!product) {
      return {
        title: 'Không tìm thấy sản phẩm | Otaku Shop',
        description: 'Sản phẩm không tồn tại hoặc đã bị xóa.',
      };
    }

    const title = `${product.name} | Otaku Shop`;
    const description = product.shortDescription 
      || product.description?.substring(0, 160) 
      || `Mua ${product.name} chính hãng tại Otaku Shop với giá tốt nhất.`;
    
    const price = Number(product.price);
    const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
    const discount = comparePrice 
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

    const image = product.images?.[0] || `${BASE_URL}/images/placeholder.jpg`;

    return {
      title,
      description,
      keywords: [
        product.name,
        product.category?.name || 'Figure',
        product.brand?.name || 'Anime',
        'Figure anime',
        'Mô hình',
        'Otaku Shop',
        'Figure chính hãng',
      ].filter(Boolean).join(', '),
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${BASE_URL}/products/${slug}`,
        siteName: 'Otaku Shop',
        images: [
          {
            url: image,
            width: 800,
            height: 800,
            alt: product.name,
          }
        ],
        locale: 'vi_VN',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `${BASE_URL}/products/${slug}`,
      },
      other: {
        'product:price:amount': price.toString(),
        'product:price:currency': 'VND',
        ...(discount > 0 && { 'product:sale_price:amount': price.toString() }),
        ...(comparePrice && { 'product:original_price:amount': comparePrice.toString() }),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Sản phẩm | Otaku Shop',
      description: 'Khám phá các sản phẩm Figure Anime chính hãng tại Otaku Shop.',
    };
  }
}

// Generate static params for popular products (optional - for static generation)
export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, featured: true },
      select: { slug: true },
      take: 50,
    });

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
