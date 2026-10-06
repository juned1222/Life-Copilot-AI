import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDkPtsgjFYKwuxr5Z437tXLAcB8HJ-0WGg",
  authDomain: "life-copilot-ai.firebaseapp.com",
  projectId: "life-copilot-ai",
  storageBucket: "life-copilot-ai.firebasestorage.app",
  messagingSenderId: "247835393937",
  appId: "1:247835393937:web:7dc6b463f67e140a42e430",
  measurementId: "G-11E4KE5R0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth & Firestore
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
