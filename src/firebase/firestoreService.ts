import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

export interface SavedConsultation {
  id?: string;
  patientId: string;
  patientName: string;
  cohort: string;
  targetDrug: string;
  recommendedDose: number;
  standardDose: number;
  doseUnit: string;
  doseDeltaPercent: number;
  adrRiskScore: number;
  relativeRiskIndex: number;
  clinicalNotes: string;
  createdAt?: any;
}

export async function saveConsultationRecord(
  userId: string,
  record: Omit<SavedConsultation, 'id' | 'createdAt'>
) {
  const consultsRef = collection(db, 'users', userId, 'consultations');
  const docRef = await addDoc(consultsRef, {
    ...record,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getConsultationRecords(userId: string): Promise<SavedConsultation[]> {
  try {
    const consultsRef = collection(db, 'users', userId, 'consultations');
    const q = query(consultsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<SavedConsultation, 'id'>),
    }));
  } catch (err) {
    console.warn('Fallback: direct fetch without ordering if index is building:', err);
    const consultsRef = collection(db, 'users', userId, 'consultations');
    const snapshot = await getDocs(consultsRef);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<SavedConsultation, 'id'>),
    }));
  }
}

export async function deleteConsultationRecord(userId: string, consultationId: string) {
  const docRef = doc(db, 'users', userId, 'consultations', consultationId);
  await deleteDoc(docRef);
}

export async function logAuditRecord(userId: string, action: string, details: string) {
  try {
    const auditRef = collection(db, 'users', userId, 'auditLogs');
    await addDoc(auditRef, {
      action,
      details,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not write audit log:', err);
  }
}
