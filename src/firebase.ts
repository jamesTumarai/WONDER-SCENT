import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// รองรับทั้งแบบที่ระบบสร้างให้และแบบที่ลูกค้านำ Config มาใส่เอง
const firebaseConfig = {
  apiKey: "AIzaSyCuPeoaYdohxDXLuIb6Bx_1Kk8t3qGZrSo",
  authDomain: "wonder-scent.firebaseapp.com",
  projectId: "wonder-scent",
  storageBucket: "wonder-scent.firebasestorage.app",
  messagingSenderId: "875980208276",
  appId: "1:875980208276:web:402fc9fb27200634f0dc81",
  measurementId: "G-B1LM4S958D"
};

const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null as any;
export const auth = app ? getAuth(app) : null as any;
