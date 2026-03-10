import { useLanguage } from '../../context/LanguageContext'
import { toDate, formatTimeAgo, formatDuration } from '../../utils/formatters'

function RecentActivity({ feedings, diapers, sleeps, diary }) {
  const { t } = useLanguage()

  const TRACKER = {
    feeding: { color: 'var(--color-feeding)', label: t('recent.feeding') },
    diaper:  { color: 'var(--color-diaper)',  label: t('recent.diaper')  },
    sleep:   { color: 'var(--color-sleep)',   label: t('recent.sleep')   },
    diary:   { color: 'var(--color-entry)',   label: t('recent.diary')   },
  }

  function getDetail(entry) {
    switch (entry._tracker) {
      case 'feeding': {
        if (entry.type === 'breast') {
          const parts = [t('recent.breast')]
          if (entry.side)     parts.push(entry.side.charAt(0).toUpperCase() + entry.side.slice(1))
          if (entry.duration) parts.push(formatDuration(entry.duration))
          return parts.join(' · ')
        }
        if (entry.type === 'bottle') return `${t('recent.bottle')}${entry.amount ? ` · ${entry.amount} ml` : ''}`
        return t('recent.solid')
      }
      case 'diaper': {
        const map = { wet: t('recent.wet'), dirty: t('recent.dirty'), both: t('recent.wetDirty') }
        return map[entry.type] ?? entry.type
      }
      case 'sleep':
        return [
          formatDuration(entry.duration),
          entry.quality ? entry.quality.charAt(0).toUpperCase() + entry.quality.slice(1) : null,
        ].filter(Boolean).join(' · ')
      case 'diary':
        return entry.text?.length > 55 ? entry.text.slice(0, 55) + '…' : (entry.text ?? '')
      default:
        return ''
    }
  }

  const combined = [
    ...feedings.map((e) => ({ ...e, _tracker: 'feeding' })),
    ...diapers.map((e)  => ({ ...e, _tracker: 'diaper'  })),
    ...sleeps.map((e)   => ({ ...e, _tracker: 'sleep'   })),
    ...diary.map((e)    => ({ ...e, _tracker: 'diary'   })),
  ].sort(
    (a, b) => (toDate(b.timestamp)?.getTime() ?? 0) - (toDate(a.timestamp)?.getTime() ?? 0)
  ).slice(0, 10)

  if (combined.length === 0) {
    return <div className="recent-empty">{t('recent.empty')}</div>
  }

  return (
    <div className="recent-list">
      {combined.map((entry) => {
        const cfg = TRACKER[entry._tracker]
        return (
          <div key={`${entry._tracker}-${entry.id}`} className="recent-item">
            <span className="recent-dot" style={{ backgroundColor: cfg.color }} />
            <div className="recent-body">
              <span className="recent-tracker">{cfg.label}</span>
              <span className="recent-detail">{getDetail(entry)}</span>
            </div>
            <span className="recent-time">{formatTimeAgo(entry.timestamp)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default RecentActivity
