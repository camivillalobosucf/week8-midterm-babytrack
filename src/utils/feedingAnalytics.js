import { toDate } from './formatters'

function todayStart() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getFeedingAnalytics(entries) {
  const start = todayStart()
  const todayEntries = entries.filter((e) => (toDate(e.timestamp) ?? new Date(0)) >= start)

  // Total milk (ml) from bottle feeds today
  const totalMlToday = todayEntries
    .filter((e) => e.type === 'bottle')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

  // Average interval between feedings today (minutes)
  const sorted = [...todayEntries].sort(
    (a, b) => (toDate(a.timestamp) ?? 0) - (toDate(b.timestamp) ?? 0)
  )
  let avgIntervalMin = null
  if (sorted.length >= 2) {
    let total = 0
    for (let i = 1; i < sorted.length; i++) {
      total +=
        ((toDate(sorted[i].timestamp) ?? 0) - (toDate(sorted[i - 1].timestamp) ?? 0)) / 60000
    }
    avgIntervalMin = Math.round(total / (sorted.length - 1))
  }

  // Bottle vs breast ratio today
  const bottleCount = todayEntries.filter((e) => e.type === 'bottle').length
  const breastCount = todayEntries.filter((e) => e.type === 'breast').length
  const ratioTotal  = bottleCount + breastCount

  return {
    todayCount:    todayEntries.length,
    totalMlToday,
    avgIntervalMin,
    bottleCount,
    breastCount,
    bottlePct: ratioTotal > 0 ? Math.round((bottleCount / ratioTotal) * 100) : 0,
    breastPct: ratioTotal > 0 ? Math.round((breastCount / ratioTotal) * 100) : 0,
  }
}
