import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import db from '../firebase/firestore'

function sleepsRef(userId) {
  return collection(db, 'users', userId, 'sleeps')
}

// data shape: { startTime, endTime, duration, quality, notes, timestamp }
// timestamp should equal startTime for consistent ordering across all trackers
export function addSleep(userId, data) {
  return addDoc(sleepsRef(userId), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export function updateSleep(userId, entryId, data) {
  return updateDoc(doc(db, 'users', userId, 'sleeps', entryId), data)
}

export function deleteSleep(userId, entryId) {
  return deleteDoc(doc(db, 'users', userId, 'sleeps', entryId))
}
