import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api/client'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api
        .getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login({ email, password })
    localStorage.setItem('token', res.token)
    setUser(res.user)
  }, [])

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string,
      firstName = '',
      lastName = '',
    ) => {
      const res = await api.register({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      })
      localStorage.setItem('token', res.token)
      setUser(res.user)
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // token may already be invalid
    }
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
