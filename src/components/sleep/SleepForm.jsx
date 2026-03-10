import { useState, useMemo } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useLanguage } from '../../context/LanguageContext'
import { timestampToInput, formatDuration } from '../../utils/formatters'
import './Sleep.css'

function SleepForm({ onSubmit, onCancel, initialEntry }) {
  const { t } = useLanguage()
  const [startStr,  setStartStr]  = useState(timestampToInput(initialEntry?.startTime))
  const [endStr,    setEndStr]    = useState(timestampToInput(initialEntry?.endTime))
  const [quality,   setQuality]   = useState(initialEntry?.quality ?? 'good')
  const [notes,     setNotes]     = useState(initialEntry?.notes   ?? '')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const durationMin = useMemo(() => {
    if (!startStr || !endStr) return null
    const diff = Math.round((new Date(endStr) - new Date(startStr)) / 60000)
    return diff > 0 ? diff : null
  }, [startStr, endStr])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!durationMin) return setError(t('sleep.endAfterStart'))
    setError('')
    setLoading(true)
    try {
      const startDate = new Date(startStr)
      await onSubmit({
        startTime: Timestamp.fromDate(startDate),
        endTime:   Timestamp.fromDate(new Date(endStr)),
        duration:  durationMin,
        quality,
        notes:     notes.trim(),
        timestamp: Timestamp.fromDate(startDate),
      })
    } catch {
      setError(t('form.saveFailed'))
    } finally {
      setLoading(false)
    }
  }

  const QUALITIES = [
    { key: 'good', label: t('sleep.good') },
    { key: 'fair', label: t('sleep.fair') },
    { key: 'poor', label: t('sleep.poor') },
  ]

  return (
    <form onSubmit={handleSubmit} className="tracker-form sleep-form">
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>{t('sleep.startTime')}</label>
        <input
          type="datetime-local" value={startStr}
          onChange={(e) => setStartStr(e.target.value)} required
        />
      </div>

      <div className="form-group">
        <label>{t('sleep.endTime')}</label>
        <input
          type="datetime-local" value={endStr}
          onChange={(e) => setEndStr(e.target.value)} required
        />
        {durationMin && (
          <span className="sleep-duration-preview">
            {t('sleep.duration')}: {formatDuration(durationMin)}
          </span>
        )}
      </div>

      <div className="form-group">
        <label>{t('sleep.quality')}</label>
        <div className="btn-group">
          {QUALITIES.map(({ key, label }) => (
            <button
              key={key} type="button"
              className={`btn-toggle${quality === key ? ' btn-toggle-active' : ''}`}
              onClick={() => setQuality(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>{t('form.notes')}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('form.notesPlaceholder')}
          rows={2}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          {t('form.cancel')}
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t('form.saving') : initialEntry ? t('form.update') : t('sleep.addBtn')}
        </button>
      </div>
    </form>
  )
}

export default SleepForm
