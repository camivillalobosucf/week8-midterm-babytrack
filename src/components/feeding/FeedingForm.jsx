import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { timestampToInput } from '../../utils/formatters'
import './Feeding.css'

function FeedingForm({ onSubmit, onCancel, initialEntry }) {
  const [type,         setType]         = useState(initialEntry?.type      ?? 'breast')
  const [amount,       setAmount]       = useState(initialEntry?.amount     ?? '')
  const [duration,     setDuration]     = useState(initialEntry?.duration   ?? '')
  const [side,         setSide]         = useState(initialEntry?.side       ?? 'left')
  const [notes,        setNotes]        = useState(initialEntry?.notes      ?? '')
  const [timestampStr, setTimestampStr] = useState(timestampToInput(initialEntry?.timestamp))
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')

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
      if (type === 'bottle' || type === 'solid') data.amount   = Number(amount)   || 0
      if (type === 'breast')                     data.duration = Number(duration) || 0
      if (type === 'breast')                     data.side     = side
      await onSubmit(data)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="tracker-form feeding-form">
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>Date &amp; Time</label>
        <input
          type="datetime-local"
          value={timestampStr}
          onChange={(e) => setTimestampStr(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <div className="btn-group">
          {['breast', 'bottle', 'solid'].map((t) => (
            <button
              key={t}
              type="button"
              className={`btn-toggle${type === t ? ' btn-toggle-active' : ''}`}
              onClick={() => setType(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {type === 'breast' && (
        <>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>
          <div className="form-group">
            <label>Side</label>
            <div className="btn-group">
              {['left', 'right', 'both'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`btn-toggle${side === s ? ' btn-toggle-active' : ''}`}
                  onClick={() => setSide(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {(type === 'bottle' || type === 'solid') && (
        <div className="form-group">
          <label>Amount (ml)</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 120"
          />
        </div>
      )}

      <div className="form-group">
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          rows={2}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initialEntry ? 'Update' : 'Add Feeding'}
        </button>
      </div>
    </form>
  )
}

export default FeedingForm
