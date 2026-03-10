import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

function SummaryCard({ label, to, color, primary, secondary, lastTime }) {
  const { t } = useLanguage()

  return (
    <Link to={to} className="summary-card" style={{ backgroundColor: color }}>
      <div className="summary-card-top">
        <span className="summary-card-label">{label}</span>
        <span className="summary-card-arrow">&rarr;</span>
      </div>
      <div className="summary-card-primary">{primary}</div>
      {secondary && <div className="summary-card-secondary">{secondary}</div>}
      <div className="summary-card-time">
        {lastTime ? `${t('dash.last')} ${lastTime}` : t('dash.noEntries')}
      </div>
    </Link>
  )
}

export default SummaryCard
