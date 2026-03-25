/**
 * Seed script — creates mock workers in Firestore.
 *
 * Run from the repo root:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword node --experimental-specifier-resolution=node scripts/seed-users.mjs
 *
 * Or via pnpm (resolves deps from apps/web):
 *   pnpm --filter clock-in-clock-out-web exec node ../../scripts/seed-users.mjs
 */

import { initializeApp }                                                     from 'firebase/app';
import { getAuth, signInWithEmailAndPassword }                               from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, query, where, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyDCs3qpH3Cb6h7IwOA5t37eWlZmf2EiYYM',
  authDomain:        'clock-in-clock-out-b3d89.firebaseapp.com',
  projectId:         'clock-in-clock-out-b3d89',
  storageBucket:     'clock-in-clock-out-b3d89.firebasestorage.app',
  messagingSenderId: '350420392641',
  appId:             '1:350420392641:web:3613513115e77259a45240',
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_WORKERS = [
  { firstName: 'Maria',   lastName: 'Garcia',   email: 'maria.garcia@example.com',   role: 'worker'  },
  { firstName: 'James',   lastName: 'Roper',    email: 'james.roper@example.com',    role: 'worker'  },
  { firstName: 'Sara',    lastName: 'Thompson', email: 'sara.thompson@example.com',  role: 'worker'  },
  { firstName: 'Carlos',  lastName: 'Mendez',   email: 'carlos.mendez@example.com',  role: 'worker'  },
  { firstName: 'Aisha',   lastName: 'Williams', email: 'aisha.williams@example.com', role: 'worker'  },
  { firstName: 'Tyler',   lastName: 'Brooks',   email: 'tyler.brooks@example.com',   role: 'worker'  },
  { firstName: 'Priya',   lastName: 'Patel',    email: 'priya.patel@example.com',    role: 'manager' },
  { firstName: 'Kevin',   lastName: 'Nguyen',   email: 'kevin.nguyen@example.com',   role: 'worker'  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const randomStatus  = ()  => Math.random() > 0.2 ? 'active' : 'pending';
const daysAgo       = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return Timestamp.fromDate(d); };

// ─── Main ─────────────────────────────────────────────────────────────────────

const adminEmail    = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error('\nError: set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.\n');
  console.error('Example:');
  console.error('  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret pnpm --filter clock-in-clock-out-web exec node ../../scripts/seed-users.mjs\n');
  process.exit(1);
}

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

console.log(`\n🔐  Signing in as ${adminEmail}…`);
const { user: adminUser } = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
console.log(`✓   Authenticated (uid: ${adminUser.uid})`);

// Find the admin's org — user document ID is the Firebase Auth UID
console.log('\n🔍  Looking up your organization…');
let orgId;

const userDoc = await getDoc(doc(db, 'users', adminUser.uid));
if (userDoc.exists()) {
  orgId = userDoc.data().organizationId;
}

if (!orgId) {
  console.error('\n✗   Could not find your organization. Make sure your account has an org set up first.\n');
  process.exit(1);
}
console.log(`✓   Organization: ${orgId}`);

// Fetch existing job sites to assign to workers
const sitesSnap = await getDocs(query(collection(db, 'jobSites'), where('organizationId', '==', orgId)));
const siteIds   = sitesSnap.docs.map(d => d.id);
console.log(`✓   Found ${siteIds.length} job site(s)`);

// Create workers
console.log(`\n👷  Creating ${MOCK_WORKERS.length} mock workers…\n`);

for (const w of MOCK_WORKERS) {
  const assignedSites = siteIds.slice(0, Math.floor(Math.random() * Math.min(siteIds.length + 1, 3)));
  const status        = randomStatus();

  const docData = {
    id:             crypto.randomUUID(),
    email:          w.email,
    firstName:      w.firstName,
    lastName:       w.lastName,
    displayName:    `${w.firstName} ${w.lastName}`,
    organizationId: orgId,
    role:           w.role,
    status,
    jobSiteIds:     assignedSites,
    createdAt:      daysAgo(Math.floor(Math.random() * 60) + 1),
    updatedAt:      daysAgo(Math.floor(Math.random() * 7)),
  };

  const ref = await addDoc(collection(db, 'users'), docData);
  console.log(`  ✓  ${docData.displayName.padEnd(20)} ${w.role.padEnd(8)} ${status.padEnd(10)} doc: ${ref.id}`);
}

console.log('\n✅  Done! Refresh your dashboard to see the new workers.\n');
process.exit(0);
