// Returns a human-readable age string from a YYYY-MM-DD date string.
// Pass a t() function for translated output; omit for English fallback.
export function calculateAge(dob, t) {
  if (!dob) return null
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return null
  const now = new Date()
  if (birth > now) return null

  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())

  function tr(key, vars = {}) {
    if (!t) return null
    let s = t(key)
    Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{{${k}}}`, v) })
    return s
  }

  if (totalMonths < 1) {
    const days = Math.floor((now - birth) / 86400000)
    if (t) return tr(days === 1 ? 'age.days' : 'age.days_p', { n: days })
    return `${days} day${days !== 1 ? 's' : ''} old`
  }

  if (totalMonths < 24) {
    const base = new Date(birth)
    base.setMonth(base.getMonth() + totalMonths)
    const remDays = Math.floor((now - base) / 86400000)
    if (remDays > 0) {
      if (t) return tr(totalMonths === 1 ? 'age.monthsDays' : 'age.monthsDays_p', { m: totalMonths, d: remDays })
      return `${totalMonths} month${totalMonths !== 1 ? 's' : ''}, ${remDays} day${remDays !== 1 ? 's' : ''} old`
    }
    if (t) return tr(totalMonths === 1 ? 'age.months' : 'age.months_p', { n: totalMonths })
    return `${totalMonths} month${totalMonths !== 1 ? 's' : ''} old`
  }

  const years  = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (months > 0) {
    if (t) return tr(years === 1 ? 'age.yearsMonths' : 'age.yearsMonths_p', { y: years, m: months })
    return `${years} yr${years !== 1 ? 's' : ''}, ${months} mo old`
  }
  if (t) return tr(years === 1 ? 'age.years' : 'age.years_p', { n: years })
  return `${years} year${years !== 1 ? 's' : ''} old`
}
