import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme }    from '../../hooks/useTheme'
import { toDate }      from '../../utils/formatters'

function buildWeeklyData(feedings, diapers, sleeps, language) {
  const locale = language === 'es' ? 'es-MX' : 'en-US'
  const days = []

  for (let i = 6; i >= 0; i--) {
    const d     = new Date()
    d.setDate(d.getDate() - i)
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const end   = new Date(start.getTime() + 86_400_000)
    const label = d.toLocaleDateString(locale, { weekday: 'short' })

    const sleepMins = sleeps
      .filter(e => { const t = toDate(e.startTime ?? e.timestamp); return t >= start && t < end })
      .reduce((sum, e) => sum + (Number(e.duration) || 0), 0)

    days.push({
      label,
      feedings: feedings.filter(e => { const t = toDate(e.timestamp); return t >= start && t < end }).length,
      diapers:  diapers.filter(e => { const t = toDate(e.timestamp); return t >= start && t < end }).length,
      sleep:    Math.round(sleepMins / 60 * 10) / 10,
    })
  }
  return days
}

function MiniChart({ data, dataKey, color, label, unit, isDark }) {
  const mutedText  = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)'
  const gridColor  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'
  const tooltipBg  = isDark ? '#1e1b2e' : '#ffffff'
  const tooltipBorder = isDark ? '#3f3a5c' : '#e5e7eb'

  return (
    <div className="mini-chart-card">
      <div className="mini-chart-label">{label}</div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: mutedText }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: mutedText }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={28}
          />
          <Tooltip
            formatter={(v) => [`${v}${unit ? ' ' + unit : ''}`, label]}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: `1px solid ${tooltipBorder}`,
              background: tooltipBg,
              color: isDark ? '#ede9f5' : '#111827',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function WeeklyCharts({ feedings, diapers, sleeps }) {
  const { t, language } = useLanguage()
  const { isDark }      = useTheme()
  const data            = buildWeeklyData(feedings, diapers, sleeps, language)

  const colors = {
    feeding: isDark ? '#4ade80' : '#86efac',
    diaper:  isDark ? '#fbbf24' : '#fcd34d',
    sleep:   isDark ? '#60a5fa' : '#93c5fd',
  }

  return (
    <div className="weekly-charts-section">
      <h2 className="dash-section-label">{t('chart.last7days')}</h2>
      <div className="weekly-charts-grid">
        <MiniChart data={data} dataKey="feedings" color={colors.feeding} label={t('chart.feedings')} isDark={isDark} />
        <MiniChart data={data} dataKey="diapers"  color={colors.diaper}  label={t('chart.diapers')}  isDark={isDark} />
        <MiniChart data={data} dataKey="sleep"    color={colors.sleep}   label={t('chart.sleep')}    isDark={isDark} unit={t('chart.hrs')} />
      </div>
    </div>
  )
}

export default WeeklyCharts
