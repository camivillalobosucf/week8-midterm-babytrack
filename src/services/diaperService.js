import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import db from '../firebase/firestore'

function diapersRef(userId) {
  return collection(db, 'users', userId, 'diapers')
}

// data shape: { type, notes, timestamp }
export function addDiaper(userId, data) {
  return addDoc(diapersRef(userId), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export function updateDiaper(userId, entryId, data) {
  return updateDoc(doc(db, 'users', userId, 'diapers', entryId), data)
}

export function deleteDiaper(userId, entryId) {
  return deleteDoc(doc(db, 'users', userId, 'diapers', entryId))
}
