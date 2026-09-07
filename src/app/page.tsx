import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-foreground/[0.04] to-transparent"
          aria-hidden
        />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur animate-fade-up">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Personal playground · live
          </div>

          <h1
            className="gradient-text max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            A space to tinker, ship, and share.
          </h1>

          <p
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            Small experiments, weekend projects, and the occasional game
            download. Built quickly, iterated openly.
          </p>

          <div
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href="#projects"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              View projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#about"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              About
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Projects
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Things you can download
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
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
                        {p.platform}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                        {p.name}
                      </h3>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-border bg-background px-2.5 py-1">
                      {p.fileSize}
                    </span>
                    <span className="rounded-full border border-border bg-background px-2.5 py-1">
                      Direct download
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-border/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-20 sm:py-24 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              About
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight">
              A workshop, not a portfolio.
            </h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:col-span-2">
            <p>
              This site is a low-pressure space to experiment with new ideas
              and tools. Expect rough edges, unfinished thoughts, and the odd
              file you can actually download and play.
            </p>
            <p>
              Everything here is built fast, deployed faster, and rewritten
              whenever the mood strikes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
