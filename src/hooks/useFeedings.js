import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import db from '../firebase/firestore'
import { addFeeding, updateFeeding, deleteFeeding } from '../services/feedingService'

export function useFeedings() {
  const { currentUser } = useAuth()
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'users', currentUser.uid, 'feedings'),
      orderBy('timestamp', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setEntries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [currentUser])

  const add    = (data)         => addFeeding(currentUser.uid, data)
  const update = (id, data)     => updateFeeding(currentUser.uid, id, data)
  const remove = (id)           => deleteFeeding(currentUser.uid, id)

  return { entries, loading, error, add, update, remove }
}
