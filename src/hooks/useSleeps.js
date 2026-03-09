import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import db from '../firebase/firestore'
import { addSleep, updateSleep, deleteSleep } from '../services/sleepService'

export function useSleeps() {
  const { currentUser } = useAuth()
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'users', currentUser.uid, 'sleeps'),
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

  const add    = (data)     => addSleep(currentUser.uid, data)
  const update = (id, data) => updateSleep(currentUser.uid, id, data)
  const remove = (id)       => deleteSleep(currentUser.uid, id)

  return { entries, loading, error, add, update, remove }
}
