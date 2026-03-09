import { toDate, formatTimeAgo, formatDuration } from '../../utils/formatters'

const TRACKER = {
  feeding: { color: 'var(--color-feeding)', label: 'Feeding' },
  diaper:  { color: 'var(--color-diaper)',  label: 'Diaper'  },
  sleep:   { color: 'var(--color-sleep)',   label: 'Sleep'   },
  diary:   { color: 'var(--color-entry)',   label: 'Diary'   },
}

function getDetail(entry) {
  switch (entry._tracker) {
    case 'feeding': {
      if (entry.type === 'breast') {
        const parts = ['Breast']
        if (entry.side)     parts.push(entry.side.charAt(0).toUpperCase() + entry.side.slice(1))
        if (entry.duration) parts.push(formatDuration(entry.duration))
        return parts.join(' · ')
      }
      if (entry.type === 'bottle') return `Bottle${entry.amount ? ` · ${entry.amount} ml` : ''}`
      return 'Solid food'
    }
    case 'diaper': {
      const map = { wet: 'Wet', dirty: 'Dirty', both: 'Wet + Dirty' }
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

function RecentActivity({ feedings, diapers, sleeps, diary }) {
  const combined = [
    ...feedings.map((e) => ({ ...e, _tracker: 'feeding' })),
    ...diapers.map((e)  => ({ ...e, _tracker: 'diaper'  })),
    ...sleeps.map((e)   => ({ ...e, _tracker: 'sleep'   })),
    ...diary.map((e)    => ({ ...e, _tracker: 'diary'   })),
  ].sort(
    (a, b) => (toDate(b.timestamp)?.getTime() ?? 0) - (toDate(a.timestamp)?.getTime() ?? 0)
  ).slice(0, 10)

  if (combined.length === 0) {
    return (
      <div className="recent-empty">
        No activity yet — start by logging a feeding, diaper change, or sleep session.
      </div>
    )
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
