"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Pencil } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  createOrUpdateProfile,
  isValidHandle,
  normalizeHandle,
} from "@/lib/user-profile";
import { RequireAuth } from "@/components/auth/require-auth";

export function ProfileClient() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  );
}

function ProfileInner() {
  const { user, profile } = useAuth();
  const [editingHandle, setEditingHandle] = useState(false);
  const [handleInput, setHandleInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) setHandleInput(profile.handle);
  }, [profile]);

  if (!user || !profile) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-3xl items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Loading profile…</p>
      </div>
    );
  }

  const normalized = normalizeHandle(handleInput);
  const valid = isValidHandle(normalized);
  const changed = normalized !== profile.handle;

  async function saveHandle() {
    if (!user || !profile || !valid) return;
    setBusy(true);
    setError(null);
    try {
      await createOrUpdateProfile({
        uid: user.uid,
        handle: normalized,
        displayName: profile.displayName,
        photoURL: profile.photoURL,
      });
      setEditingHandle(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Profile
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        {profile.displayName}
      </h1>

      <div className="mt-10 flex items-center gap-4">
        {profile.photoURL ? (
          <Image
            src={profile.photoURL}
            alt={profile.displayName}
            width={72}
            height={72}
            unoptimized
            className="h-18 w-18 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-18 w-18 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Signed in as
          </p>
          <p className="mt-0.5 truncate text-sm text-foreground">
            {user.email}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Handle
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">
              @{profile.handle}
            </p>
          </div>
          {!editingHandle && (
            <button
              type="button"
              onClick={() => setEditingHandle(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>
        {editingHandle && (
          <div className="mt-4">
            <div className="flex items-center rounded-xl border border-border bg-background px-3">
              <span className="text-muted-foreground">@</span>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                maxLength={20}
                autoFocus
                className="w-full bg-transparent px-1 py-2.5 text-sm text-foreground outline-none"
              />
            </div>
            {normalized && !valid && (
              <p className="mt-2 text-xs text-red-500">
                Must be 3–20 characters: a–z, 0–9, or _
              </p>
            )}
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={saveHandle}
                disabled={!valid || !changed || busy}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <Check className="h-3 w-3" />
                {busy ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingHandle(false);
                  setHandleInput(profile.handle);
                  setError(null);
                }}
                className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
