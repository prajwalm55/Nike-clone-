import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(
        registerForm.username,
        registerForm.email,
        registerForm.password,
        registerForm.first_name,
        registerForm.last_name,
      )
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{tab === 'login' ? 'Sign In' : 'Join Us'}</h1>
        <p className="subtitle">
          {tab === 'login'
            ? 'Enter your details to sign in to your account.'
            : 'Create your Nike Member profile and get access to the best products.'}
        </p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError('') }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError('') }}
          >
            Join Us
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                required
                minLength={6}
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                required
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={6}
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label htmlFor="reg-first">First Name</label>
                <input
                  id="reg-first"
                  type="text"
                  value={registerForm.first_name}
                  onChange={(e) => setRegisterForm({ ...registerForm, first_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-last">Last Name</label>
                <input
                  id="reg-last"
                  type="text"
                  value={registerForm.last_name}
                  onChange={(e) => setRegisterForm({ ...registerForm, last_name: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Join Us'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
