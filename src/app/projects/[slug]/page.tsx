import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileDown } from "lucide-react";
import { projects, getProject } from "@/lib/projects";
import type { Metadata } from "next";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — hello`,
    description: project.description,
  };
}

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="relative">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b ${project.accent} to-transparent`}
        aria-hidden
      />
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-6 pt-16 pb-24 sm:pt-24">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to projects
        </Link>

        <div className="mt-10 animate-fade-up">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {project.platform} · Game
          </p>
          <h1 className="mt-3 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {project.name}
          </h1>
          <p className="mt-4 text-balance text-lg text-muted-foreground sm:text-xl">
            {project.tagline}
          </p>
        </div>

        <div
          className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-10 animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
                <FileDown className="h-5 w-5 text-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {project.fileName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {project.fileSize} · {project.platform}
                </p>
              </div>
            </div>
            <a
              href={project.file}
              download={project.fileName}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              Download
            </a>
          </div>
        </div>

        <div
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 animate-fade-up"
          style={{ animationDelay: "140ms" }}
        >
          <div className="sm:col-span-2">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              About
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              {project.description}
            </p>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Platform
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {project.platform}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Size
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {project.fileSize}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                File
              </dt>
              <dd className="mt-1 truncate font-mono text-xs text-foreground">
                {project.fileName}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
