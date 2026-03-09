import { formatDateTime } from '../../utils/formatters'
import './Diary.css'

function DiaryEntry({ entry, onEdit, onDelete }) {
  return (
    <div className="diary-entry-card">
      <div className="diary-entry-header">
        <span className="entry-time">{formatDateTime(entry.timestamp)}</span>
        <div className="entry-actions">
          <button className="btn-action" onClick={() => onEdit(entry)}>Edit</button>
          <button className="btn-action btn-action-delete" onClick={() => onDelete(entry.id)}>
            Delete
          </button>
        </div>
      </div>

      <p className="diary-entry-text">{entry.text}</p>

      {entry.tags?.length > 0 && (
        <div className="diary-tags">
          {entry.tags.map((tag) => (
            <span key={tag} className="tag-chip tag-chip-display">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiaryEntry
