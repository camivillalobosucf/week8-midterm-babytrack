import { getDiaperAnalytics } from '../../utils/diaperAnalytics'

function DiaperAnalytics({ entries }) {
  const s = getDiaperAnalytics(entries)

  const cards = [
    {
      label: 'Diapers today',
      value: s.diapersToday,
      sub:   'total changes',
    },
    {
      label: 'Wet / Dirty',
      value: s.wetCount + s.dirtyCount > 0
        ? `${s.wetPct}% / ${s.dirtyPct}%`
        : '—',
      sub: 'today',
    },
    {
      label: 'Wet today',
      value: s.wetCount,
      sub:   'includes "both"',
    },
    {
      label: 'Weekly avg',
      value: s.weeklyAvg,
      sub:   'diapers / day',
    },
  ]

  return (
    <div className="analytics-grid">
      {cards.map((c) => (
        <div
          key={c.label}
          className="analytics-card"
          style={{ backgroundColor: 'var(--color-diaper)' }}
        >
          <div className="analytics-label">{c.label}</div>
          <div className="analytics-value">{c.value}</div>
          <div className="analytics-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

export default DiaperAnalytics
