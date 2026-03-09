import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { timestampToInput } from '../../utils/formatters'
import './Diaper.css'

function DiaperForm({ onSubmit, onCancel, initialEntry }) {
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
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="tracker-form diaper-form">
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
          {['wet', 'dirty', 'both'].map((t) => (
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
          {loading ? 'Saving…' : initialEntry ? 'Update' : 'Add Diaper'}
        </button>
      </div>
    </form>
  )
}

export default DiaperForm
