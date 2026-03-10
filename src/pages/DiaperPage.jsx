import { useState } from 'react'
import { useDiapers } from '../hooks/useDiapers'
import { useLanguage } from '../context/LanguageContext'
import DiaperAnalytics from '../components/diaper/DiaperAnalytics'
import DiaperEntry from '../components/diaper/DiaperEntry'
import DiaperForm from '../components/diaper/DiaperForm'
import Modal from '../components/layout/Modal'

function DiaperPage() {
  const { t } = useLanguage()
  const { entries, loading, error, add, update, remove } = useDiapers()
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  function openAdd() { setEditingEntry(null); setModalOpen(true) }
  function openEdit(entry) { setEditingEntry(entry); setModalOpen(true) }

  async function handleSubmit(data) {
    if (editingEntry) { await update(editingEntry.id, data) } else { await add(data) }
    setModalOpen(false)
  }

  async function handleDelete(id) {
    if (window.confirm(t('diaper.deleteConfirm'))) await remove(id)
  }

  return (
    <div className="tracker-page">
      <div className="tracker-page-header">
        <div>
          <h1 className="page-title">{t('diaper.pageTitle')}</h1>
          <p className="page-subtitle">{t('diaper.pageSubtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>{t('diaper.add')}</button>
      </div>

      {!loading && <DiaperAnalytics entries={entries} />}
      {loading  && <p className="loading-text">{t('dash.loading')}</p>}
      {error    && <p className="error-text">{error}</p>}
      {!loading && entries.length === 0 && <p className="empty-text">{t('diaper.empty')}</p>}

      <div className="entry-list">
        {entries.map((entry) => (
          <DiaperEntry key={entry.id} entry={entry} onEdit={openEdit} onDelete={handleDelete} />
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editingEntry ? t('diaper.editModal') : t('diaper.logModal')}>
        <DiaperForm onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} initialEntry={editingEntry} />
      </Modal>
    </div>
  )
}

export default DiaperPage
