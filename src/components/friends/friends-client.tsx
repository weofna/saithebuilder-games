"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Check, Search, UserMinus, UserPlus, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { RequireAuth } from "@/components/auth/require-auth";
import { getProfileByHandle, type UserProfile } from "@/lib/user-profile";
import {
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  sendFriendRequest,
  subscribeToFriends,
  subscribeToIncomingRequests,
  type FriendEntry,
  type FriendRequest,
} from "@/lib/friends";

export function FriendsClient() {
  return (
    <RequireAuth>
      <FriendsInner />
    </RequireAuth>
  );
}

function FriendsInner() {
  const { user, profile } = useAuth();
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubFriends = subscribeToFriends(user.uid, setFriends);
    const unsubRequests = subscribeToIncomingRequests(user.uid, setRequests);
    return () => {
      unsubFriends();
      unsubRequests();
    };
  }, [user]);

  if (!user || !profile) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-3xl items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Friends
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        Your circle.
      </h1>

      <FindFriend myProfile={profile} />

      {requests.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-sm font-medium text-foreground">
            Incoming requests
          </h2>
          <ul className="space-y-2">
            {requests.map((r) => (
              <RequestRow
                key={r.from}
                request={r}
                myUid={user.uid}
                myProfile={profile}
              />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="mb-3 text-sm font-medium text-foreground">
          Friends {friends.length > 0 && (
            <span className="text-muted-foreground">· {friends.length}</span>
          )}
        </h2>
        {friends.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-sm text-muted-foreground">
            No friends yet. Search by handle above to send your first request.
          </p>
        ) : (
          <ul className="space-y-2">
            {friends.map((f) => (
              <FriendRow key={f.uid} friend={f} myUid={user.uid} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function FindFriend({ myProfile }: { myProfile: UserProfile }) {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<UserProfile | null | "notfound">(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function search() {
    if (!query.trim()) return;
    setBusy(true);
    setFound(null);
    setMsg(null);
    setErr(null);
    try {
      const p = await getProfileByHandle(query);
      setFound(p ?? "notfound");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    if (!found || found === "notfound") return;
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await sendFriendRequest(myProfile, found);
      setMsg(`Request sent to @${found.handle}`);
      setFound(null);
      setQuery("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Add a friend
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center rounded-xl border border-border bg-background px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">@</span>
          <input
            type="text"
            placeholder="handle"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
            className="w-full bg-transparent px-1 py-2.5 text-sm text-foreground outline-none"
          />
        </div>
        <button
          type="button"
          onClick={search}
          disabled={busy || !query.trim()}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          Search
        </button>
      </div>

      {found === "notfound" && (
        <p className="mt-3 text-sm text-muted-foreground">
          No user with that handle.
        </p>
      )}
      {found && found !== "notfound" && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <ProfileMini
            handle={found.handle}
            displayName={found.displayName}
            photoURL={found.photoURL}
          />
          <button
            type="button"
            onClick={send}
            disabled={busy || found.uid === myProfile.uid}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <UserPlus className="h-3 w-3" />
            {found.uid === myProfile.uid ? "That's you" : "Add"}
          </button>
        </div>
      )}
      {msg && <p className="mt-3 text-xs text-emerald-500">{msg}</p>}
      {err && <p className="mt-3 text-xs text-red-500">{err}</p>}
    </section>
  );
}

function RequestRow({
  request,
  myUid,
  myProfile,
}: {
  request: FriendRequest;
  myUid: string;
  myProfile: UserProfile;
}) {
  const [busy, setBusy] = useState(false);

  async function accept() {
    setBusy(true);
    try {
      await acceptFriendRequest(
        myUid,
        {
          uid: request.from,
          handle: request.handle,
          displayName: request.displayName,
          photoURL: request.photoURL,
          createdAt: null,
        },
        myProfile,
      );
    } finally {
      setBusy(false);
    }
  }

  async function decline() {
    setBusy(true);
    try {
      await declineFriendRequest(myUid, request.from);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <ProfileMini
        handle={request.handle}
        displayName={request.displayName}
        photoURL={request.photoURL}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={accept}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-transform hover:scale-105 disabled:opacity-50"
        >
          <Check className="h-3 w-3" />
          Accept
        </button>
        <button
          type="button"
          onClick={decline}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <X className="h-3 w-3" />
          Decline
        </button>
      </div>
    </li>
  );
}

function FriendRow({ friend, myUid }: { friend: FriendEntry; myUid: string }) {
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`Remove @${friend.handle} from friends?`)) return;
    setBusy(true);
    try {
      await removeFriend(myUid, friend.uid);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <ProfileMini
        handle={friend.handle}
        displayName={friend.displayName}
        photoURL={friend.photoURL}
      />
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <UserMinus className="h-3 w-3" />
        Remove
      </button>
    </li>
  );
}

function ProfileMini({
  handle,
  displayName,
  photoURL,
}: {
  handle: string;
  displayName: string;
  photoURL: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {photoURL ? (
        <Image
          src={photoURL}
          alt={displayName}
          width={36}
          height={36}
          unoptimized
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {displayName}
        </p>
        <p className="truncate text-xs text-muted-foreground">@{handle}</p>
      </div>
    </div>
  );
}
