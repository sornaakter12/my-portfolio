import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with custom databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: true,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as mandated by skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'analytics', 'visitors'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Please check your network/Firebase config.');
    }
    return false;
  }
}

// Track visits and increment persistent counter
export async function recordVisit(): Promise<number | null> {
  const metricPath = 'analytics/visitors';
  const docRef = doc(db, 'analytics', 'visitors');

  try {
    const hasVisitedThisSession = sessionStorage.getItem('jannat_portfolio_session_counted');
    
    // Check if doc exists
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      // First visitor ever, create with count 1
      await setDoc(docRef, {
        count: 1,
        updatedAt: serverTimestamp(),
      });
      sessionStorage.setItem('jannat_portfolio_session_counted', 'true');
      return 1;
    }

    const currentCount = (snap.data()?.count as number) || 1;

    // Only increment once per session to avoid counting page refreshes
    if (!hasVisitedThisSession) {
      await updateDoc(docRef, {
        count: increment(1),
        updatedAt: serverTimestamp(),
      });
      sessionStorage.setItem('jannat_portfolio_session_counted', 'true');
      return currentCount + 1;
    }

    return currentCount;
  } catch (error) {
    console.error('Failed to record visitor count in Firebase:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, metricPath);
    } catch {
      // Return null on failure without crashing user UI
      return null;
    }
  }
}

// Subscribe to real-time updates for owner display
export function subscribeToVisitorCount(onUpdate: (count: number) => void): () => void {
  const metricPath = 'analytics/visitors';
  const docRef = doc(db, 'analytics', 'visitors');

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const count = snapshot.data()?.count;
        if (typeof count === 'number') {
          onUpdate(count);
        }
      }
    },
    (error) => {
      console.warn('Visitor counter listener warning:', error);
      try {
        handleFirestoreError(error, OperationType.GET, metricPath);
      } catch {
        // Fallback gracefully
      }
    }
  );

  return unsubscribe;
}
