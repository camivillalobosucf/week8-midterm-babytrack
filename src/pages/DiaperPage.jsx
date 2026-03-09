import './TrackerPage.css'

function DiaperPage() {
  return (
    <div className="tracker-page">
      <div className="tracker-page-banner" style={{ backgroundColor: 'var(--color-diaper)' }}>
        <h1 className="page-title">Diapers</h1>
        <p className="page-subtitle">Log wet and dirty diaper changes</p>
      </div>
      <p className="tracker-page-placeholder">Diaper tracker coming in Phase 4.</p>
    </div>
  )
}

export default DiaperPage
