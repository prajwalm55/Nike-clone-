export interface Product {
  id: number
  name: string
  subtitle: string
  description: string
  price: string
  category: string
  gender: 'men' | 'women' | 'unisex'
  color: string
  image_url: string
  image_url_2: string
  sizes: string[]
  is_featured: boolean
  is_new: boolean
  created_at: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
  size: string
  subtotal: number
}

export interface Cart {
  id: number
  items: CartItem[]
  total_price: number
  total_items: number
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}
