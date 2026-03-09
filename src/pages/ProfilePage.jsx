import { useState, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import { calculateAge } from '../utils/babyAge'
import './ProfilePage.css'

const BLOOD_TYPES = ['', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']

function ProfilePage() {
  const { profile, loading, save } = useProfile()

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
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Failed to save. Please try again.')
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
        <p className="loading-text">Loading…</p>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form-card">
          {error  && <div className="form-error">{error}</div>}
          {saved  && <div className="profile-saved">✅ Profile saved!</div>}

          {/* Basic info */}
          <h3 className="profile-section-title">👶 Basic Info</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Baby&apos;s Name</label>
              <input
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder="e.g. Emma"
              />
            </div>
            <div className="form-group">
              <label>Date of Birth 🎂</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Prefer not to say</option>
                <option value="girl">Girl 🎀</option>
                <option value="boy">Boy 💙</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Type 🩸</label>
              <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                {BLOOD_TYPES.map((t) => (
                  <option key={t} value={t}>{t || 'Unknown'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Birth measurements */}
          <h3 className="profile-section-title" style={{ marginTop: '1.5rem' }}>
            📏 Birth Measurements
          </h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Birth Weight ⚖️</label>
              <input
                type="text"
                value={birthWeight}
                onChange={(e) => setBirthWeight(e.target.value)}
                placeholder="e.g. 3.5 kg"
              />
            </div>
            <div className="form-group">
              <label>Birth Length 📏</label>
              <input
                type="text"
                value={birthLength}
                onChange={(e) => setBirthLength(e.target.value)}
                placeholder="e.g. 50 cm"
              />
            </div>
          </div>

          {/* Health */}
          <h3 className="profile-section-title" style={{ marginTop: '1.5rem' }}>
            🏥 Health
          </h3>
          <div className="form-group">
            <label>Pediatrician 👨‍⚕️</label>
            <input
              type="text"
              value={pediatrician}
              onChange={(e) => setPediatrician(e.target.value)}
              placeholder="Dr. name or clinic"
            />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Allergies / Intolerances ⚠️</label>
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="List any known allergies..."
              rows={2}
            />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Notes 📝</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other important notes..."
              rows={3}
            />
          </div>

          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
              {saving ? 'Saving…' : '💾 Save Profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProfilePage
