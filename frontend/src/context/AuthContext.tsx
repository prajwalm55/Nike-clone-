import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api/client'
import type { User, MemberProfile } from '../types'

const USER_STORAGE_KEY = 'nike_user'
const MEMBER_STORAGE_KEY = 'nike_member'

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function loadStoredMember(): MemberProfile | null {
  try {
    const raw = localStorage.getItem(MEMBER_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as MemberProfile) : null
  } catch {
    return null
  }
}

function persistSession(user: User | null, member: MemberProfile | null) {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_STORAGE_KEY)
  }
  if (member) {
    localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(member))
  } else {
    localStorage.removeItem(MEMBER_STORAGE_KEY)
  }
}

function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem(MEMBER_STORAGE_KEY)
}

interface AuthContextType {
  user: User | null
  member: MemberProfile | null
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
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStoredUser)
  const [member, setMember] = useState<MemberProfile | null>(loadStoredMember)
  const [loading, setLoading] = useState(true)

  const applySession = useCallback((nextUser: User | null, nextMember: MemberProfile | null) => {
    setUser(nextUser)
    setMember(nextMember)
    persistSession(nextUser, nextMember)
  }, [])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      applySession(null, null)
      return
    }
    const data = await api.getMe()
    const { member: profile, ...userData } = data
    applySession(userData as User, profile ?? null)
  }, [applySession])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      applySession(null, null)
      setLoading(false)
      return
    }
    refreshUser()
      .catch(() => {
        clearSession()
        applySession(null, null)
      })
      .finally(() => setLoading(false))
  }, [applySession, refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login({ email, password })
    localStorage.setItem('token', res.token)
    applySession(res.user, res.member ?? null)
  }, [applySession])

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
      applySession(res.user, res.member ?? null)
    },
    [applySession],
  )

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // token may already be invalid
    }
    clearSession()
    applySession(null, null)
  }, [applySession])

  return (
    <AuthContext.Provider value={{ user, member, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
