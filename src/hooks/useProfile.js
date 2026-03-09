import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import db from '../firebase/firestore'
import { saveProfile } from '../services/profileService'

export function useProfile() {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (snap) => {
        setProfile(snap.exists() ? snap.data() : {})
        setLoading(false)
      },
      () => setLoading(false)
    )

    return unsubscribe
  }, [currentUser])

  const save = (data) => saveProfile(currentUser.uid, data)

  return { profile, loading, save }
}
