import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../hooks/useTheme'
import { saveProfile } from '../../services/profileService'
import './AuthForm.css'

function RegisterForm() {
  const { register } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  function getErrorMessage(code) {
    switch (code) {
      case 'auth/email-already-in-use': return t('auth.err.email-in-use')
      case 'auth/invalid-email':        return t('auth.err.invalid-email')
      case 'auth/weak-password':        return t('auth.err.weak-password')
      default: return t('auth.err.default-register')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) return setError(t('auth.err.passwords-no-match'))
    setError('')
    setLoading(true)
    try {
      const cred = await register(email, password)
      // Save chosen language to Firestore immediately
      if (language !== 'en') {
        await saveProfile(cred.user.uid, { language })
      }
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

      <h2 className="auth-title">{t('auth.createAccount')}</h2>
      <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>

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
            required placeholder={t('auth.passwordPlaceholder')} autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm">{t('auth.confirmPassword')}</label>
          <input
            id="confirm" type="password" value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required placeholder="••••••••" autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? t('auth.creatingAccount') : t('auth.registerBtn')}
        </button>
      </form>

      <p className="auth-link">
        {t('auth.hasAccount')} <Link to="/login">{t('auth.logIn')}</Link>
      </p>
    </div>
  )
}

export default RegisterForm
