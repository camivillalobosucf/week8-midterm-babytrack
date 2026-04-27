import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../hooks/useProfile'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../context/LanguageContext'
import './Navbar.css'

function Navbar() {
  const { currentUser, logout } = useAuth()
  const { profile } = useProfile()
  const { isDark, toggle } = useTheme()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const NAV_LINKS = [
    { to: '/dashboard', label: t('nav.dashboard'), emoji: '🏠' },
    { to: '/entries',   label: t('nav.entries'),   emoji: '📋' },
    { to: '/diary',     label: t('nav.diary'),     emoji: '📓' },
    { to: '/profile',   label: t('nav.profile'),   emoji: '👶' },
  ]

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <>
      {/* ── Mobile top bar ── */}
      <header className="mobile-header">
        <div className="mobile-header-side" />
        <img
          src="/imgs/logo-horizontal.svg"
          alt="BabyTrack"
          className="mobile-logo"
        />
        <button
          className="mobile-theme-btn"
          onClick={toggle}
          aria-label="Toggle dark mode"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="mobile-bottom-nav">
        {NAV_LINKS.map(({ to, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              'bottom-nav-item' + (isActive ? ' bottom-nav-item-active' : '')
            }
          >
            <span className="bottom-nav-emoji">{emoji}</span>
            <span className="bottom-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Overlay (mobile) ── */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <img
            src="/imgs/logo-stacked.svg"
            alt="BabyTrack"
            className="sidebar-logo"
          />
          <div className="sidebar-top-actions">
            <button
              className="sidebar-theme-btn"
              onClick={toggle}
              aria-label="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              className="sidebar-close"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              &#x2715;
            </button>
          </div>
        </div>

        {profile?.babyName && (
          <div className="sidebar-baby-chip">
            {profile.emojiLeft || '👶'} {profile.babyName} {profile.emojiRight || '⭐'}
          </div>
        )}

        <nav className="sidebar-nav">
          {NAV_LINKS.map(({ to, label, emoji }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                'nav-item' + (isActive ? ' nav-item-active' : '')
              }
            >
              <span className="nav-emoji">{emoji}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-row">
            <div className="sidebar-avatar">
              {currentUser?.email?.[0]?.toUpperCase()}
            </div>
            <button onClick={handleLogout} className="btn btn-outline sidebar-logout-btn">
              {t('profile.logout')}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Navbar
