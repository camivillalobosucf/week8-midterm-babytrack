import { useState } from 'react'
import { useFeedings } from '../hooks/useFeedings'
import { useDiapers }  from '../hooks/useDiapers'
import { useSleeps }   from '../hooks/useSleeps'
import { useDiary }    from '../hooks/useDiary'
import { useProfile }  from '../hooks/useProfile'
import { useLanguage } from '../context/LanguageContext'
import SummaryCard     from '../components/dashboard/SummaryCard'
import RecentActivity  from '../components/dashboard/RecentActivity'
import WeeklyCharts    from '../components/dashboard/WeeklyCharts'
import FeedingForm     from '../components/feeding/FeedingForm'
import DiaperForm      from '../components/diaper/DiaperForm'
import SleepForm       from '../components/sleep/SleepForm'
import DiaryForm       from '../components/diary/DiaryForm'
import Modal           from '../components/layout/Modal'
import { getFeedingAnalytics } from '../utils/feedingAnalytics'
import { getDiaperAnalytics }  from '../utils/diaperAnalytics'
import { getSleepAnalytics }   from '../utils/sleepAnalytics'
import { toDate, formatDuration, formatTimeAgo } from '../utils/formatters'
import { calculateAge } from '../utils/babyAge'
import './DashboardPage.css'

function todayStart() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function DashboardPage() {
  const { t, language } = useLanguage()
  const { entries: feedings, loading: l1, add: addFeeding } = useFeedings()
  const { entries: diapers,  loading: l2, add: addDiaper  } = useDiapers()
  const { entries: sleeps,   loading: l3, add: addSleep   } = useSleeps()
  const { entries: diary,    loading: l4, add: addDiary   } = useDiary()
  const { profile } = useProfile()

  const [formType, setFormType] = useState(null)

  const QUICK_FORMS = [
    { key: 'feeding', emoji: '🍼', label: t('dash.quickFeeding'), color: 'var(--color-feeding)' },
    { key: 'diaper',  emoji: '🧷', label: t('dash.quickDiaper'),  color: 'var(--color-diaper)'  },
    { key: 'sleep',   emoji: '😴', label: t('dash.quickSleep'),   color: 'var(--color-sleep)'   },
    { key: 'diary',   emoji: '📓', label: t('dash.quickDiary'),   color: 'var(--color-entry)'   },
  ]

  const MODAL_TITLES = {
    feeding: t('entries.logFeeding'),
    diaper:  t('entries.logDiaper'),
    sleep:   t('entries.logSleep'),
    diary:   t('diary.logModal'),
  }

  const loading = l1 || l2 || l3 || l4

  const localeMap = { es: 'es-MX', en: 'en-US' }
  const today = new Date().toLocaleDateString(localeMap[language] ?? 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const feedStats   = getFeedingAnalytics(feedings)
  const diaperStats = getDiaperAnalytics(diapers)
  const sleepStats  = getSleepAnalytics(sleeps)

  const start      = todayStart()
  const diaryToday = diary.filter((e) => (toDate(e.timestamp) ?? new Date(0)) >= start).length

  const cards = [
    {
      label:    '🍼 ' + t('dash.quickFeeding'),
      to:       '/entries',
      color:    'var(--color-feeding)',
      primary:  feedStats.todayCount,
      secondary: feedStats.totalMlToday > 0
        ? `${feedStats.totalMlToday} ${t('dash.mlToday')}`
        : `${feedStats.todayCount} ${feedStats.todayCount !== 1 ? t('dash.sessions_plural') : t('dash.sessions')} ${t('dash.today')}`,
      lastTime: feedings[0] ? formatTimeAgo(feedings[0].timestamp, t) : null,
    },
    {
      label:    '🧷 ' + t('dash.quickDiaper'),
      to:       '/entries',
      color:    'var(--color-diaper)',
      primary:  diaperStats.diapersToday,
      secondary: diaperStats.wetCount + diaperStats.dirtyCount > 0
        ? `${diaperStats.wetCount} ${t('diaper.wet').toLowerCase()} · ${diaperStats.dirtyCount} ${t('diaper.dirty').toLowerCase()}`
        : `${diaperStats.weeklyAvg} ${t('dash.avgPerDay')}`,
      lastTime: diapers[0] ? formatTimeAgo(diapers[0].timestamp, t) : null,
    },
    {
      label:    '😴 ' + t('dash.quickSleep'),
      to:       '/entries',
      color:    'var(--color-sleep)',
      primary:  sleepStats.totalSleepMin > 0
        ? formatDuration(sleepStats.totalSleepMin)
        : sleepStats.sessionCount,
      secondary: sleepStats.sessionCount > 0
        ? `${sleepStats.sessionCount} ${sleepStats.sessionCount !== 1 ? t('dash.sessions_plural') : t('dash.sessions')} ${t('dash.today')}`
        : t('dash.noSessionsToday'),
      lastTime: sleeps[0] ? formatTimeAgo(sleeps[0].timestamp, t) : null,
    },
    {
      label:    '📓 ' + t('dash.quickDiary'),
      to:       '/diary',
      color:    'var(--color-entry)',
      primary:  diaryToday,
      secondary: diaryToday !== 1 ? t('dash.entriesToday') : t('dash.entryToday'),
      lastTime: diary[0] ? formatTimeAgo(diary[0].timestamp, t) : null,
    },
  ]

  async function handleQuickSubmit(data) {
    if (formType === 'feeding') await addFeeding(data)
    if (formType === 'diaper')  await addDiaper(data)
    if (formType === 'sleep')   await addSleep(data)
    if (formType === 'diary')   await addDiary(data)
    setFormType(null)
  }

  const babyName = profile?.babyName
  const age      = calculateAge(profile?.dob, t)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">
          {babyName
            ? t('dash.namedTitle').replace('{{name}}', babyName)
            : t('dash.title')}
        </h1>
        {age && <p className="dashboard-age">{age} 🎂</p>}
        <p className="page-subtitle">{today}</p>
      </div>

      {/* Quick log row */}
      <p className="quick-log-heading">➕ {t('dash.addNewEntry')}</p>
      <div className="quick-log">
        {QUICK_FORMS.map(({ key, emoji, label, color }) => (
          <button
            key={key}
            className="quick-log-btn"
            style={{ backgroundColor: color }}
            onClick={() => setFormType(key)}
          >
            <span className="quick-log-emoji">{emoji}</span>
            <span className="quick-log-label">{label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">{t('dash.loading')}</p>
      ) : (
        <>
          <h2 className="dash-section-label">{t('dash.today')}</h2>
          <div className="summary-grid">
            {cards.map((card) => (
              <SummaryCard key={card.to + card.label} {...card} />
            ))}
          </div>

          <WeeklyCharts feedings={feedings} diapers={diapers} sleeps={sleeps} />

          <h2 className="dash-section-label">{t('dash.recentActivity')}</h2>
          <RecentActivity
            feedings={feedings}
            diapers={diapers}
            sleeps={sleeps}
            diary={diary}
          />
        </>
      )}

      <Modal
        isOpen={formType !== null}
        onClose={() => setFormType(null)}
        title={MODAL_TITLES[formType] ?? ''}
      >
        {formType === 'feeding' && (
          <FeedingForm onSubmit={handleQuickSubmit} onCancel={() => setFormType(null)} />
        )}
        {formType === 'diaper' && (
          <DiaperForm onSubmit={handleQuickSubmit} onCancel={() => setFormType(null)} />
        )}
        {formType === 'sleep' && (
          <SleepForm onSubmit={handleQuickSubmit} onCancel={() => setFormType(null)} />
        )}
        {formType === 'diary' && (
          <DiaryForm onSubmit={handleQuickSubmit} onCancel={() => setFormType(null)} />
        )}
      </Modal>
    </div>
  )
}

export default DashboardPage
