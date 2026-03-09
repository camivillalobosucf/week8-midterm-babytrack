import './TrackerPage.css'

function FeedingPage() {
  return (
    <div className="tracker-page">
      <div className="tracker-page-banner" style={{ backgroundColor: 'var(--color-feeding)' }}>
        <h1 className="page-title">Feedings</h1>
        <p className="page-subtitle">Track breast, bottle, and solid feeds</p>
      </div>
      <p className="tracker-page-placeholder">Feeding tracker coming in Phase 4.</p>
    </div>
  )
}

export default FeedingPage
