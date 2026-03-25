import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, Org } from '@/data';

interface AuthContextType {
    firebaseUser: FirebaseUser | null;
    appUser: User.Types.User | null;
    org: Org.Types.Organization | null;        // add this
    orgId: string | null;            // convenience shortcut
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [appUser, setAppUser] = useState<User.Types.User | null>(null);
    const [org, setOrg] = useState<Org.Types.Organization | null>(null); // add this
    const [orgId, setOrgId] = useState<string | null>(null); // add this
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);

            if (fbUser) {
                try {
                    const user = await User.Services.getById(fbUser.uid);
                    setAppUser(user);
                    console.log('Loaded user document:', user); // Debug log to check loaded user document
                    if (user?.organizationId) {
                        const org = await Org.Services.getById(user.organizationId);
                        setOrg(org);
                        setOrgId(user.organizationId);
                    }
                } catch (error) {
                    console.error('Failed to load user document:', error);
                    setAppUser(null);
                }
            } else {
                setAppUser(null);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ firebaseUser, appUser, org, orgId, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}