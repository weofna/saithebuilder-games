import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play — Games",
  description: "Games you can play right in your browser.",
};

const playables = [
  {
    slug: "uno",
    name: "UNO",
    tagline: "1v1 against a bot",
    description:
      "Classic UNO with a house rule: +2 and +4 cards stack. Play until someone empties their hand.",
    status: "Playable",
    accent: "from-red-500/20 to-red-500/0",
  },
];

export default function PlayPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 sm:pt-20">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Play
        </p>
        <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Games in your browser.
        </h1>
        <p className="mt-3 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          No downloads. Just click and play.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {playables.map((p) => (
            <Link
              key={p.slug}
              href={`/play/${p.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-border-strong hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40 sm:p-8"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${p.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                aria-hidden
              />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {p.status}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      {p.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">{p.tagline}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
