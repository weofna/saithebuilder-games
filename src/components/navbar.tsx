"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { projects } from "@/lib/projects";

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          Games
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/play"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Play
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Projects
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {dropdownOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-black/10 dark:shadow-black/40 animate-fade-up"
              >
                {projects.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {p.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {p.tagline}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <Link
              href="/play"
              onClick={() => setMobileOpen(false)}
              className="mb-3 flex items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Play
            </Link>
            <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Projects
            </p>
            <div className="flex flex-col">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-col gap-0.5 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
                >
                  <span className="text-sm font-medium text-foreground">
                    {p.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.tagline}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
