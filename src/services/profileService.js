import { doc, setDoc } from 'firebase/firestore'
import db from '../firebase/firestore'

// Baby profile is stored directly on the user document: users/{userId}
// Fields: babyName, dob, gender, birthWeight, birthLength, bloodType, pediatrician, allergies, notes

export function saveProfile(userId, data) {
  return setDoc(doc(db, 'users', userId), data, { merge: true })
}
