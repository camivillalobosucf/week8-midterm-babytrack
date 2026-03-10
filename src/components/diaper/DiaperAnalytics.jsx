import { useLanguage } from '../../context/LanguageContext'
import { getDiaperAnalytics } from '../../utils/diaperAnalytics'

function DiaperAnalytics({ entries }) {
  const { t } = useLanguage()
  const s = getDiaperAnalytics(entries)

  const cards = [
    { label: t('ana.diapersToday'),  value: s.diapersToday,                                                       sub: t('ana.totalChanges')  },
    { label: t('ana.wetDirtyRatio'), value: s.wetCount + s.dirtyCount > 0 ? `${s.wetPct}% / ${s.dirtyPct}%` : '—', sub: t('ana.today')         },
    { label: t('ana.wetToday'),      value: s.wetCount,                                                            sub: t('ana.includesBoth')  },
    { label: t('ana.weeklyAvg'),     value: s.weeklyAvg,                                                           sub: t('ana.diapersPerDay') },
  ]

  return (
    <div className="analytics-grid">
      {cards.map((c) => (
        <div key={c.label} className="analytics-card" style={{ backgroundColor: 'var(--color-diaper)' }}>
          <div className="analytics-label">{c.label}</div>
          <div className="analytics-value">{c.value}</div>
          <div className="analytics-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

export default DiaperAnalytics
