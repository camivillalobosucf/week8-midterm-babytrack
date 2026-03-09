import { toDate } from './formatters'

function todayStart() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getDiaperAnalytics(entries) {
  const start   = todayStart()
  const weekAgo = new Date(start)
  weekAgo.setDate(weekAgo.getDate() - 6) // 7-day window

  const todayEntries = entries.filter((e) => (toDate(e.timestamp) ?? new Date(0)) >= start)
  const weekEntries  = entries.filter((e) => (toDate(e.timestamp) ?? new Date(0)) >= weekAgo)

  // Wet includes 'wet' and 'both'
  const wetCount   = todayEntries.filter((e) => e.type === 'wet'   || e.type === 'both').length
  const dirtyCount = todayEntries.filter((e) => e.type === 'dirty' || e.type === 'both').length
  const total      = wetCount + dirtyCount

  return {
    diapersToday: todayEntries.length,
    wetCount,
    dirtyCount,
    wetPct:   total > 0 ? Math.round((wetCount   / total) * 100) : 0,
    dirtyPct: total > 0 ? Math.round((dirtyCount / total) * 100) : 0,
    weeklyAvg: weekEntries.length > 0 ? (weekEntries.length / 7).toFixed(1) : '0.0',
  }
}
