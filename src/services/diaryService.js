import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import db from '../firebase/firestore'

function diaryRef(userId) {
  return collection(db, 'users', userId, 'diary')
}

// data shape: { text, tags, timestamp }
export function addDiaryEntry(userId, data) {
  return addDoc(diaryRef(userId), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export function updateDiaryEntry(userId, entryId, data) {
  return updateDoc(doc(db, 'users', userId, 'diary', entryId), data)
}

export function deleteDiaryEntry(userId, entryId) {
  return deleteDoc(doc(db, 'users', userId, 'diary', entryId))
}
