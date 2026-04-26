import { portfolio } from "@/data/portfolio";

export function SiteFooter() {
  return (
    <footer className="border-t border-faint py-10">
      <div className="container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {portfolio.person.name}. Built with Next.js,
          TypeScript, Tailwind, GSAP, and R3F.
        </p>
        <div className="flex flex-wrap gap-2">
          {portfolio.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-faint bg-white/5 px-3 py-1.5 text-sm text-muted hover:text-foreground hover:bg-white/10 focus-visible:focus-ring"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

