import { useLanguage } from '../../context/LanguageContext'
import { formatDateTime } from '../../utils/formatters'
import './Diary.css'

function DiaryEntry({ entry, onEdit, onDelete, onTagFilter, activeTag }) {
  const { t } = useLanguage()

  return (
    <div className="diary-entry-card">
      <div className="diary-entry-header">
        <span className="entry-time">{formatDateTime(entry.timestamp)}</span>
        <div className="entry-actions">
          <button className="btn-action" onClick={() => onEdit(entry)}>{t('action.edit')}</button>
          <button className="btn-action btn-action-delete" onClick={() => onDelete(entry.id)}>
            {t('action.delete')}
          </button>
        </div>
      </div>

      <p className="diary-entry-text">{entry.text}</p>

      {entry.tags?.length > 0 && (
        <div className="diary-tags">
          {entry.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-chip tag-chip-display${activeTag === tag ? ' tag-chip-display-active' : ''}`}
              onClick={() => onTagFilter?.(tag)}
              title={t(`tag.${tag}`)}
            >
              {t(`tag.${tag}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiaryEntry
