import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './DashboardPage.css'

const TRACKER_CARDS = [
  {
    label:    'Feedings',
    to:       '/feeding',
    colorVar: 'var(--color-feeding)',
    desc:     'Log breast, bottle, or solid feeds',
  },
  {
    label:    'Diapers',
    to:       '/diaper',
    colorVar: 'var(--color-diaper)',
    desc:     'Track wet and dirty diapers',
  },
  {
    label:    'Sleep',
    to:       '/sleep',
    colorVar: 'var(--color-sleep)',
    desc:     'Record naps and overnight sleep',
  },
]

function DashboardPage() {
  const { currentUser } = useAuth()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  })

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Good day!</h1>
        <p className="page-subtitle">{today}</p>
        <p className="dashboard-user">Logged in as <strong>{currentUser?.email}</strong></p>
      </div>

      <h2 className="section-title">Trackers</h2>
      <div className="tracker-grid">
        {TRACKER_CARDS.map(({ label, to, colorVar, desc }) => (
          <Link
            key={to}
            to={to}
            className="tracker-card"
            style={{ backgroundColor: colorVar }}
          >
            <span className="tracker-card-label">{label}</span>
            <span className="tracker-card-desc">{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
