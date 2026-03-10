import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../hooks/useTheme'
import './AuthForm.css'

function LoginForm() {
  const { login } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  function getErrorMessage(code) {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password': return t('auth.err.invalid-credential')
      case 'auth/invalid-email':  return t('auth.err.invalid-email')
      case 'auth/too-many-requests': return t('auth.err.too-many-requests')
      default: return t('auth.err.default-login')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <img src="/imgs/logo-stacked.svg" alt="BabyTrack" className="auth-logo" />

      <div className="auth-lang-row">
        <button
          type="button"
          className="auth-theme-btn"
          onClick={toggle}
          aria-label="Toggle dark mode"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <button
          type="button"
          className={'auth-lang-btn' + (language === 'en' ? ' auth-lang-active' : '')}
          onClick={() => setLanguage('en')}
        >English</button>
        <button
          type="button"
          className={'auth-lang-btn' + (language === 'es' ? ' auth-lang-active' : '')}
          onClick={() => setLanguage('es')}
        >Español</button>
      </div>

      <h2 className="auth-title">{t('auth.welcomeBack')}</h2>
      <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">{t('auth.email')}</label>
          <input
            id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required placeholder="you@example.com" autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t('auth.password')}</label>
          <input
            id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required placeholder="••••••••" autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? t('auth.loggingIn') : t('auth.loginBtn')}
        </button>
      </form>

      <p className="auth-link">
        {t('auth.noAccount')} <Link to="/register">{t('auth.signUp')}</Link>
      </p>
    </div>
  )
}

export default LoginForm
