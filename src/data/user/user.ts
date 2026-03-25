import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User } from './types';

const COLLECTION_NAME = 'users';

// Get user by ID
export async function getById(userId: string): Promise<User | null> {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...docSnap.data(),
    } as User;
}

// Get all users in an organization
export async function getByOrganization(organizationId: string): Promise<User[]> {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as User[];
}

// Get workers only (exclude admins/managers)
export async function getWorkers(organizationId: string): Promise<User[]> {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        where('role', '==', 'worker')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as User[];
}

// Get admins/managers
export async function getAdmins(organizationId: string): Promise<User[]> {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        where('role', 'in', ['admin', 'manager'])
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as User[];
}

// Update a user
export async function update(userId: string, data: Partial<Omit<User, 'id' | 'organizationId' | 'createdAt' | 'email'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}