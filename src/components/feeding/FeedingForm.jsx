import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useLanguage } from '../../context/LanguageContext'
import { timestampToInput } from '../../utils/formatters'
import './Feeding.css'

function FeedingForm({ onSubmit, onCancel, initialEntry }) {
  const { t } = useLanguage()
  const [type,         setType]         = useState(initialEntry?.type        ?? 'breast')
  const [unit,         setUnit]         = useState(initialEntry?.amountUnit  ?? 'ml')
  const [duration,     setDuration]     = useState(initialEntry?.duration    ?? '')
  const [side,         setSide]         = useState(initialEntry?.side        ?? 'left')
  const [notes,        setNotes]        = useState(initialEntry?.notes       ?? '')
  const [timestampStr, setTimestampStr] = useState(timestampToInput(initialEntry?.timestamp))
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')

  // When editing, show amount in the stored unit (convert ml→oz if needed)
  const initAmount = () => {
    if (!initialEntry?.amount) return ''
    if ((initialEntry.amountUnit ?? 'ml') === 'oz') {
      return String(Math.round(initialEntry.amount / 29.5735 * 10) / 10)
    }
    return String(initialEntry.amount)
  }
  const [amount, setAmount] = useState(initAmount)

  function handleUnitChange(newUnit) {
    if (amount && newUnit !== unit) {
      const n = Number(amount)
      if (newUnit === 'oz') {
        setAmount(String(Math.round(n / 29.5735 * 10) / 10))
      } else {
        setAmount(String(Math.round(n * 29.5735)))
      }
    }
    setUnit(newUnit)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = {
        type,
        notes:     notes.trim(),
        timestamp: Timestamp.fromDate(new Date(timestampStr)),
      }
      if (type === 'bottle' || type === 'solid') {
        const amountInMl = unit === 'oz'
          ? Math.round(Number(amount) * 29.5735)
          : Number(amount)
        data.amount     = amountInMl || 0
        data.amountUnit = unit
      }
      if (type === 'breast') data.duration = Number(duration) || 0
      if (type === 'breast') data.side     = side
      await onSubmit(data)
    } catch {
      setError(t('form.saveFailed'))
    } finally {
      setLoading(false)
    }
  }

  const TYPES = [
    { key: 'breast', label: t('feeding.breast') },
    { key: 'bottle', label: t('feeding.bottle') },
    { key: 'solid',  label: t('feeding.solid')  },
  ]
  const SIDES = [
    { key: 'left',  label: t('feeding.left')  },
    { key: 'right', label: t('feeding.right') },
    { key: 'both',  label: t('feeding.both')  },
  ]

  return (
    <form onSubmit={handleSubmit} className="tracker-form feeding-form">
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
        <label>{t('feeding.type')}</label>
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

      {type === 'breast' && (
        <>
          <div className="form-group">
            <label>{t('feeding.durationMin')}</label>
            <input
              type="number" min="0" value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>
          <div className="form-group">
            <label>{t('feeding.side')}</label>
            <div className="btn-group">
              {SIDES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`btn-toggle${side === key ? ' btn-toggle-active' : ''}`}
                  onClick={() => setSide(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {(type === 'bottle' || type === 'solid') && (
        <div className="form-group">
          <label>{unit === 'oz' ? t('feeding.amountOz') : t('feeding.amountMl')}</label>
          <div className="btn-group" style={{ marginBottom: '0.5rem' }}>
            <button
              type="button"
              className={`btn-toggle${unit === 'ml' ? ' btn-toggle-active' : ''}`}
              onClick={() => handleUnitChange('ml')}
            >ml</button>
            <button
              type="button"
              className={`btn-toggle${unit === 'oz' ? ' btn-toggle-active' : ''}`}
              onClick={() => handleUnitChange('oz')}
            >oz</button>
          </div>
          <input
            type="number" min="0" step={unit === 'oz' ? '0.1' : '1'} value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={unit === 'oz' ? 'e.g. 4' : 'e.g. 120'}
          />
        </div>
      )}

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
          {loading ? t('form.saving') : initialEntry ? t('form.update') : t('feeding.addBtn')}
        </button>
      </div>
    </form>
  )
}

export default FeedingForm
