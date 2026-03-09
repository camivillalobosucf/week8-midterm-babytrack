import { getFeedingAnalytics } from '../../utils/feedingAnalytics'
import { formatDuration } from '../../utils/formatters'

function FeedingAnalytics({ entries }) {
  const s = getFeedingAnalytics(entries)

  const cards = [
    {
      label: 'Feeds today',
      value: s.todayCount,
      sub:   'total sessions',
    },
    {
      label: 'Milk today',
      value: s.totalMlToday > 0 ? `${s.totalMlToday} ml` : '—',
      sub:   'bottle feeds',
    },
    {
      label: 'Avg interval',
      value: s.avgIntervalMin != null ? formatDuration(s.avgIntervalMin) : '—',
      sub:   'between feeds',
    },
    {
      label: 'Bottle / Breast',
      value: s.bottleCount + s.breastCount > 0
        ? `${s.bottlePct}% / ${s.breastPct}%`
        : '—',
      sub: 'today',
    },
  ]

  return (
    <div className="analytics-grid">
      {cards.map((c) => (
        <div
          key={c.label}
          className="analytics-card"
          style={{ backgroundColor: 'var(--color-feeding)' }}
        >
          <div className="analytics-label">{c.label}</div>
          <div className="analytics-value">{c.value}</div>
          <div className="analytics-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

export default FeedingAnalytics
