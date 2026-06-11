import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { DocumentData } from './types';
import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
}

export interface SavedDocument extends DocumentData {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  starred?: boolean;
}

const DOCUMENTS_PATH = 'documents';

export async function saveDocument(data: DocumentData, docId?: string): Promise<string> {
  if (!db || !auth) throw new Error('โปรดตรวจสอบการตั้งค่า Firebase ใน Environment Variables ก่อนบันทึกข้อมูล');
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const id = docId || crypto.randomUUID();
  const path = `${DOCUMENTS_PATH}/${id}`;
  const docRef = doc(db, DOCUMENTS_PATH, id);

  try {
    const payload = {
      ...data,
      userId: user.uid,
      updatedAt: Date.now(), 
    };

    if (docId) {
      await updateDoc(docRef, payload);
    } else {
      await setDoc(docRef, {
        ...payload,
        createdAt: Date.now(),
        starred: false,
      });
    }
    return id;
  } catch (error) {
    throw handleFirestoreError(error, docId ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function toggleDocumentStar(id: string, currentStarredStatus: boolean): Promise<void> {
  if (!db || !auth) throw new Error('โปรดตรวจสอบการตั้งค่า Firebase ใน Environment Variables');
  const path = `${DOCUMENTS_PATH}/${id}`;
  const docRef = doc(db, DOCUMENTS_PATH, id);
  try {
    await updateDoc(docRef, {
      starred: !currentStarredStatus
    });
  } catch (error) {
    throw handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function getUserDocuments(): Promise<SavedDocument[]> {
  if (!db || !auth) throw new Error('โปรดตรวจสอบการตั้งค่า Firebase ใน Environment Variables');
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const q = query(
      collection(db, DOCUMENTS_PATH),
      where('userId', '==', user.uid)
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SavedDocument));
    return docs.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    throw handleFirestoreError(error, OperationType.LIST, DOCUMENTS_PATH);
  }
}

export async function deleteUserDocument(id: string): Promise<void> {
  if (!db) throw new Error('โปรดตรวจสอบการตั้งค่า Firebase ใน Environment Variables');
  const path = `${DOCUMENTS_PATH}/${id}`;
  try {
    await deleteDoc(doc(db, DOCUMENTS_PATH, id));
  } catch (error) {
    throw handleFirestoreError(error, OperationType.DELETE, path);
  }
}
