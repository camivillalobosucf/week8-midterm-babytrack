import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from 'firebase/auth'
import auth from '../firebase/auth'
import { deleteDoc, doc } from 'firebase/firestore'
import db from '../firebase/firestore'
import { useProfile } from '../hooks/useProfile'
import { useLanguage } from '../context/LanguageContext'
import { calculateAge } from '../utils/babyAge'
import Modal from '../components/layout/Modal'
import './ProfilePage.css'

const BLOOD_TYPES = ['', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']

const EMOJI_PRESETS = [
  '👶','🌟','💕','🎀','🦋','⭐','🌈','🍼','💫','🌸',
  '🌻','🎂','🎈','🦄','🐣','💝','🌙','✨','🐥','🐰',
  '🍓','🌺','💛','🎠','🦁','🐻','🌼','🏆','💙','🩷',
]

function ProfilePage() {
  const { logout, deleteAccount, currentUser } = useAuth()
  const navigate   = useNavigate()
  const { profile, loading, save } = useProfile()
  const { t, language, setLanguage } = useLanguage()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const [babyName,     setBabyName]     = useState('')
  const [dob,          setDob]          = useState('')
  const [gender,       setGender]       = useState('')
  const [birthWeight,  setBirthWeight]  = useState('')
  const [birthLength,  setBirthLength]  = useState('')
  const [bloodType,    setBloodType]    = useState('')
  const [pediatrician, setPediatrician] = useState('')
  const [allergies,    setAllergies]    = useState('')
  const [notes,        setNotes]        = useState('')
  const [emojiLeft,    setEmojiLeft]    = useState('')
  const [emojiRight,   setEmojiRight]   = useState('')

  const [saving,         setSaving]         = useState(false)
  const [saved,          setSaved]          = useState(false)
  const [error,          setError]          = useState('')
  const [isEditing,      setIsEditing]      = useState(false)
  const [deleting,         setDeleting]         = useState(false)
  const [deleteError,      setDeleteError]      = useState('')
  const [showDeleteModal,  setShowDeleteModal]  = useState(false)
  const [deleteEmailInput, setDeleteEmailInput] = useState('')

  // Account section state
  const [displayName,      setDisplayName]      = useState(currentUser?.displayName ?? '')
  const [accountEditing,   setAccountEditing]   = useState(false)
  const [accountSaving,    setAccountSaving]    = useState(false)
  const [accountSaved,     setAccountSaved]     = useState(false)
  const [accountError,     setAccountError]     = useState('')

  // Populate form once profile loads; auto-enter edit mode if no profile yet
  useEffect(() => {
    if (!loading) {
      if (profile) {
        setBabyName(profile.babyName       ?? '')
        setDob(profile.dob                 ?? '')
        setGender(profile.gender           ?? '')
        setBirthWeight(profile.birthWeight ?? '')
        setBirthLength(profile.birthLength ?? '')
        setBloodType(profile.bloodType     ?? '')
        setPediatrician(profile.pediatrician ?? '')
        setAllergies(profile.allergies     ?? '')
        setNotes(profile.notes             ?? '')
        setEmojiLeft(profile.emojiLeft     ?? '')
        setEmojiRight(profile.emojiRight   ?? '')
      } else {
        setIsEditing(true)
      }
    }
  }, [loading, profile])

  function resetToProfile() {
    setBabyName(profile?.babyName       ?? '')
    setDob(profile?.dob                 ?? '')
    setGender(profile?.gender           ?? '')
    setBirthWeight(profile?.birthWeight ?? '')
    setBirthLength(profile?.birthLength ?? '')
    setBloodType(profile?.bloodType     ?? '')
    setPediatrician(profile?.pediatrician ?? '')
    setAllergies(profile?.allergies     ?? '')
    setNotes(profile?.notes             ?? '')
    setEmojiLeft(profile?.emojiLeft     ?? '')
    setEmojiRight(profile?.emojiRight   ?? '')
  }

  function handleCancelEdit() {
    resetToProfile()
    setIsEditing(false)
  }

  async function handleAccountSave(e) {
    e.preventDefault()
    setAccountError('')
    setAccountSaving(true)
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() || null })
      setAccountSaved(true)
      setAccountEditing(false)
      setTimeout(() => setAccountSaved(false), 2500)
    } catch {
      setAccountError(t('profile.accountSaveFailed'))
    } finally {
      setAccountSaving(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await save({
        babyName:     babyName.trim(),
        dob,
        gender,
        birthWeight:  birthWeight.trim(),
        birthLength:  birthLength.trim(),
        bloodType,
        pediatrician: pediatrician.trim(),
        allergies:    allergies.trim(),
        notes:        notes.trim(),
        emojiLeft,
        emojiRight,
        language,
      })
      setSaved(true)
      setIsEditing(false)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError(t('profile.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const age = calculateAge(dob, t)

  const memberSince = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString(
        language === 'es' ? 'es-MX' : 'en-US',
        { year: 'numeric', month: 'long' }
      )
    : null

  function openDeleteModal() {
    setDeleteEmailInput('')
    setDeleteError('')
    setShowDeleteModal(true)
  }

  function closeDeleteModal() {
    setShowDeleteModal(false)
    setDeleteEmailInput('')
    setDeleteError('')
  }

  async function confirmDelete() {
    setDeleteError('')
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid))
    } catch {
      // Non-fatal — proceed with auth deletion even if Firestore cleanup fails
    }
    try {
      await deleteAccount()
      navigate('/login')
    } catch (err) {
      setDeleting(false)
      if (err.code === 'auth/requires-recent-login') {
        setDeleteError(t('profile.deleteRecentLogin'))
      } else {
        setDeleteError(t('profile.deleteFailed'))
      }
    }
  }

  return (
    <div className="profile-page">
      {/* Header card */}
      <div className="profile-header">
        <div className="profile-header-row">
          <span className="profile-header-emoji">{emojiLeft || '👶'}</span>
          <div className="profile-header-center">
            {babyName
              ? <h2 className="profile-baby-name">{babyName}</h2>
              : <h2 className="profile-baby-name profile-baby-placeholder">{t('profile.nameFallback')}</h2>
            }
            {age && <p className="profile-baby-age">{age}</p>}
          </div>
          <span className="profile-header-emoji">{emojiRight || '⭐'}</span>
        </div>
      </div>

      {/* Account card */}
      <form onSubmit={handleAccountSave} className={`profile-account-card${accountEditing ? '' : ' view-mode'}`}>
        <div className="profile-account-header">
          <h3 className="profile-section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>
            {t('profile.accountInfo')}
          </h3>
          {!accountEditing && (
            <button type="button" className="profile-edit-btn" onClick={() => setAccountEditing(true)}>
              ✏️ {t('profile.editAccount')}
            </button>
          )}
        </div>
        {accountError && <div className="form-error">{accountError}</div>}
        {accountSaved && <div className="profile-saved">{t('profile.accountSaved')}</div>}

        <div className="profile-grid" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>{t('profile.displayName')}</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('profile.displayNamePlaceholder')}
              readOnly={!accountEditing}
            />
          </div>
          <div className="form-group">
            <label>{t('profile.email')}</label>
            <input
              type="email"
              value={currentUser?.email ?? ''}
              readOnly
              title={t('profile.emailReadOnly')}
            />
          </div>
          {memberSince && (
            <div className="form-group">
              <label>{t('profile.memberSince')}</label>
              <input type="text" value={memberSince} readOnly />
            </div>
          )}
        </div>

        {/* Language selector */}
        <h3 className="profile-section-title" style={{ marginTop: '1.5rem' }}>
          {t('profile.language')}
        </h3>
        <div className="profile-lang-row">
          <button
            type="button"
            className={'profile-lang-btn' + (language === 'en' ? ' profile-lang-active' : '')}
            onClick={() => setLanguage('en')}
          >English</button>
          <button
            type="button"
            className={'profile-lang-btn' + (language === 'es' ? ' profile-lang-active' : '')}
            onClick={() => setLanguage('es')}
          >Español</button>
        </div>

        {accountEditing && (
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => { setDisplayName(currentUser?.displayName ?? ''); setAccountEditing(false); setAccountError('') }}
            >
              {t('form.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={accountSaving}>
              {accountSaving ? t('profile.saving') : t('profile.saveBtn')}
            </button>
          </div>
        )}
      </form>

      {loading ? (
        <p className="loading-text">{t('profile.loading')}</p>
      ) : (
        <form onSubmit={handleSubmit} className={`profile-form-card${isEditing ? '' : ' view-mode'}`}>
          {error && <div className="form-error">{error}</div>}
          {saved && <div className="profile-saved">{t('profile.saved')}</div>}

          {!isEditing && (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️ {t('profile.editBtn')}
            </button>
          )}

          {/* Basic info */}
          <h3 className="profile-section-title">{t('profile.basicInfo')}</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>{t('profile.babyName')}</label>
              <input
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder={t('profile.babyNamePlaceholder')}
                readOnly={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>{t('profile.dob')}</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>{t('profile.gender')}</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={!isEditing}>
                <option value="girl">{t('gender.girl')}</option>
                <option value="boy">{t('gender.boy')}</option>
                <option value="neutral">{t('gender.neutral')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('profile.bloodType')}</label>
              <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} disabled={!isEditing}>
                {BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>{bt || t('gender.unknown')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Emoji personalization — edit mode only */}
          {isEditing && (
            <>
              <h3 className="profile-section-title" style={{ marginTop: '1.5rem' }}>
                {t('profile.chooseEmoji')}
              </h3>
              <div className="emoji-pick-row">
                {[['left', emojiLeft, setEmojiLeft], ['right', emojiRight, setEmojiRight]].map(([side, val, setter]) => (
                  <div key={side} className="emoji-pick-side">
                    <span className="emoji-pick-label">
                      {side === 'left' ? t('profile.emojiLeft') : t('profile.emojiRight')}
                    </span>
                    <div className="emoji-pick-current">{val || (side === 'left' ? '👶' : '⭐')}</div>
                    <div className="emoji-pick-grid">
                      {EMOJI_PRESETS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          className={`emoji-pick-btn${val === em ? ' emoji-pick-btn-active' : ''}`}
                          onClick={() => setter(em)}
                        >{em}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Birth measurements */}
          <h3 className="profile-section-title" style={{ marginTop: '1.5rem' }}>
            {t('profile.birthMeasurements')}
          </h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>{t('profile.birthWeight')}</label>
              <input
                type="text"
                value={birthWeight}
                onChange={(e) => setBirthWeight(e.target.value)}
                placeholder={t('profile.birthWeightPlaceholder')}
                readOnly={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>{t('profile.birthLength')}</label>
              <input
                type="text"
                value={birthLength}
                onChange={(e) => setBirthLength(e.target.value)}
                placeholder={t('profile.birthLengthPlaceholder')}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Health */}
          <h3 className="profile-section-title" style={{ marginTop: '1.5rem' }}>
            {t('profile.health')}
          </h3>
          <div className="form-group">
            <label>{t('profile.pediatrician')}</label>
            <input
              type="text"
              value={pediatrician}
              onChange={(e) => setPediatrician(e.target.value)}
              placeholder={t('profile.pediatricianPlaceholder')}
              readOnly={!isEditing}
            />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>{t('profile.allergies')}</label>
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder={t('profile.allergiesPlaceholder')}
              rows={2}
              readOnly={!isEditing}
            />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>{t('profile.notes')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('profile.notesPlaceholder')}
              rows={3}
              readOnly={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
                {t('form.cancel')}
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? t('profile.saving') : t('profile.saveBtn')}
              </button>
            </div>
          )}

          <div className="profile-logout">
            <button type="button" onClick={handleLogout} className="btn btn-outline btn-full">
              {t('profile.logout')}
            </button>
          </div>

          <div className="profile-danger-zone">
            <h3 className="profile-section-title profile-danger-title">{t('profile.dangerZone')}</h3>
            {deleteError && <div className="form-error">{deleteError}</div>}
            <button
              type="button"
              className="btn btn-danger btn-full"
              onClick={openDeleteModal}
              disabled={deleting}
            >
              {t('profile.deleteAccount')}
            </button>
          </div>
        </form>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title={t('profile.deleteModalTitle')}
      >
        <div className="delete-modal-body">
          <p className="delete-modal-warning">{t('profile.deleteModalWarning')}</p>
          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label className="delete-modal-label">{t('profile.deleteEmailLabel')}</label>
            <input
              type="email"
              value={deleteEmailInput}
              onChange={(e) => setDeleteEmailInput(e.target.value)}
              placeholder={currentUser?.email ?? ''}
              autoComplete="off"
              autoFocus
            />
          </div>
          {deleteError && <div className="form-error" style={{ marginTop: '0.75rem' }}>{deleteError}</div>}
          <div className="form-actions" style={{ marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-outline" onClick={closeDeleteModal} disabled={deleting}>
              {t('form.cancel')}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmDelete}
              disabled={deleting || deleteEmailInput !== currentUser?.email}
            >
              {deleting ? t('profile.deleting') : t('profile.deleteConfirmBtn')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProfilePage
