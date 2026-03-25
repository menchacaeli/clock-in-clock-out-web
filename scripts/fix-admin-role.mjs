/**
 * Ensures the admin user document has role: 'admin'.
 * Run from apps/web/:
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/fix-admin-role.mjs
 */

import { initializeApp }                              from 'firebase/app';
import { getAuth, signInWithEmailAndPassword }        from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc }          from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyDCs3qpH3Cb6h7IwOA5t37eWlZmf2EiYYM',
  authDomain:        'clock-in-clock-out-b3d89.firebaseapp.com',
  projectId:         'clock-in-clock-out-b3d89',
  storageBucket:     'clock-in-clock-out-b3d89.firebasestorage.app',
  messagingSenderId: '350420392641',
  appId:             '1:350420392641:web:3613513115e77259a45240',
};

const adminEmail    = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD env vars.');
  process.exit(1);
}

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

const { user } = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
console.log(`Authenticated as ${user.uid}`);

const ref  = doc(db, 'users', user.uid);
const snap = await getDoc(ref);

if (snap.exists()) {
  const data = snap.data();
  console.log('Current doc:', JSON.stringify(data, null, 2));
  if (data.role !== 'admin') {
    await setDoc(ref, { ...data, role: 'admin' });
    console.log('✓ Updated role to admin');
  } else {
    console.log('✓ Role is already admin — no changes needed');
  }
} else {
  console.error('✗ No user document found at /users/' + user.uid);
  process.exit(1);
}

process.exit(0);
