import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { UserProfile } from '../types';
import { saveUserProfile } from '../services/firestore';
import { getCurrentUser } from '../services/auth';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateProfile = async (newProfile: UserProfile) => {
    const user = getCurrentUser();
    if (user) {
      await saveUserProfile(user.uid, newProfile);
    }
  };

  return { profile, updateProfile, loading };
};
