import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { timestampToInput } from '../../utils/formatters'
import { DIARY_TAGS } from './diaryTags'
import './Diary.css'

function DiaryForm({ onSubmit, onCancel, initialEntry }) {
  const [text,         setText]         = useState(initialEntry?.text  ?? '')
  const [tags,         setTags]         = useState(initialEntry?.tags  ?? [])
  const [timestampStr, setTimestampStr] = useState(timestampToInput(initialEntry?.timestamp))
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return setError('Please write something.')
    setError('')
    setLoading(true)
    try {
      await onSubmit({
        text:      text.trim(),
        tags,
        timestamp: Timestamp.fromDate(new Date(timestampStr)),
      })
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="tracker-form">
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
        <label>Entry</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write about your baby's day..."
          rows={4}
          required
        />
      </div>

      <div className="form-group">
        <label>Tags <span className="form-hint">(tap to select)</span></label>
        <div className="tag-picker">
          {DIARY_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-chip${tags.includes(tag) ? ' tag-chip-active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initialEntry ? 'Update' : 'Add Entry'}
        </button>
      </div>
    </form>
  )
}

export default DiaryForm
