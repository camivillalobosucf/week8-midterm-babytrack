import './TrackerPage.css'

function SleepPage() {
  return (
    <div className="tracker-page">
      <div className="tracker-page-banner" style={{ backgroundColor: 'var(--color-sleep)' }}>
        <h1 className="page-title">Sleep</h1>
        <p className="page-subtitle">Record naps and overnight sleep sessions</p>
      </div>
      <p className="tracker-page-placeholder">Sleep tracker coming in Phase 4.</p>
    </div>
  )
}

export default SleepPage
