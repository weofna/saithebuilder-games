"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  createOrUpdateProfile,
  isValidHandle,
  normalizeHandle,
  suggestHandle,
} from "@/lib/user-profile";

export function Onboarding() {
  const { user, profile, loading } = useAuth();
  const [handle, setHandle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const needsOnboarding = !!user && !loading && !profile;

  useEffect(() => {
    if (needsOnboarding && user && !initialized) {
      setHandle(suggestHandle(user.displayName ?? "player", user.uid));
      setInitialized(true);
    }
    if (!needsOnboarding && initialized) {
      setInitialized(false);
    }
  }, [needsOnboarding, user, initialized]);

  if (!needsOnboarding || !user) return null;

  const normalized = normalizeHandle(handle);
  const valid = isValidHandle(normalized);

  async function submit() {
    if (!user || !valid) return;
    setBusy(true);
    setError(null);
    try {
      await createOrUpdateProfile({
        uid: user.uid,
        handle: normalized,
        displayName: user.displayName ?? "Player",
        photoURL: user.photoURL ?? null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-fade-up">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Welcome
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Pick a handle
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This is how friends find you. 3–20 characters, lowercase letters,
          numbers, or underscores.
        </p>

        <div className="mt-6">
          <label className="text-xs font-medium text-muted-foreground">
            Handle
          </label>
          <div className="mt-1.5 flex items-center rounded-xl border border-border bg-background px-3 focus-within:border-border-strong">
            <span className="text-muted-foreground">@</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && valid && !busy) submit();
              }}
              autoFocus
              maxLength={20}
              className="w-full bg-transparent px-1 py-2.5 text-sm text-foreground outline-none"
            />
          </div>
          {normalized && !valid && (
            <p className="mt-2 text-xs text-red-500">
              Must be 3–20 characters: a–z, 0–9, or _
            </p>
          )}
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!valid || busy}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {busy ? "Saving…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
