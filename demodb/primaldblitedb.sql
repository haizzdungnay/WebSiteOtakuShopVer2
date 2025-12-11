-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public._prisma_migrations (
  id character varying NOT NULL,
  checksum character varying NOT NULL,
  finished_at timestamp with time zone,
  migration_name character varying NOT NULL,
  logs text,
  rolled_back_at timestamp with time zone,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  applied_steps_count integer NOT NULL DEFAULT 0,
  CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.addresses (
  id text NOT NULL,
  userId text NOT NULL,
  label text NOT NULL DEFAULT 'Home'::text,
  fullName text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  ward text,
  district text NOT NULL,
  city text NOT NULL,
  isDefault boolean NOT NULL DEFAULT false,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_userId_fkey FOREIGN KEY (userId) REFERENCES public.users(id)
);
CREATE TABLE public.admins (
  id text NOT NULL,
  username text NOT NULL,
  passwordHash text NOT NULL,
  fullName text NOT NULL,
  email text NOT NULL,
  isActive boolean NOT NULL DEFAULT true,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cart_items (
  id text NOT NULL,
  userId text NOT NULL,
  productId text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  addedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_userId_fkey FOREIGN KEY (userId) REFERENCES public.users(id),
  CONSTRAINT cart_items_productId_fkey FOREIGN KEY (productId) REFERENCES public.products(id)
);
CREATE TABLE public.categories (
  id text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  imageUrl text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.coupons (
  id text NOT NULL,
  code text NOT NULL,
  type USER-DEFINED NOT NULL,
  value numeric NOT NULL,
  minOrder numeric,
  maxDiscount numeric,
  validFrom timestamp without time zone NOT NULL,
  validTo timestamp without time zone NOT NULL,
  usageLimit integer,
  usedCount integer NOT NULL DEFAULT 0,
  isActive boolean NOT NULL DEFAULT true,
  description text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order_items (
  id text NOT NULL,
  orderId text NOT NULL,
  productId text NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.orders(id),
  CONSTRAINT order_items_productId_fkey FOREIGN KEY (productId) REFERENCES public.products(id)
);
CREATE TABLE public.orders (
  id text NOT NULL,
  orderNumber text NOT NULL,
  userId text,
  customerName text NOT NULL,
  customerEmail text,
  customerPhone text NOT NULL,
  shippingFullName text NOT NULL,
  shippingPhone text NOT NULL,
  shippingAddress text NOT NULL,
  shippingWard text,
  shippingDistrict text NOT NULL,
  shippingCity text NOT NULL,
  totalAmount numeric NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::"OrderStatus",
  note text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  addressId text,
  couponId text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_userId_fkey FOREIGN KEY (userId) REFERENCES public.users(id),
  CONSTRAINT orders_addressId_fkey FOREIGN KEY (addressId) REFERENCES public.addresses(id),
  CONSTRAINT orders_couponId_fkey FOREIGN KEY (couponId) REFERENCES public.coupons(id)
);
CREATE TABLE public.payments (
  id text NOT NULL,
  orderId text NOT NULL,
  amount numeric NOT NULL,
  method USER-DEFINED NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::"PaymentStatus",
  transactionId text,
  metadata jsonb,
  paidAt timestamp without time zone,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.orders(id)
);
CREATE TABLE public.products (
  id text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  comparePrice numeric,
  stockQuantity integer NOT NULL DEFAULT 0,
  images ARRAY,
  isActive boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  categoryId text NOT NULL,
  reviewCount integer NOT NULL DEFAULT 0,
  averageRating numeric NOT NULL DEFAULT 0,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_categoryId_fkey FOREIGN KEY (categoryId) REFERENCES public.categories(id)
);
CREATE TABLE public.review_votes (
  id text NOT NULL,
  reviewId text NOT NULL,
  userId text NOT NULL,
  isHelpful boolean NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT review_votes_pkey PRIMARY KEY (id),
  CONSTRAINT review_votes_reviewId_fkey FOREIGN KEY (reviewId) REFERENCES public.reviews(id),
  CONSTRAINT review_votes_userId_fkey FOREIGN KEY (userId) REFERENCES public.users(id)
);
CREATE TABLE public.reviews (
  id text NOT NULL,
  productId text NOT NULL,
  userId text NOT NULL,
  orderId text,
rating integer NOT NULL,
  title text,
  comment text,
  images ARRAY,
  isVerified boolean NOT NULL DEFAULT false,
  isApproved boolean NOT NULL DEFAULT true,
  isPinned boolean NOT NULL DEFAULT false,
  helpfulCount integer NOT NULL DEFAULT 0,
  unhelpfulCount integer NOT NULL DEFAULT 0,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_productId_fkey FOREIGN KEY (productId) REFERENCES public.products(id),
  CONSTRAINT reviews_userId_fkey FOREIGN KEY (userId) REFERENCES public.users(id),
  CONSTRAINT reviews_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.orders(id)
);
CREATE TABLE public.shippings (
  id text NOT NULL,
  orderId text NOT NULL,
  carrier text NOT NULL,
  trackingCode text,
  fee numeric NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PREPARING'::"ShippingStatus",
  estimatedDate timestamp without time zone,
  shippedAt timestamp without time zone,
  deliveredAt timestamp without time zone,
  notes text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT shippings_pkey PRIMARY KEY (id),
  CONSTRAINT shippings_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.orders(id)
);
CREATE TABLE public.users (
  id text NOT NULL,
  email text NOT NULL,
  passwordHash text NOT NULL,
  fullName text NOT NULL,
  phone text,
  gender USER-DEFINED DEFAULT 'OTHER'::"Gender",
  dateOfBirth timestamp without time zone,
  avatar text,
  role USER-DEFINED NOT NULL DEFAULT 'CUSTOMER'::"Role",
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.wishlists (
  id text NOT NULL,
  userId text NOT NULL,
  productId text NOT NULL,
  addedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT wishlists_pkey PRIMARY KEY (id),
  CONSTRAINT wishlists_userId_fkey FOREIGN KEY (userId) REFERENCES public.users(id),
  CONSTRAINT wishlists_productId_fkey FOREIGN KEY (productId) REFERENCES public.products(id)
);