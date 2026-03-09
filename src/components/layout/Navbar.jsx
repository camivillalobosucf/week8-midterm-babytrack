import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../hooks/useProfile'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { to: '/feeding',   label: 'Feedings',  emoji: '🍼' },
  { to: '/diaper',    label: 'Diapers',   emoji: '🧷' },
  { to: '/sleep',     label: 'Sleep',     emoji: '😴' },
  { to: '/diary',     label: 'Diary',     emoji: '📓' },
  { to: '/profile',   label: 'Profile',   emoji: '👶' },
]

function Navbar() {
  const { currentUser, logout } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <>
      {/* ── Mobile top bar ── */}
      <header className="mobile-header">
        <button
          className="hamburger"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <span /><span /><span />
        </button>
        <div className="mobile-header-logo">
          <img
            src="/imgs/logo-horizontal.png"
            alt="BabyTrack"
            className="mobile-logo"
          />
        </div>
        <div className="mobile-header-spacer" />
      </header>

      {/* ── Overlay (mobile) ── */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

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

      {/* ── Sidebar ── */}
      <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <img
            src="/imgs/logo-stacked.png"
            alt="BabyTrack"
            className="sidebar-logo"
          />
          <button
            className="sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            &#x2715;
          </button>
        </div>

        {/* Baby name chip if profile set */}
        {profile?.babyName && (
          <div className="sidebar-baby-chip">
            👶 {profile.babyName}
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
          <p className="sidebar-email" title={currentUser?.email}>
            {currentUser?.email}
          </p>
          <button onClick={handleLogout} className="btn btn-outline btn-full">
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Navbar
