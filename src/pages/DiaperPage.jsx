import { useState } from 'react'
import { useDiapers } from '../hooks/useDiapers'
import DiaperAnalytics from '../components/diaper/DiaperAnalytics'
import DiaperEntry from '../components/diaper/DiaperEntry'
import DiaperForm from '../components/diaper/DiaperForm'
import Modal from '../components/layout/Modal'

function DiaperPage() {
  const { entries, loading, error, add, update, remove } = useDiapers()
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  function openAdd() {
    setEditingEntry(null)
    setModalOpen(true)
  }

  function openEdit(entry) {
    setEditingEntry(entry)
    setModalOpen(true)
  }

  async function handleSubmit(data) {
    if (editingEntry) {
      await update(editingEntry.id, data)
    } else {
      await add(data)
    }
    setModalOpen(false)
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this diaper entry?')) await remove(id)
  }

  return (
    <div className="tracker-page">
      <div className="tracker-page-header">
        <div>
          <h1 className="page-title">🧷 Diapers</h1>
          <p className="page-subtitle">Log wet and dirty diaper changes</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add</button>
      </div>

      {!loading && <DiaperAnalytics entries={entries} />}

      {loading  && <p className="loading-text">Loading…</p>}
      {error    && <p className="error-text">{error}</p>}
      {!loading && entries.length === 0 && (
        <p className="empty-text">No diapers logged yet. Tap + Add to get started.</p>
      )}

      <div className="entry-list">
        {entries.map((entry) => (
          <DiaperEntry
            key={entry.id}
            entry={entry}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEntry ? 'Edit Diaper' : 'Log Diaper Change'}
      >
        <DiaperForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          initialEntry={editingEntry}
        />
      </Modal>
    </div>
  )
}

export default DiaperPage
