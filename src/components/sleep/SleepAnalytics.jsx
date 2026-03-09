import { getSleepAnalytics } from '../../utils/sleepAnalytics'
import { formatDuration } from '../../utils/formatters'

function SleepAnalytics({ entries }) {
  const s = getSleepAnalytics(entries)

  const cards = [
    {
      label: 'Total sleep today',
      value: s.totalSleepMin > 0 ? formatDuration(s.totalSleepMin) : '—',
      sub:   `${s.sessionCount} session${s.sessionCount !== 1 ? 's' : ''}`,
    },
    {
      label: 'Avg nap length',
      value: s.avgNapMin > 0 ? formatDuration(s.avgNapMin) : '—',
      sub:   'today',
    },
    {
      label: 'Longest session',
      value: s.longestMin > 0 ? formatDuration(s.longestMin) : '—',
      sub:   'all time',
    },
  ]

  return (
    <div className="analytics-grid">
      {cards.map((c) => (
        <div
          key={c.label}
          className="analytics-card"
          style={{ backgroundColor: 'var(--color-sleep)' }}
        >
          <div className="analytics-label">{c.label}</div>
          <div className="analytics-value">{c.value}</div>
          <div className="analytics-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

export default SleepAnalytics
