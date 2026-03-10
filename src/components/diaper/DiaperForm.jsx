import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useLanguage } from '../../context/LanguageContext'
import { timestampToInput } from '../../utils/formatters'
import './Diaper.css'

function DiaperForm({ onSubmit, onCancel, initialEntry }) {
  const { t } = useLanguage()
  const [type,         setType]         = useState(initialEntry?.type  ?? 'wet')
  const [notes,        setNotes]        = useState(initialEntry?.notes ?? '')
  const [timestampStr, setTimestampStr] = useState(timestampToInput(initialEntry?.timestamp))
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({
        type,
        notes:     notes.trim(),
        timestamp: Timestamp.fromDate(new Date(timestampStr)),
      })
    } catch {
      setError(t('form.saveFailed'))
    } finally {
      setLoading(false)
    }
  }

  const TYPES = [
    { key: 'wet',   label: t('diaper.wet')   },
    { key: 'dirty', label: t('diaper.dirty') },
    { key: 'both',  label: t('diaper.both')  },
  ]

  return (
    <form onSubmit={handleSubmit} className="tracker-form diaper-form">
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>{t('form.dateTime')}</label>
        <input
          type="datetime-local"
          value={timestampStr}
          onChange={(e) => setTimestampStr(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>{t('diaper.type')}</label>
        <div className="btn-group">
          {TYPES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`btn-toggle${type === key ? ' btn-toggle-active' : ''}`}
              onClick={() => setType(key)}
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
          {loading ? t('form.saving') : initialEntry ? t('form.update') : t('diaper.addBtn')}
        </button>
      </div>
    </form>
  )
}

export default DiaperForm
