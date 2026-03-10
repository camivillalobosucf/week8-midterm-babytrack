import { useLanguage } from '../../context/LanguageContext'
import { formatTime, formatDate } from '../../utils/formatters'
import './Diaper.css'

function DiaperEntry({ entry, onEdit, onDelete }) {
  const { t } = useLanguage()

  const TYPE_LABEL = {
    wet:   `💧 ${t('diaper.wet')}`,
    dirty: `💩 ${t('diaper.dirty')}`,
    both:  `💧💩 ${t('diaper.both')}`,
  }

  return (
    <div className="entry-card diaper-entry">
      <div className="entry-main">
        <span className="entry-type-badge diaper-badge">
          {TYPE_LABEL[entry.type] ?? entry.type}
        </span>
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

export default DiaperEntry
