// Returns a human-readable age string from a YYYY-MM-DD date string
export function calculateAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return null
  const now = new Date()
  if (birth > now) return null

  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())

  if (totalMonths < 1) {
    const days = Math.floor((now - birth) / 86400000)
    return `${days} day${days !== 1 ? 's' : ''} old`
  }

  if (totalMonths < 24) {
    const base = new Date(birth)
    base.setMonth(base.getMonth() + totalMonths)
    const remDays = Math.floor((now - base) / 86400000)
    return remDays > 0
      ? `${totalMonths} month${totalMonths !== 1 ? 's' : ''}, ${remDays} day${remDays !== 1 ? 's' : ''} old`
      : `${totalMonths} month${totalMonths !== 1 ? 's' : ''} old`
  }

  const years  = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  return months > 0
    ? `${years} yr${years !== 1 ? 's' : ''}, ${months} mo old`
    : `${years} year${years !== 1 ? 's' : ''} old`
}
