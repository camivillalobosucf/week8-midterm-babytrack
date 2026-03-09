import { toDate } from './formatters'

function todayStart() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getSleepAnalytics(entries) {
  const start = todayStart()
  const todayEntries = entries.filter((e) => (toDate(e.timestamp) ?? new Date(0)) >= start)

  const totalSleepMin = todayEntries.reduce((sum, e) => sum + (Number(e.duration) || 0), 0)
  const avgNapMin     = todayEntries.length > 0
    ? Math.round(totalSleepMin / todayEntries.length)
    : 0

  // Longest single sleep session across all recorded entries
  const longestMin = entries.reduce((max, e) => Math.max(max, Number(e.duration) || 0), 0)

  return {
    sessionCount:  todayEntries.length,
    totalSleepMin,
    avgNapMin,
    longestMin,
  }
}
