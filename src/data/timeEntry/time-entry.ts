import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TimeEntry } from './types';

const COLLECTION_NAME = 'timeEntries';

// Get all time entries for an organization
export async function getAll(organizationId: string): Promise<TimeEntry[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('organizationId', '==', organizationId),
    orderBy('clockIn.timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as TimeEntry[];
}

// Get time entries for a specific worker
export async function getByWorker(userId: string): Promise<TimeEntry[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('clockIn.timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as TimeEntry[];
}

// Get time entries for a date range
export async function getByDateRange(organizationId: string, startDate: string, endDate: string): Promise<TimeEntry[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('organizationId', '==', organizationId),
    where('clockIn.timestamp', '>=', startDate),
    where('clockIn.timestamp', '<=', endDate),
    orderBy('clockIn.timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as TimeEntry[];
}

// Get time entries for a worker within a date range
export async function getByWorkerAndDateRange(userId: string, startDate: string, endDate: string): Promise<TimeEntry[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    where('clockIn.timestamp', '>=', startDate),
    where('clockIn.timestamp', '<=', endDate),
    orderBy('clockIn.timestamp', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as TimeEntry[];
}

// Get time entries for a specific job site
export async function getBySite(jobSiteId: string): Promise<TimeEntry[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('jobSiteId', '==', jobSiteId),
    orderBy('clockIn.timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as TimeEntry[];
}

// Get incomplete time entries (no clock out)
export async function getIncomplete(organizationId: string): Promise<TimeEntry[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('organizationId', '==', organizationId),
    where('clockOut', '==', null)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as TimeEntry[];
}