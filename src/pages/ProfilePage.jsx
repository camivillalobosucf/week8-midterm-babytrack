import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { useLanguage } from '../context/LanguageContext'
import { calculateAge } from '../utils/babyAge'
import './ProfilePage.css'

const BLOOD_TYPES = ['', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']

function ProfilePage() {
  const { logout } = useAuth()
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

  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState('')

  // Populate form once profile loads
  useEffect(() => {
    if (!loading && profile) {
      setBabyName(profile.babyName     ?? '')
      setDob(profile.dob               ?? '')
      setGender(profile.gender         ?? '')
      setBirthWeight(profile.birthWeight ?? '')
      setBirthLength(profile.birthLength ?? '')
      setBloodType(profile.bloodType   ?? '')
      setPediatrician(profile.pediatrician ?? '')
      setAllergies(profile.allergies   ?? '')
      setNotes(profile.notes           ?? '')
    }
  }, [loading, profile])

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
        language,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError(t('profile.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const age = calculateAge(dob)

  return (
    <div className="profile-page">
      {/* Header card */}
      <div className="profile-header">
        <div className="profile-avatar">👶</div>
        {babyName
          ? <h2 className="profile-baby-name">{babyName}</h2>
          : <h2 className="profile-baby-name profile-baby-placeholder">Your baby&apos;s name</h2>
        }
        {age && <p className="profile-baby-age">{age}</p>}
      </div>

      {loading ? (
        <p className="loading-text">{t('profile.loading')}</p>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form-card">
          {error  && <div className="form-error">{error}</div>}
          {saved  && <div className="profile-saved">{t('profile.saved')}</div>}

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
              />
            </div>
            <div className="form-group">
              <label>{t('profile.dob')}</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('profile.gender')}</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">{t('gender.unknown')}</option>
                <option value="girl">{t('gender.girl')}</option>
                <option value="boy">{t('gender.boy')}</option>
                <option value="other">{t('gender.other')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('profile.bloodType')}</label>
              <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                {BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>{bt || t('gender.unknown')}</option>
                ))}
              </select>
            </div>
          </div>

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
              />
            </div>
            <div className="form-group">
              <label>{t('profile.birthLength')}</label>
              <input
                type="text"
                value={birthLength}
                onChange={(e) => setBirthLength(e.target.value)}
                placeholder={t('profile.birthLengthPlaceholder')}
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
            />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>{t('profile.allergies')}</label>
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder={t('profile.allergiesPlaceholder')}
              rows={2}
            />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>{t('profile.notes')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('profile.notesPlaceholder')}
              rows={3}
            />
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

          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
              {saving ? t('profile.saving') : t('profile.saveBtn')}
            </button>
          </div>

          <div className="profile-logout">
            <button type="button" onClick={handleLogout} className="btn btn-outline btn-full">
              {t('profile.logout')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProfilePage
