import { useLanguage } from '../../context/LanguageContext'
import { getSleepAnalytics } from '../../utils/sleepAnalytics'
import { formatDuration } from '../../utils/formatters'

function SleepAnalytics({ entries }) {
  const { t } = useLanguage()
  const s = getSleepAnalytics(entries)

  const cards = [
    { label: t('ana.totalSleepToday'), value: s.totalSleepMin > 0 ? formatDuration(s.totalSleepMin) : '—', sub: `${s.sessionCount} ${s.sessionCount !== 1 ? t('dash.sessions_plural') : t('dash.sessions')}` },
    { label: t('ana.avgNap'),          value: s.avgNapMin > 0 ? formatDuration(s.avgNapMin) : '—',         sub: t('ana.today')   },
    { label: t('ana.longestSession'),  value: s.longestMin > 0 ? formatDuration(s.longestMin) : '—',       sub: t('ana.allTime') },
  ]

  return (
    <div className="analytics-grid">
      {cards.map((c) => (
        <div key={c.label} className="analytics-card" style={{ backgroundColor: 'var(--color-sleep)' }}>
          <div className="analytics-label">{c.label}</div>
          <div className="analytics-value">{c.value}</div>
          <div className="analytics-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

export default SleepAnalytics
