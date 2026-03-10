import { useState } from 'react'
import { useSleeps } from '../hooks/useSleeps'
import { useLanguage } from '../context/LanguageContext'
import SleepAnalytics from '../components/sleep/SleepAnalytics'
import SleepEntry from '../components/sleep/SleepEntry'
import SleepForm from '../components/sleep/SleepForm'
import Modal from '../components/layout/Modal'

function SleepPage() {
  const { t } = useLanguage()
  const { entries, loading, error, add, update, remove } = useSleeps()
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  function openAdd() { setEditingEntry(null); setModalOpen(true) }
  function openEdit(entry) { setEditingEntry(entry); setModalOpen(true) }

  async function handleSubmit(data) {
    if (editingEntry) { await update(editingEntry.id, data) } else { await add(data) }
    setModalOpen(false)
  }

  async function handleDelete(id) {
    if (window.confirm(t('sleep.deleteConfirm'))) await remove(id)
  }

  return (
    <div className="tracker-page">
      <div className="tracker-page-header">
        <div>
          <h1 className="page-title">{t('sleep.pageTitle')}</h1>
          <p className="page-subtitle">{t('sleep.pageSubtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>{t('sleep.add')}</button>
      </div>

      {!loading && <SleepAnalytics entries={entries} />}
      {loading  && <p className="loading-text">{t('dash.loading')}</p>}
      {error    && <p className="error-text">{error}</p>}
      {!loading && entries.length === 0 && <p className="empty-text">{t('sleep.empty')}</p>}

      <div className="entry-list">
        {entries.map((entry) => (
          <SleepEntry key={entry.id} entry={entry} onEdit={openEdit} onDelete={handleDelete} />
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editingEntry ? t('sleep.editModal') : t('sleep.logModal')}>
        <SleepForm onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} initialEntry={editingEntry} />
      </Modal>
    </div>
  )
}

export default SleepPage
