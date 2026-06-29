import type { AuthResponse, Cart, Product, User } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function parseApiError(err: Record<string, unknown>): string {
  if (typeof err.detail === 'string') return err.detail
  if (Array.isArray(err.detail)) return err.detail.map(String).join(', ')
  const fieldErrors = Object.values(err)
    .flatMap((v) => (Array.isArray(v) ? v.map(String) : typeof v === 'string' ? [v] : []))
  if (fieldErrors.length) return fieldErrors.join(', ')
  return 'Request failed'
}

function getToken(): string | null {
  return localStorage.getItem('token')
}

function getSessionKey(): string {
  let key = localStorage.getItem('session_key')
  if (!key) {
    key = crypto.randomUUID()
    localStorage.setItem('session_key', key)
  }
  return key
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Token ${token}`
  } else {
    headers['X-Session-Key'] = getSessionKey()
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(parseApiError(err))
  }

  if (res.status === 204) return {} as T
  return res.json()
}

export const api = {
  getProducts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<Product[]>(`/products/${qs}`)
  },

  getProduct: (id: number) => request<Product>(`/products/${id}/`),

  register: (data: {
    username: string
    email: string
    password: string
    first_name?: string
    last_name?: string
  }) =>
    request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { username?: string; email?: string; password: string }) =>
    request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<{ detail: string }>('/auth/logout/', { method: 'POST' }),

  getMe: () => request<User>('/auth/me/'),

  getCart: () => request<Cart>('/cart/'),

  addToCart: (productId: number, size: string, quantity = 1) =>
    request<Cart>('/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, size, quantity }),
    }),

  updateCartItem: (itemId: number, data: { quantity?: number; size?: string }) =>
    request<Cart>(`/cart/items/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  removeCartItem: (itemId: number) =>
    request<Cart>(`/cart/items/${itemId}/`, { method: 'DELETE' }),

  clearCart: () => request<Cart>('/cart/clear/', { method: 'DELETE' }),
}
