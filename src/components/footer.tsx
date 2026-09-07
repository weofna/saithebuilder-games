export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Games. A personal playground.
        </p>
        <p className="text-xs text-muted-foreground">
          Built with Next.js & Tailwind
        </p>
      </div>
    </footer>
  );
}
