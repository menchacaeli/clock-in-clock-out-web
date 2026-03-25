import { Timestamp } from 'firebase/firestore';
import { UserRole, UserStatus } from './shared';

export interface User {
  id: string; // maps to Firebase Auth UID
  email: string | null; // optional because Firebase may not have email
  firstName: string;
  lastName: string;
  displayName?: string;
  photoURL?: string;

  organizationId: string; // your app logic
  role: UserRole; // admin/manager/worker etc.
  status: UserStatus; // pending/active
  jobSiteIds?: string[]; // assigned job site IDs
  inviteCode?: string; // the code they entered on signup, useful for debugging

  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
