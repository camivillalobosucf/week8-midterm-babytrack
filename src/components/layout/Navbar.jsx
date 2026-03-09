import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', dot: null          },
  { to: '/feeding',   label: 'Feedings',  dot: 'dot-feeding' },
  { to: '/diaper',    label: 'Diapers',   dot: 'dot-diaper'  },
  { to: '/sleep',     label: 'Sleep',     dot: 'dot-sleep'   },
  { to: '/diary',     label: 'Diary',     dot: 'dot-diary'   },
]

function Navbar() {
  const { currentUser, logout } = useAuth()
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
        <img
          src="/imgs/logo-horizontal.png"
          alt="BabyTrack"
          className="mobile-logo"
        />
      </header>

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

        <nav className="sidebar-nav">
          {NAV_LINKS.map(({ to, label, dot }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                'nav-item' + (isActive ? ' nav-item-active' : '')
              }
            >
              {dot && <span className={`nav-dot ${dot}`} />}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-email" title={currentUser?.email}>
            {currentUser?.email}
          </p>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-full"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Navbar
