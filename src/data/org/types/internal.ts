import { Timestamp } from 'firebase/firestore';

export interface Organization {
  id: string;
  name: string;
  inviteCode: string;   // workers enter this on signup
  adminUid: string;     // the firebase auth uid of the owner
  createdAt: Timestamp;
  updatedAt: Timestamp;
}