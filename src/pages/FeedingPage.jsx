import { useState } from 'react'
import { useFeedings } from '../hooks/useFeedings'
import { useLanguage } from '../context/LanguageContext'
import FeedingAnalytics from '../components/feeding/FeedingAnalytics'
import FeedingEntry from '../components/feeding/FeedingEntry'
import FeedingForm from '../components/feeding/FeedingForm'
import Modal from '../components/layout/Modal'

function FeedingPage() {
  const { t } = useLanguage()
  const { entries, loading, error, add, update, remove } = useFeedings()
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  function openAdd() { setEditingEntry(null); setModalOpen(true) }
  function openEdit(entry) { setEditingEntry(entry); setModalOpen(true) }

  async function handleSubmit(data) {
    if (editingEntry) { await update(editingEntry.id, data) } else { await add(data) }
    setModalOpen(false)
  }

  async function handleDelete(id) {
    if (window.confirm(t('feeding.deleteConfirm'))) await remove(id)
  }

  return (
    <div className="tracker-page">
      <div className="tracker-page-header">
        <div>
          <h1 className="page-title">{t('feeding.pageTitle')}</h1>
          <p className="page-subtitle">{t('feeding.pageSubtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>{t('feeding.add')}</button>
      </div>

      {!loading && <FeedingAnalytics entries={entries} />}
      {loading  && <p className="loading-text">{t('dash.loading')}</p>}
      {error    && <p className="error-text">{error}</p>}
      {!loading && entries.length === 0 && <p className="empty-text">{t('feeding.empty')}</p>}

      <div className="entry-list">
        {entries.map((entry) => (
          <FeedingEntry key={entry.id} entry={entry} onEdit={openEdit} onDelete={handleDelete} />
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editingEntry ? t('feeding.editModal') : t('feeding.logModal')}>
        <FeedingForm onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} initialEntry={editingEntry} />
      </Modal>
    </div>
  )
}

export default FeedingPage
