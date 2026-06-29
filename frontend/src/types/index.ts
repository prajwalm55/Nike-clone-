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
  average_rating?: number
  review_count?: number
  live_viewers?: number
  trending_score?: number
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  member?: MemberProfile
}

export interface MemberProfile {
  points: number
  tier: 'member' | 'gold' | 'platinum'
  shoes_owned: number
  next_tier_points: number
}

export interface Review {
  id: number
  product: number
  username: string
  rating: number
  comment: string
  created_at: string
}

export interface WishlistItem {
  id: number
  product: Product
  created_at: string
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
  member?: MemberProfile
}

export interface ShoeFinderResult {
  matches: Product[]
  match_reasons: Record<number, string>
}

export interface SizeAdvice {
  recommended_size: string
  confidence: number
  fit_note: string
  available_sizes: string[]
}

export interface ShoeFinderPrefs {
  activity: 'running' | 'training' | 'lifestyle' | 'racing'
  surface: 'road' | 'trail' | 'gym' | 'court'
  gender: 'men' | 'women' | 'unisex'
  experience: 'beginner' | 'intermediate' | 'advanced'
  budget: 'under150' | '150to200' | 'over200'
}
