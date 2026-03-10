import { useLanguage } from '../../context/LanguageContext'
import { getFeedingAnalytics } from '../../utils/feedingAnalytics'
import { formatDuration } from '../../utils/formatters'

function FeedingAnalytics({ entries }) {
  const { t } = useLanguage()
  const s = getFeedingAnalytics(entries)

  const cards = [
    { label: t('ana.feedsToday'),   value: s.todayCount,                                             sub: t('ana.totalSessions') },
    { label: t('ana.milkToday'),    value: s.totalMlToday > 0 ? `${s.totalMlToday} ml` : '—',       sub: t('ana.bottleFeeds')   },
    { label: t('ana.avgInterval'),  value: s.avgIntervalMin != null ? formatDuration(s.avgIntervalMin) : '—', sub: t('ana.betweenFeeds') },
    { label: t('ana.bottleBreast'), value: s.bottleCount + s.breastCount > 0 ? `${s.bottlePct}% / ${s.breastPct}%` : '—', sub: t('ana.today') },
  ]

  return (
    <div className="analytics-grid">
      {cards.map((c) => (
        <div key={c.label} className="analytics-card" style={{ backgroundColor: 'var(--color-feeding)' }}>
          <div className="analytics-label">{c.label}</div>
          <div className="analytics-value">{c.value}</div>
          <div className="analytics-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

export default FeedingAnalytics
