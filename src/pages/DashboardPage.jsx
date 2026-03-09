import { useAuth } from '../context/AuthContext'

function DashboardPage() {
  const { currentUser } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
        Logged in as <strong>{currentUser?.email}</strong>
      </p>
      <p style={{ marginTop: '1rem' }}>
        Feeding, diaper, and sleep trackers are coming in Phase 3 and 4.
      </p>
    </div>
  )
}

export default DashboardPage
