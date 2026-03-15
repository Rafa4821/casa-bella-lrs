import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAC000bdv5DvpSEJO4uylF3FmAg8rNG4Kc",
  authDomain: "casa-bella-lrs.firebaseapp.com",
  projectId: "casa-bella-lrs",
  storageBucket: "casa-bella-lrs.firebasestorage.app",
  messagingSenderId: "144829335714",
  appId: "1:144829335714:web:889b0b16ceaa69d544affb",
  measurementId: "G-VF5TQHXLGE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
