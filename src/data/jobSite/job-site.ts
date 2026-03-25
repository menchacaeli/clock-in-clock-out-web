import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { JobSite } from './types';

const COLLECTION_NAME = 'jobSites';

// Create a new job site
export async function create(organizationId: string, data: Omit<JobSite, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        organizationId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

// Get all job sites for an organization
export async function getAll(organizationId: string): Promise<JobSite[]> {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as JobSite[];
}

// Get active job sites only
export async function getActive(organizationId: string): Promise<JobSite[]> {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as JobSite[];
}

// Get a single job site
export async function getById(id: string): Promise<JobSite | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...docSnap.data(),
    } as JobSite;
}

// Update a job site
export async function update(id: string, data: Partial<Omit<JobSite, 'id' | 'organizationId' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

// Delete a job site (or mark as inactive)
export async function remove(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
}

// Soft delete - mark as inactive
export async function deactivate(id: string): Promise<void> {
    await update(id, { status: 'inactive' });
}

// Reactivate a job site
export async function activate(id: string): Promise<void> {
    await update(id, { status: 'active' });
}