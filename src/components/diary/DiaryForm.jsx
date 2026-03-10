import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useLanguage } from '../../context/LanguageContext'
import { timestampToInput } from '../../utils/formatters'
import { DIARY_TAGS } from './diaryTags'
import './Diary.css'

function DiaryForm({ onSubmit, onCancel, initialEntry }) {
  const { t } = useLanguage()
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
    if (!text.trim()) return setError(t('diary.writeSomething'))
    setError('')
    setLoading(true)
    try {
      await onSubmit({
        text:      text.trim(),
        tags,
        timestamp: Timestamp.fromDate(new Date(timestampStr)),
      })
    } catch {
      setError(t('form.saveFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="tracker-form">
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
        <label>{t('diary.entry')}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('diary.entryPlaceholder')}
          rows={4}
          required
        />
      </div>

      <div className="form-group">
        <label>
          {t('diary.tags')} <span className="form-hint">{t('diary.tagsHint')}</span>
        </label>
        <div className="tag-picker">
          {DIARY_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-chip${tags.includes(tag) ? ' tag-chip-active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {t(`tag.${tag}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          {t('form.cancel')}
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t('form.saving') : initialEntry ? t('form.update') : t('diary.addEntryBtn')}
        </button>
      </div>
    </form>
  )
}

export default DiaryForm
