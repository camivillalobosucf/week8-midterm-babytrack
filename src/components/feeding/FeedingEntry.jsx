import { useLanguage } from '../../context/LanguageContext'
import { formatTime, formatDate, formatDuration } from '../../utils/formatters'
import './Feeding.css'

function FeedingEntry({ entry, onEdit, onDelete }) {
  const { t } = useLanguage()

  const TYPE_LABEL = {
    breast: `🤱 ${t('feeding.breast')}`,
    bottle: `🍼 ${t('feeding.bottle')}`,
    solid:  `🥣 ${t('feeding.solid')}`,
  }

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
          <button className="btn-action" onClick={() => onEdit(entry)}>{t('action.edit')}</button>
          <button className="btn-action btn-action-delete" onClick={() => onDelete(entry.id)}>
            {t('action.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedingEntry
