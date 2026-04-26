"use client";

import { useMemo } from "react";
import { FeaturedProject } from "@/data/portfolio";
import { cn } from "@/lib/cn";

export function ProjectCard({
  project,
  onOpen,
  isExpanded,
  className,
}: {
  project: FeaturedProject;
  onOpen: () => void;
  isExpanded: boolean;
  className?: string;
}) {
  const accent = useMemo(() => {
    const n =
      project.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return `hsla(${n}, 85%, 68%, 0.18)`;
  }, [project.slug]);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Expand project: ${project.title}`}
      aria-expanded={isExpanded}
      className={cn(
        "group relative block overflow-hidden rounded-[26px] border border-faint bg-white/3 p-6",
        "transition-[transform,background-color,border-color] duration-300",
        "hover:-translate-y-1 hover:bg-white/4.5 hover:border-white/20",
        "focus-visible:focus-ring",
        className
      )}
      style={{
        boxShadow:
          "0 22px 72px rgba(0,0,0,0.58), 0 0 0 1px rgba(255,255,255,0.04) inset",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(700px 280px at 35% 0%, rgba(165,90,255,0.16), transparent 62%), radial-gradient(700px 280px at 85% 20%, rgba(120,80,255,0.10), transparent 62%)",
        }}
      />

      <div
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full blur-3xl opacity-70"
        style={{ background: accent }}
      />

      <header className="relative">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight leading-tight">
            {project.title}
          </h3>
          <span className="font-mono text-[11px] tracking-[0.22em] text-muted">
            EXPAND ↗
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">
          {project.description}
        </p>
      </header>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {project.tags.slice(0, 6).map((t) => (
          <span
            key={t}
            className="rounded-full border border-faint bg-white/5 px-2.5 py-1 text-xs text-muted"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="relative mt-5 border-t border-faint pt-4">
        <p className="text-xs font-mono tracking-[0.22em] text-muted">SIGNATURE</p>
        <p className="mt-2 text-sm leading-6 text-foreground/90">
          {project.highlights[0] ?? "—"}
        </p>
      </div>
    </button>
  );
}

