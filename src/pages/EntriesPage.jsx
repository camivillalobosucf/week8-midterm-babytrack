import { useState, useMemo } from 'react'
import { useFeedings } from '../hooks/useFeedings'
import { useDiapers }  from '../hooks/useDiapers'
import { useSleeps }   from '../hooks/useSleeps'
import FeedingForm     from '../components/feeding/FeedingForm'
import DiaperForm      from '../components/diaper/DiaperForm'
import SleepForm       from '../components/sleep/SleepForm'
import Modal           from '../components/layout/Modal'
import { getFeedingAnalytics } from '../utils/feedingAnalytics'
import { getDiaperAnalytics }  from '../utils/diaperAnalytics'
import { getSleepAnalytics }   from '../utils/sleepAnalytics'
import { toDate, formatTime, formatDuration, formatTimeAgo } from '../utils/formatters'
import './EntriesPage.css'

const FILTERS = [
  { key: 'today',     label: 'Today'     },
  { key: 'yesterday', label: 'Yesterday' },
  { key: '7days',     label: '7 Days'    },
  { key: 'all',       label: 'All'       },
]

const ADD_TITLES = {
  feeding: '🍼 Log Feeding',
  diaper:  '🧷 Log Diaper Change',
  sleep:   '😴 Log Sleep Session',
}

const EDIT_TITLES = {
  feeding: '🍼 Edit Feeding',
  diaper:  '🧷 Edit Diaper',
  sleep:   '😴 Edit Sleep Session',
}

function getEventTime(entry, type) {
  const raw = type === 'sleep' ? entry.startTime : entry.timestamp
  return toDate(raw) ?? new Date(0)
}

function filterByRange(items, filter) {
  const now          = new Date()
  const todayStart   = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yestStart    = new Date(todayStart.getTime() - 86_400_000)
  const weekStart    = new Date(todayStart.getTime() - 6 * 86_400_000)
  return items.filter(({ time }) => {
    if (filter === 'today')     return time >= todayStart
    if (filter === 'yesterday') return time >= yestStart && time < todayStart
    if (filter === '7days')     return time >= weekStart
    return true
  })
}

// ── helpers for display ────────────────────────────────────────────────────
function feedingEmoji(type) {
  return type === 'breast' ? '🤱' : type === 'solid' ? '🥣' : '🍼'
}
function feedingLabel(type) {
  return type === 'breast' ? 'Breast' : type === 'solid' ? 'Solid' : 'Bottle'
}
function feedingDetail(e) {
  if (e.type === 'breast') {
    const parts = []
    if (e.side)     parts.push(e.side.charAt(0).toUpperCase() + e.side.slice(1))
    if (e.duration) parts.push(formatDuration(e.duration))
    return parts.join(' · ')
  }
  return e.amount ? `${e.amount} ml` : ''
}
function diaperEmoji(type) {
  return type === 'wet' ? '💧' : type === 'dirty' ? '💩' : '💧💩'
}
function diaperLabel(type) {
  return type === 'wet' ? 'Wet' : type === 'dirty' ? 'Dirty' : 'Both'
}

// ── main component ─────────────────────────────────────────────────────────
function EntriesPage() {
  const { entries: feedings, loading: l1, add: addFeeding, update: updateFeeding, remove: removeFeeding } = useFeedings()
  const { entries: diapers,  loading: l2, add: addDiaper,  update: updateDiaper,  remove: removeDiaper  } = useDiapers()
  const { entries: sleeps,   loading: l3, add: addSleep,   update: updateSleep,   remove: removeSleep   } = useSleeps()

  const [filter,       setFilter]       = useState('today')
  const [formType,     setFormType]     = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)

  const loading = l1 || l2 || l3

  const feedStats   = getFeedingAnalytics(feedings)
  const diaperStats = getDiaperAnalytics(diapers)
  const sleepStats  = getSleepAnalytics(sleeps)

  const allEntries = useMemo(() => {
    const items = [
      ...feedings.map(e => ({ ...e, _type: 'feeding', time: getEventTime(e, 'feeding') })),
      ...diapers.map(e  => ({ ...e, _type: 'diaper',  time: getEventTime(e, 'diaper')  })),
      ...sleeps.map(e   => ({ ...e, _type: 'sleep',   time: getEventTime(e, 'sleep')   })),
    ]
    return items.sort((a, b) => b.time - a.time)
  }, [feedings, diapers, sleeps])

  const filtered = useMemo(() => filterByRange(allEntries, filter), [allEntries, filter])

  function openAdd(type) {
    setEditingEntry(null)
    setFormType(type)
  }

  function openEdit(entry) {
    setEditingEntry(entry)
    setFormType(entry._type)
  }

  function closeModal() {
    setFormType(null)
    setEditingEntry(null)
  }

  async function handleSubmit(data) {
    if (editingEntry) {
      if (formType === 'feeding') await updateFeeding(editingEntry.id, data)
      if (formType === 'diaper')  await updateDiaper(editingEntry.id, data)
      if (formType === 'sleep')   await updateSleep(editingEntry.id, data)
    } else {
      if (formType === 'feeding') await addFeeding(data)
      if (formType === 'diaper')  await addDiaper(data)
      if (formType === 'sleep')   await addSleep(data)
    }
    closeModal()
  }

  async function handleDelete(entry) {
    const labels = { feeding: 'feeding', diaper: 'diaper change', sleep: 'sleep session' }
    if (!window.confirm(`Delete this ${labels[entry._type]}?`)) return
    if (entry._type === 'feeding') await removeFeeding(entry.id)
    if (entry._type === 'diaper')  await removeDiaper(entry.id)
    if (entry._type === 'sleep')   await removeSleep(entry.id)
  }

  return (
    <div className="entries-page">
      <div className="tracker-page-header">
        <div>
          <h1 className="page-title">📋 Entries</h1>
          <p className="page-subtitle">Feedings, diapers &amp; sleep in one timeline</p>
        </div>
      </div>

      {/* Today stats strip */}
      <div className="entries-stats">
        <div className="entries-stat">
          <span className="entries-stat-emoji">🍼</span>
          <span className="entries-stat-val">{feedStats.todayCount}</span>
          <span className="entries-stat-label">feeds</span>
        </div>
        <div className="entries-stat-divider" />
        <div className="entries-stat">
          <span className="entries-stat-emoji">🧷</span>
          <span className="entries-stat-val">{diaperStats.diapersToday}</span>
          <span className="entries-stat-label">diapers</span>
        </div>
        <div className="entries-stat-divider" />
        <div className="entries-stat">
          <span className="entries-stat-emoji">😴</span>
          <span className="entries-stat-val">
            {sleepStats.totalSleepMin > 0 ? formatDuration(sleepStats.totalSleepMin) : '—'}
          </span>
          <span className="entries-stat-label">sleep</span>
        </div>
      </div>

      {/* Quick add row */}
      <div className="entries-add-row">
        <button className="entries-add-btn feeding-add" onClick={() => openAdd('feeding')}>
          + 🍼 Feeding
        </button>
        <button className="entries-add-btn diaper-add" onClick={() => openAdd('diaper')}>
          + 🧷 Diaper
        </button>
        <button className="entries-add-btn sleep-add" onClick={() => openAdd('sleep')}>
          + 😴 Sleep
        </button>
      </div>

      {/* Filter tabs */}
      <div className="entries-filter-tabs">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={'entries-filter-tab' + (filter === key ? ' entries-filter-tab-active' : '')}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading && <p className="loading-text">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p className="empty-text">No entries for this period. Tap a button above to add one.</p>
      )}
      {!loading && filtered.length > 0 && (
        <div className="timeline">
          {filtered.map((entry) => (
            <TimelineItem
              key={`${entry._type}-${entry.id}`}
              entry={entry}
              onEdit={() => openEdit(entry)}
              onDelete={() => handleDelete(entry)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={formType !== null}
        onClose={closeModal}
        title={editingEntry ? (EDIT_TITLES[formType] ?? '') : (ADD_TITLES[formType] ?? '')}
      >
        {formType === 'feeding' && (
          <FeedingForm onSubmit={handleSubmit} onCancel={closeModal} initialEntry={editingEntry} />
        )}
        {formType === 'diaper' && (
          <DiaperForm onSubmit={handleSubmit} onCancel={closeModal} initialEntry={editingEntry} />
        )}
        {formType === 'sleep' && (
          <SleepForm onSubmit={handleSubmit} onCancel={closeModal} initialEntry={editingEntry} />
        )}
      </Modal>
    </div>
  )
}

// ── timeline item ──────────────────────────────────────────────────────────
function TimelineItem({ entry, onEdit, onDelete }) {
  const type = entry._type

  let emoji, label, detail, bgColor, textColor
  if (type === 'feeding') {
    emoji     = feedingEmoji(entry.type)
    label     = feedingLabel(entry.type)
    detail    = feedingDetail(entry)
    bgColor   = 'var(--color-feeding)'
    textColor = '#166534'
  } else if (type === 'diaper') {
    emoji     = diaperEmoji(entry.type)
    label     = diaperLabel(entry.type)
    detail    = entry.notes ?? ''
    bgColor   = 'var(--color-diaper)'
    textColor = '#713f12'
  } else {
    emoji     = '😴'
    label     = 'Sleep'
    detail    = formatDuration(entry.duration) + (entry.quality ? ` · ${entry.quality}` : '')
    bgColor   = 'var(--color-sleep)'
    textColor = '#1e3a5f'
  }

  const rawTs = type === 'sleep' ? entry.startTime : entry.timestamp
  const timeStr = formatTime(rawTs)
  const agoStr  = formatTimeAgo(rawTs)

  return (
    <div className="timeline-item">
      <div className="timeline-dot" style={{ background: bgColor }} />
      <div className="timeline-body">
        <div className="timeline-top">
          <span className="timeline-badge" style={{ background: bgColor, color: textColor }}>
            {emoji} {label}
          </span>
          {detail && <span className="timeline-detail">{detail}</span>}
          <span className="timeline-ago">{agoStr}</span>
        </div>
        <div className="timeline-bottom">
          <span className="timeline-time">{timeStr}</span>
          {entry.notes && type !== 'diaper' && (
            <span className="timeline-notes">— {entry.notes}</span>
          )}
          <div className="entry-actions">
            <button className="btn-action" onClick={onEdit}>Edit</button>
            <button className="btn-action btn-action-delete" onClick={onDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntriesPage
