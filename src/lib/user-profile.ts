import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type UserProfile = {
  uid: string;
  handle: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Timestamp | null;
};

const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/;

export function normalizeHandle(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
}

export function isValidHandle(handle: string): boolean {
  return HANDLE_REGEX.test(handle);
}

export function suggestHandle(displayName: string, uid: string): string {
  const base = normalizeHandle(displayName).slice(0, 14) || "player";
  const suffix = uid.slice(0, 4).toLowerCase();
  return `${base}_${suffix}`;
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function getProfileByHandle(
  handle: string,
): Promise<UserProfile | null> {
  const normalized = normalizeHandle(handle);
  const handleSnap = await getDoc(doc(db, "handles", normalized));
  if (!handleSnap.exists()) return null;
  const { uid } = handleSnap.data() as { uid: string };
  return getProfile(uid);
}

export async function createOrUpdateProfile(params: {
  uid: string;
  handle: string;
  displayName: string;
  photoURL: string | null;
}): Promise<void> {
  const { uid, displayName, photoURL } = params;
  const handle = normalizeHandle(params.handle);
  if (!isValidHandle(handle)) {
    throw new Error(
      "Handle must be 3-20 characters, lowercase letters, numbers, or _",
    );
  }

  await runTransaction(db, async (tx) => {
    const userRef = doc(db, "users", uid);
    const newHandleRef = doc(db, "handles", handle);
    const userSnap = await tx.get(userRef);
    const newHandleSnap = await tx.get(newHandleRef);

    if (newHandleSnap.exists()) {
      const { uid: existingUid } = newHandleSnap.data() as { uid: string };
      if (existingUid !== uid) {
        throw new Error("Handle is taken");
      }
    }

    const existing = userSnap.exists()
      ? (userSnap.data() as UserProfile)
      : null;

    if (existing && existing.handle !== handle) {
      const oldHandleRef = doc(db, "handles", existing.handle);
      tx.delete(oldHandleRef);
    }

    tx.set(newHandleRef, { uid });
    tx.set(
      userRef,
      {
        uid,
        handle,
        displayName,
        photoURL,
        createdAt: existing?.createdAt ?? serverTimestamp(),
      },
      { merge: true },
    );
  });
}

export const usersCollection = collection(db, "users");
