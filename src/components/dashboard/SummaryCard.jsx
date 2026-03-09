import { Link } from 'react-router-dom'

function SummaryCard({ label, to, color, primary, secondary, lastTime }) {
  return (
    <Link to={to} className="summary-card" style={{ backgroundColor: color }}>
      <div className="summary-card-top">
        <span className="summary-card-label">{label}</span>
        <span className="summary-card-arrow">&rarr;</span>
      </div>
      <div className="summary-card-primary">{primary}</div>
      {secondary && <div className="summary-card-secondary">{secondary}</div>}
      <div className="summary-card-time">
        {lastTime ? `Last: ${lastTime}` : 'No entries yet'}
      </div>
    </Link>
  )
}

export default SummaryCard
