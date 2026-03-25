import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Timesheet } from './types';
import { TimeEntry } from '../timeEntry/types';

const COLLECTION_NAME = 'timesheets';

// Calculate bi-weekly pay period dates (Monday to Sunday, 2 weeks)
export function getCurrentPayPeriod(): { start: string; end: string } {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Find the most recent Monday (start of current or previous week)
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const mostRecentMonday = new Date(now);
    mostRecentMonday.setDate(now.getDate() - daysToMonday);

    // Determine which bi-weekly period we're in
    const weeksSinceEpoch = Math.floor(mostRecentMonday.getTime() / (7 * 24 * 60 * 60 * 1000));
    const isFirstWeek = weeksSinceEpoch % 2 === 0;

    let periodStart: Date;
    if (isFirstWeek) {
        periodStart = mostRecentMonday;
    } else {
        periodStart = new Date(mostRecentMonday);
        periodStart.setDate(periodStart.getDate() - 7);
    }

    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodStart.getDate() + 13); // 2 weeks - 1 day

    return {
        start: periodStart.toISOString().split('T')[0],
        end: periodEnd.toISOString().split('T')[0],
    };
}

// Generate or get timesheet for a worker and period
export async function getOrCreate(
    organizationId: string,
    userId: string,
    periodStart: string,
    periodEnd: string,
    entries: TimeEntry[]
): Promise<Timesheet> {
    // Try to find existing timesheet
    const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        where('userId', '==', userId),
        where('periodStart', '==', periodStart),
        where('periodEnd', '==', periodEnd)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        return {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
        } as Timesheet;
    }

    // Create new timesheet
    const totalMinutes = entries.reduce((sum, entry) => sum + (entry.durationMinutes || 0), 0);
    const now = new Date().toISOString();

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        organizationId,
        userId,
        periodStart,
        periodEnd,
        totalMinutes,
        entryCount: entries.length,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
    });

    return {
        id: docRef.id,
        organizationId,
        userId,
        periodStart,
        periodEnd,
        totalMinutes,
        entryCount: entries.length,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
    } as Timesheet;
}

// Get all timesheets for current pay period
export async function getCurrentPeriodTimesheets(organizationId: string): Promise<Timesheet[]> {
    const { start, end } = getCurrentPayPeriod();

    const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        where('periodStart', '==', start),
        where('periodEnd', '==', end),
        orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Timesheet[];
}

// Get all pending timesheets
export async function getPending(organizationId: string): Promise<Timesheet[]> {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        where('status', '==', 'pending'),
        orderBy('periodEnd', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Timesheet[];
}

// Get timesheet by ID
export async function getById(id: string): Promise<Timesheet | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...docSnap.data(),
    } as Timesheet;
}

// Approve a timesheet
export async function approve(timesheetId: string, adminUserId: string, notes?: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, timesheetId);
    await updateDoc(docRef, {
        status: 'approved',
        approvedBy: adminUserId,
        approvedAt: new Date().toISOString(),
        notes: notes || null,
        updatedAt: new Date().toISOString(),
    });
}

// Reject a timesheet
export async function reject(timesheetId: string, adminUserId: string, notes: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, timesheetId);
    await updateDoc(docRef, {
        status: 'rejected',
        approvedBy: adminUserId,
        approvedAt: new Date().toISOString(),
        notes,
        updatedAt: new Date().toISOString(),
    });
}

// Recalculate timesheet totals
export async function recalculate(timesheetId: string, entries: TimeEntry[]): Promise<void> {
    const totalMinutes = entries.reduce((sum, entry) => sum + (entry.durationMinutes || 0), 0);
    const docRef = doc(db, COLLECTION_NAME, timesheetId);
    await updateDoc(docRef, {
        totalMinutes,
        entryCount: entries.length,
        updatedAt: new Date().toISOString(),
    });
}