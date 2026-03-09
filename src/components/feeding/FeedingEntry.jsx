import { formatTime, formatDate, formatDuration } from '../../utils/formatters'
import './Feeding.css'

const TYPE_LABEL = { breast: '🤱 Breast', bottle: '🍼 Bottle', solid: '🥣 Solid' }

function FeedingEntry({ entry, onEdit, onDelete }) {
  const detail = () => {
    if (entry.type === 'breast') {
      const parts = []
      if (entry.side)     parts.push(entry.side.charAt(0).toUpperCase() + entry.side.slice(1))
      if (entry.duration) parts.push(formatDuration(entry.duration))
      return parts.join(' · ')
    }
    if (entry.type === 'bottle' || entry.type === 'solid') {
      return entry.amount ? `${entry.amount} ml` : ''
    }
    return ''
  }

  return (
    <div className="entry-card feeding-entry">
      <div className="entry-main">
        <span className="entry-type-badge feeding-badge">
          {TYPE_LABEL[entry.type] ?? entry.type}
        </span>
        {detail() && <span className="entry-detail">{detail()}</span>}
        {entry.notes && <span className="entry-notes">— {entry.notes}</span>}
      </div>
      <div className="entry-footer">
        <span className="entry-time">
          {formatTime(entry.timestamp)} &middot; {formatDate(entry.timestamp)}
        </span>
        <div className="entry-actions">
          <button className="btn-action" onClick={() => onEdit(entry)}>Edit</button>
          <button className="btn-action btn-action-delete" onClick={() => onDelete(entry.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedingEntry
