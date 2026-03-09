import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import db from '../firebase/firestore'

// Reference to a user's feedings sub-collection
function feedingsRef(userId) {
  return collection(db, 'users', userId, 'feedings')
}

// Add a new feeding entry
// data shape: { type, amount, duration, side, notes, timestamp }
export function addFeeding(userId, data) {
  return addDoc(feedingsRef(userId), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

// Update an existing feeding entry
export function updateFeeding(userId, entryId, data) {
  return updateDoc(doc(db, 'users', userId, 'feedings', entryId), data)
}

// Delete a feeding entry
export function deleteFeeding(userId, entryId) {
  return deleteDoc(doc(db, 'users', userId, 'feedings', entryId))
}
