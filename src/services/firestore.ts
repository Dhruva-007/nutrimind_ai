import { doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, getDocs, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, MealLog } from '../types';

export const saveUserProfile = async (uid: string, profile: UserProfile): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, profile, { merge: true });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
};

export const saveMealLog = async (uid: string, meal: Omit<MealLog, 'id'>): Promise<string> => {
  const mealsRef = collection(db, 'users', uid, 'meals');
  const docRef = await addDoc(mealsRef, meal);
  return docRef.id;
};

export const getMealHistory = async (uid: string, limitCount: number = 20): Promise<MealLog[]> => {
  const mealsRef = collection(db, 'users', uid, 'meals');
  const q = query(mealsRef, orderBy('timestamp', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MealLog));
};

export const updateFeedback = async (uid: string, mealId: string, feedback: MealLog['userFeedback']): Promise<void> => {
  const mealRef = doc(db, 'users', uid, 'meals', mealId);
  await updateDoc(mealRef, { userFeedback: feedback });
};

export const getRecentMeals = async (uid: string, hours: number = 8): Promise<MealLog[]> => {
  const mealsRef = collection(db, 'users', uid, 'meals');
  const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
  
  // Requires composite index: uid + timestamp DESC
  const q = query(
    mealsRef, 
    where('timestamp', '>=', cutoffTime),
    orderBy('timestamp', 'desc')
  );
  
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MealLog));
};
