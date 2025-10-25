export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  discountPrice?: number
  image: string
  images?: string[]
  category: string
  stock: number
  badge?: {
    text: string
    type: 'sale' | 'hot' | 'preorder' | 'new'
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
}
