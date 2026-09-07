"use client";

import { LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sign in required
        </p>
        <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight">
          Only signed-in players can be here.
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Sign in with Google to set up your profile and add friends.
        </p>
        <button
          type="button"
          onClick={() => signIn().catch(console.error)}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.02]"
        >
          <LogIn className="h-4 w-4" />
          Sign in with Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
