import { useState } from 'react'
import { useDiary } from '../hooks/useDiary'
import DiaryEntry from '../components/diary/DiaryEntry'
import DiaryForm from '../components/diary/DiaryForm'
import Modal from '../components/layout/Modal'

function DiaryPage() {
  const { entries, loading, error, add, update, remove } = useDiary()
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
    if (window.confirm('Delete this diary entry?')) await remove(id)
  }

  return (
    <div className="tracker-page">
      <div className="tracker-page-header">
        <div>
          <h1 className="page-title">Diary</h1>
          <p className="page-subtitle">Daily notes and observations about your baby</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Entry</button>
      </div>

      {loading  && <p className="loading-text">Loading…</p>}
      {error    && <p className="error-text">{error}</p>}
      {!loading && entries.length === 0 && (
        <p className="empty-text">No diary entries yet. Tap + Add Entry to get started.</p>
      )}

      <div className="entry-list">
        {entries.map((entry) => (
          <DiaryEntry
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
        title={editingEntry ? 'Edit Entry' : 'New Diary Entry'}
      >
        <DiaryForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          initialEntry={editingEntry}
        />
      </Modal>
    </div>
  )
}

export default DiaryPage
