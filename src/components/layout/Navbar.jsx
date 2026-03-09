import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">BabyTrack</Link>
      <div className="navbar-actions">
        {currentUser ? (
          <>
            <span className="navbar-email">{currentUser.email}</span>
            <button onClick={handleLogout} className="btn btn-outline">Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Log in</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
