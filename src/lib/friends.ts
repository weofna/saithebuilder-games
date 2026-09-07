import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/user-profile";

export type FriendEntry = {
  uid: string;
  handle: string;
  displayName: string;
  photoURL: string | null;
  since: Timestamp | null;
};

export type FriendRequest = {
  from: string;
  handle: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Timestamp | null;
};

function summarize(profile: UserProfile) {
  return {
    uid: profile.uid,
    handle: profile.handle,
    displayName: profile.displayName,
    photoURL: profile.photoURL,
  };
}

export async function sendFriendRequest(
  fromProfile: UserProfile,
  toProfile: UserProfile,
): Promise<void> {
  if (fromProfile.uid === toProfile.uid) {
    throw new Error("You can't friend yourself");
  }
  const existingFriend = await getDoc(
    doc(db, "users", fromProfile.uid, "friends", toProfile.uid),
  );
  if (existingFriend.exists()) {
    throw new Error("Already friends");
  }
  await setDoc(
    doc(db, "users", toProfile.uid, "incomingRequests", fromProfile.uid),
    {
      from: fromProfile.uid,
      handle: fromProfile.handle,
      displayName: fromProfile.displayName,
      photoURL: fromProfile.photoURL,
      createdAt: serverTimestamp(),
    },
  );
}

export async function acceptFriendRequest(
  myUid: string,
  fromProfile: UserProfile,
  myProfile: UserProfile,
): Promise<void> {
  await runTransaction(db, async (tx) => {
    const reqRef = doc(db, "users", myUid, "incomingRequests", fromProfile.uid);
    const reqSnap = await tx.get(reqRef);
    if (!reqSnap.exists()) throw new Error("Request no longer exists");

    tx.set(doc(db, "users", myUid, "friends", fromProfile.uid), {
      ...summarize(fromProfile),
      since: serverTimestamp(),
    });
    tx.set(doc(db, "users", fromProfile.uid, "friends", myUid), {
      ...summarize(myProfile),
      since: serverTimestamp(),
    });
    tx.delete(reqRef);
  });
}

export async function declineFriendRequest(
  myUid: string,
  fromUid: string,
): Promise<void> {
  await deleteDoc(doc(db, "users", myUid, "incomingRequests", fromUid));
}

export async function removeFriend(
  myUid: string,
  friendUid: string,
): Promise<void> {
  await runTransaction(db, async (tx) => {
    tx.delete(doc(db, "users", myUid, "friends", friendUid));
    tx.delete(doc(db, "users", friendUid, "friends", myUid));
  });
}

export function subscribeToFriends(
  uid: string,
  callback: (friends: FriendEntry[]) => void,
) {
  const q = query(
    collection(db, "users", uid, "friends"),
    orderBy("since", "desc"),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as FriendEntry));
  });
}

export function subscribeToIncomingRequests(
  uid: string,
  callback: (requests: FriendRequest[]) => void,
) {
  const q = query(
    collection(db, "users", uid, "incomingRequests"),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as FriendRequest));
  });
}
