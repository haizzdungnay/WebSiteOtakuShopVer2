'use client';

interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  sameAs = [],
  contactPoint,
}: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs,
    ...(contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: contactPoint.telephone,
        contactType: contactPoint.contactType,
        email: contactPoint.email,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string[];
  sku?: string;
  brand?: string;
  price: number;
  priceCurrency?: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
  ratingValue?: number;
  reviewCount?: number;
}

export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  brand,
  price,
  priceCurrency = 'VND',
  availability,
  url,
  ratingValue,
  reviewCount,
}: ProductJsonLdProps) {
  const availabilityMap = {
    InStock: 'https://schema.org/InStock',
    OutOfStock: 'https://schema.org/OutOfStock',
    PreOrder: 'https://schema.org/PreOrder',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku,
    brand: brand
      ? {
          '@type': 'Brand',
          name: brand,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability: availabilityMap[availability],
      url,
    },
    ...(ratingValue &&
      reviewCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue,
          reviewCount,
        },
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebSiteJsonLdProps {
  name: string;
  url: string;
  searchUrl?: string;
}

export function WebSiteJsonLd({ name, url, searchUrl }: WebSiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  items: FAQItem[];
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface LocalBusinessJsonLdProps {
  name: string;
  description?: string;
  url: string;
  telephone?: string;
  email?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  openingHours?: string[];
  priceRange?: string;
  image?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
}

export function LocalBusinessJsonLd({
  name,
  description,
  url,
  telephone,
  email,
  address,
  openingHours,
  priceRange,
  image,
  geo,
}: LocalBusinessJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name,
    description,
    url,
    telephone,
    email,
    image,
    priceRange,
    openingHoursSpecification: openingHours,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
