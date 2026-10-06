import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, getDocFromCache } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, fullName: string, rollNumber: string, classSection: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsGuest: () => void;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse displayName encoding: "fullName|rollNumber|classSection"
  const parseUserProfile = (user: FirebaseUser): UserProfile => {
    const displayName = user.displayName || '';
    const [fullName, rollNumber, classSection] = displayName.split('|');
    return {
      role: 'student',
      fullName: fullName || user.email?.split('@')[0] || 'Student',
      email: user.email || '',
      rollNumber: rollNumber || 'NOT_SET',
      classSection: classSection || 'CS-1'
    };
  };

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Optimistically set parsed profile from Auth state immediately so transitions are instant
        const initialProfile = parseUserProfile(user);
        setUserProfile(initialProfile);
        setLoading(false);

        try {
          // Attempt to check if user has a document in the Firestore "users" collection in the background
          const userDocRef = doc(db, 'users', user.uid);
          let userDocSnap;
          try {
            userDocSnap = await getDoc(userDocRef);
          } catch (err) {
            console.warn('Network issue during initial load, trying cache...', err);
            userDocSnap = await getDocFromCache(userDocRef);
          }
          if (userDocSnap && userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserProfile({
              role: 'student',
              fullName: data.name || data.fullName || user.displayName || initialProfile.fullName,
              email: data.email || user.email || initialProfile.email,
              rollNumber: data.rollNumber || initialProfile.rollNumber,
              classSection: data.classSection || initialProfile.classSection
            });
          }
        } catch (err) {
          console.error('Error fetching user from Firestore on auth state change:', err);
        }
      } else {
        // If there's no firebase user, check if guest session is active in localStorage
        const isGuest = localStorage.getItem('guestSession') === 'true';
        if (isGuest) {
          setUserProfile({
            role: 'guest'
          });
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Signup Flow
  const signup = async (email: string, password: string, fullName: string, rollNumber: string, classSection: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Store custom student profile fields inside displayName as a clean serialized string
      const serializedProfile = `${fullName}|${rollNumber}|${classSection}`;
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      
      // Perform profile update and Firestore document creation in parallel to eliminate sequential delay
      await Promise.all([
        updateProfile(userCredential.user, {
          displayName: serializedProfile
        }),
        setDoc(userDocRef, {
          name: fullName,
          email: email,
          rollNumber: rollNumber,
          classSection: classSection,
          createdAt: new Date().toISOString()
        })
      ]);

      // Clear guest session flag
      localStorage.removeItem('guestSession');
      // Update local state manually for instant transition
      setUserProfile({
        role: 'student',
        fullName,
        email,
        rollNumber,
        classSection
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Login Flow
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.removeItem('guestSession');
      
      const initialProfile = parseUserProfile(userCredential.user);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      
      let userDocSnap;
      try {
        userDocSnap = await getDoc(userDocRef);
      } catch (err: any) {
        console.warn('Network issue or offline client during login, attempting cache retrieval:', err);
        try {
          userDocSnap = await getDocFromCache(userDocRef);
        } catch (cacheErr) {
          console.error('Document not found in offline cache:', cacheErr);
          // Standard/brand new user with no cached profile yet
          throw new Error("Slow network detected. Retrying profile setup...");
        }
      }

      if (userDocSnap && userDocSnap.exists()) {
        const data = userDocSnap.data();
        setUserProfile({
          role: 'student',
          fullName: data.name || data.fullName || userCredential.user.displayName || initialProfile.fullName,
          email: data.email || userCredential.user.email || initialProfile.email,
          rollNumber: data.rollNumber || initialProfile.rollNumber,
          classSection: data.classSection || initialProfile.classSection
        });
      } else {
        setUserProfile(initialProfile);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Google Login Flow
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.removeItem('guestSession');

      const initialProfile = parseUserProfile(user);
      const userDocRef = doc(db, 'users', user.uid);

      let userDocSnap;
      try {
        userDocSnap = await getDoc(userDocRef);
      } catch (err: any) {
        console.warn('Network issue or offline client during Google login, attempting cache retrieval:', err);
        try {
          userDocSnap = await getDocFromCache(userDocRef);
        } catch (cacheErr) {
          console.error('Document not found in offline cache:', cacheErr);
          // Brand new login with no cached copy
          throw new Error("Slow network detected. Retrying profile setup...");
        }
      }

      let profile: UserProfile;

      if (!userDocSnap || !userDocSnap.exists()) {
        const newUserData = {
          name: user.displayName || 'Google Student',
          email: user.email || '',
          rollNumber: 'Pending (Google)',
          classSection: 'Pending',
          createdAt: new Date().toISOString()
        };
        try {
          await setDoc(userDocRef, newUserData);
        } catch (setErr) {
          console.warn('Failed to register user document in offline mode:', setErr);
        }

        profile = {
          role: 'student',
          fullName: newUserData.name,
          email: newUserData.email,
          rollNumber: newUserData.rollNumber,
          classSection: newUserData.classSection
        };
      } else {
        const data = userDocSnap.data();
        profile = {
          role: 'student',
          fullName: data.name || data.fullName || user.displayName || 'Google Student',
          email: data.email || user.email || '',
          rollNumber: data.rollNumber || 'Pending (Google)',
          classSection: data.classSection || 'Pending'
        };
      }

      setUserProfile(profile);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout Flow
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem('guestSession');
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guest Access
  const loginAsGuest = () => {
    localStorage.setItem('guestSession', 'true');
    setUserProfile({
      role: 'guest'
    });
  };

  const value = {
    userProfile,
    loading,
    signup,
    login,
    logout,
    loginAsGuest,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
