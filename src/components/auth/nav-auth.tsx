"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, User, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export function NavAuth() {
  const { user, profile, loading, signIn, signOutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (loading) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => signIn().catch(console.error)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <LogIn className="h-3.5 w-3.5" />
        Sign in
      </button>
    );
  }

  const label = profile?.handle ?? user.displayName ?? "You";
  const photo = user.photoURL ?? profile?.photoURL ?? null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card pr-3 pl-1 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Avatar photo={photo} name={label} />
        <span className="hidden max-w-[10ch] truncate sm:inline">
          {profile ? `@${profile.handle}` : label}
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-black/10 dark:shadow-black/40 animate-fade-up"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-foreground">
              {user.displayName ?? "Signed in"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {profile ? `@${profile.handle}` : user.email}
            </p>
          </div>
          <div className="my-1 h-px bg-border" />
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/friends"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Users className="h-4 w-4" />
            Friends
          </Link>
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOutUser().catch(console.error);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function Avatar({ photo, name }: { photo: string | null; name: string }) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={28}
        height={28}
        unoptimized
        className="h-7 w-7 rounded-full object-cover"
      />
    );
  }
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
      {initial}
    </span>
  );
}
