// Safely convert any timestamp variant to a JS Date
export function toDate(ts) {
  if (!ts) return null
  if (ts.toDate)    return ts.toDate()           // Firestore Timestamp
  if (ts instanceof Date) return ts              // plain Date
  if (ts.seconds)   return new Date(ts.seconds * 1000) // serialised Timestamp
  return new Date(ts)
}

const LOCALE_MAP = { es: 'es-MX', en: 'en-US' }

export function formatTime(ts, language = 'en') {
  const d = toDate(ts)
  if (!d) return '—'
  const locale = LOCALE_MAP[language] ?? 'en-US'
  return d.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function formatDate(ts, language = 'en') {
  const d = toDate(ts)
  if (!d) return '—'
  const locale = LOCALE_MAP[language] ?? 'en-US'
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(ts, language = 'en') {
  const d = toDate(ts)
  if (!d) return '—'
  return `${formatDate(ts, language)}, ${formatTime(ts, language)}`
}

export function formatDuration(minutes) {
  if (minutes == null || isNaN(minutes)) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

// t must supply keys: 'time.justNow', 'time.mAgo', 'time.hAgo', 'time.dAgo'
export function formatTimeAgo(ts, t) {
  const d = toDate(ts)
  if (!d) return '—'
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000)
  if (!t) {
    // fallback – no translation function provided
    if (diffMin <  1)  return 'just now'
    if (diffMin < 60)  return `${diffMin}m ago`
    const diffH = Math.floor(diffMin / 60)
    if (diffH   < 24)  return `${diffH}h ago`
    const diffD = Math.floor(diffH / 24)
    return `${diffD}d ago`
  }
  if (diffMin <  1)  return t('time.justNow')
  if (diffMin < 60)  return t('time.mAgo').replace('{{n}}', diffMin)
  const diffH = Math.floor(diffMin / 60)
  if (diffH   < 24)  return t('time.hAgo').replace('{{n}}', diffH)
  const diffD = Math.floor(diffH / 24)
  return t('time.dAgo').replace('{{n}}', diffD)
}

// Convert a Firestore Timestamp (or null) → "YYYY-MM-DDTHH:mm" for datetime-local inputs
export function timestampToInput(ts) {
  const d = toDate(ts) ?? new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  )
}
