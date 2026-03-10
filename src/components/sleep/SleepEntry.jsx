import { useLanguage } from '../../context/LanguageContext'
import { formatTime, formatDate, formatDuration } from '../../utils/formatters'
import './Sleep.css'

function SleepEntry({ entry, onEdit, onDelete }) {
  const { t } = useLanguage()

  const QUALITY_LABEL = {
    good: `😊 ${t('sleep.good')}`,
    fair: `😐 ${t('sleep.fair')}`,
    poor: `😣 ${t('sleep.poor')}`,
  }

  return (
    <div className="entry-card sleep-entry">
      <div className="entry-main">
        <span className="entry-type-badge sleep-badge">😴 {t('recent.sleep')}</span>
        <span className="entry-detail">{formatDuration(entry.duration)}</span>
        {entry.quality && (
          <span className="entry-type-badge sleep-badge">
            {QUALITY_LABEL[entry.quality] ?? entry.quality}
          </span>
        )}
        {entry.notes && <span className="entry-notes">— {entry.notes}</span>}
      </div>
      <div className="entry-footer">
        <span className="entry-time">
          {formatTime(entry.startTime)} &rarr; {formatTime(entry.endTime)}
          &nbsp;&middot;&nbsp;{formatDate(entry.startTime)}
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

export default SleepEntry
