import { useState, useMemo } from 'react'
import { useDiary } from '../hooks/useDiary'
import { useLanguage } from '../context/LanguageContext'
import DiaryEntry from '../components/diary/DiaryEntry'
import DiaryForm from '../components/diary/DiaryForm'
import Modal from '../components/layout/Modal'
import '../components/diary/Diary.css'

function DiaryPage() {
  const { t } = useLanguage()
  const { entries, loading, error, add, update, remove } = useDiary()
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [activeTag,    setActiveTag]    = useState(null)

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
    if (window.confirm(t('diary.deleteConfirm'))) await remove(id)
  }

  function handleTagFilter(tag) {
    setActiveTag((prev) => (prev === tag ? null : tag))
  }

  const usedTags = useMemo(() => {
    const set = new Set()
    entries.forEach((e) => e.tags?.forEach((tag) => set.add(tag)))
    return [...set].sort()
  }, [entries])

  const visibleEntries = activeTag
    ? entries.filter((e) => e.tags?.includes(activeTag))
    : entries

  return (
    <div className="tracker-page">
      <div className="tracker-page-header">
        <div>
          <h1 className="page-title">{t('diary.pageTitle')}</h1>
          <p className="page-subtitle">{t('diary.pageSubtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>{t('diary.addBtn')}</button>
      </div>

      {loading  && <p className="loading-text">{t('dash.loading')}</p>}
      {error    && <p className="error-text">{error}</p>}

      {!loading && usedTags.length > 0 && (
        <div className="diary-filter-bar">
          <button
            className={`tag-chip diary-filter-chip${activeTag === null ? ' diary-filter-chip-active' : ''}`}
            onClick={() => setActiveTag(null)}
          >
            {t('diary.filterAll')}
          </button>
          {usedTags.map((tag) => (
            <button
              key={tag}
              className={`tag-chip diary-filter-chip${activeTag === tag ? ' diary-filter-chip-active' : ''}`}
              onClick={() => handleTagFilter(tag)}
            >
              {t(`tag.${tag}`)}
            </button>
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <p className="empty-text">{t('diary.empty')}</p>
      )}
      {!loading && entries.length > 0 && visibleEntries.length === 0 && (
        <p className="empty-text">{t('diary.noTagEntries')}</p>
      )}

      <div className="entry-list">
        {visibleEntries.map((entry) => (
          <DiaryEntry
            key={entry.id}
            entry={entry}
            onEdit={openEdit}
            onDelete={handleDelete}
            onTagFilter={handleTagFilter}
            activeTag={activeTag}
          />
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEntry ? t('diary.editModal') : t('diary.logModal')}
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
