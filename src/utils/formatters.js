// Safely convert any timestamp variant to a JS Date
export function toDate(ts) {
  if (!ts) return null
  if (ts.toDate)    return ts.toDate()           // Firestore Timestamp
  if (ts instanceof Date) return ts              // plain Date
  if (ts.seconds)   return new Date(ts.seconds * 1000) // serialised Timestamp
  return new Date(ts)
}

export function formatTime(ts) {
  const d = toDate(ts)
  if (!d) return '—'
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function formatDate(ts) {
  const d = toDate(ts)
  if (!d) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(ts) {
  const d = toDate(ts)
  if (!d) return '—'
  return `${formatDate(ts)}, ${formatTime(ts)}`
}

export function formatDuration(minutes) {
  if (minutes == null || isNaN(minutes)) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

export function formatTimeAgo(ts) {
  const d = toDate(ts)
  if (!d) return '—'
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000)
  if (diffMin <  1)  return 'just now'
  if (diffMin < 60)  return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH   < 24)  return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d ago`
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
