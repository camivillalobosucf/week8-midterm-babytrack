import { useState } from 'react'
import { useSleeps } from '../hooks/useSleeps'
import SleepAnalytics from '../components/sleep/SleepAnalytics'
import SleepEntry from '../components/sleep/SleepEntry'
import SleepForm from '../components/sleep/SleepForm'
import Modal from '../components/layout/Modal'

function SleepPage() {
  const { entries, loading, error, add, update, remove } = useSleeps()
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
    if (window.confirm('Delete this sleep entry?')) await remove(id)
  }

  return (
    <div className="tracker-page">
      <div className="tracker-page-header">
        <div>
          <h1 className="page-title">Sleep</h1>
          <p className="page-subtitle">Record naps and overnight sleep sessions</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add</button>
      </div>

      {!loading && <SleepAnalytics entries={entries} />}

      {loading  && <p className="loading-text">Loading…</p>}
      {error    && <p className="error-text">{error}</p>}
      {!loading && entries.length === 0 && (
        <p className="empty-text">No sleep sessions logged yet. Tap + Add to get started.</p>
      )}

      <div className="entry-list">
        {entries.map((entry) => (
          <SleepEntry
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
        title={editingEntry ? 'Edit Sleep Session' : 'Log Sleep Session'}
      >
        <SleepForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          initialEntry={editingEntry}
        />
      </Modal>
    </div>
  )
}

export default SleepPage
