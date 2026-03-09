import { useState, useMemo } from 'react'
import { Timestamp } from 'firebase/firestore'
import { timestampToInput, formatDuration } from '../../utils/formatters'
import './Sleep.css'

function SleepForm({ onSubmit, onCancel, initialEntry }) {
  const [startStr,  setStartStr]  = useState(timestampToInput(initialEntry?.startTime))
  const [endStr,    setEndStr]    = useState(timestampToInput(initialEntry?.endTime))
  const [quality,   setQuality]   = useState(initialEntry?.quality ?? 'good')
  const [notes,     setNotes]     = useState(initialEntry?.notes   ?? '')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  // Auto-computed duration shown as preview
  const durationMin = useMemo(() => {
    if (!startStr || !endStr) return null
    const diff = Math.round((new Date(endStr) - new Date(startStr)) / 60000)
    return diff > 0 ? diff : null
  }, [startStr, endStr])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!durationMin) return setError('End time must be after start time.')
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
        timestamp: Timestamp.fromDate(startDate), // for consistent ordering
      })
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="tracker-form sleep-form">
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={startStr}
          onChange={(e) => setStartStr(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>End Time</label>
        <input
          type="datetime-local"
          value={endStr}
          onChange={(e) => setEndStr(e.target.value)}
          required
        />
        {durationMin && (
          <span className="sleep-duration-preview">
            Duration: {formatDuration(durationMin)}
          </span>
        )}
      </div>

      <div className="form-group">
        <label>Quality</label>
        <div className="btn-group">
          {['good', 'fair', 'poor'].map((q) => (
            <button
              key={q}
              type="button"
              className={`btn-toggle${quality === q ? ' btn-toggle-active' : ''}`}
              onClick={() => setQuality(q)}
            >
              {q.charAt(0).toUpperCase() + q.slice(1)}
            </button>
          ))}
        </div>
      </div>

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
          {loading ? 'Saving…' : initialEntry ? 'Update' : 'Add Sleep'}
        </button>
      </div>
    </form>
  )
}

export default SleepForm
