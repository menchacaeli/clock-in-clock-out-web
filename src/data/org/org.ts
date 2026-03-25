import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Organization } from './types';

const COLLECTION_NAME = 'orgs';

// Get org by ID
export async function getById(orgId: string): Promise<Organization | null> {
    const ref = doc(db, COLLECTION_NAME, orgId);
    console.log('Fetching organization with ID:', orgId); // Debug log to check orgId value
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Organization;
}

// Get org by invite code (used during mobile app signup)
export async function getByInviteCode(inviteCode: string): Promise<Organization | null> {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('inviteCode', '==', inviteCode)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Organization;
}

// Get org by admin UID (used when admin logs into web app)
export async function getByAdminUid(adminUid: string): Promise<Organization | null> {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('adminUid', '==', adminUid)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Organization;
}

// Create a new org (used when admin first registers)
export async function create(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    const now = Timestamp.now();
    const ref = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: now,
        updatedAt: now,
    });
    return { id: ref.id, ...data, createdAt: now, updatedAt: now };
}

// Update org details
export async function update(orgId: string, data: Partial<Omit<Organization, 'id' | 'createdAt'>>): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, orgId);
    await updateDoc(ref, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

// Regenerate invite code (useful if code is compromised)
export async function regenerateInviteCode(orgId: string, newCode: string): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, orgId);
    await updateDoc(ref, {
        inviteCode: newCode,
        updatedAt: Timestamp.now(),
    });
}