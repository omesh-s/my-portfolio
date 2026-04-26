"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { ProjectCard } from "@/components/ProjectCard";

function clampUrl(url: string | undefined) {
  const u = (url ?? "").trim();
  return u.length ? u : undefined;
}

export function ProjectsExpandable() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const openProject = useMemo(() => {
    if (!openSlug) return null;
    return portfolio.projects.items.find((p) => p.slug === openSlug) ?? null;
  }, [openSlug]);

  useEffect(() => {
    if (!openProject) return;
    // Focus the close control for keyboard users.
    closeBtnRef.current?.focus();
  }, [openProject]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSlug(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio.projects.items.map((p) => (
          <ProjectCard
            key={p.slug}
            project={p}
            onOpen={() => setOpenSlug(p.slug)}
            isExpanded={openSlug === p.slug}
          />
        ))}
      </div>

      <AnimatePresence>
        {openProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-70"
            aria-hidden="false"
          >
            <button
              type="button"
              aria-label="Close project details"
              onClick={() => setOpenSlug(null)}
              className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm"
            />

            <div className="relative mx-auto mt-16 w-[min(980px,92vw)] pb-16">
              <motion.section
                role="dialog"
                aria-modal="true"
                aria-label={`${openProject.title} details`}
                initial={{ y: 18, scale: 0.99, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 10, scale: 0.99, opacity: 0 }}
                transition={{ duration: 0.26, ease: [0.2, 0.9, 0.2, 1] }}
                className="rounded-[28px] border border-faint bg-[rgba(10,11,16,0.82)] p-6 sm:p-7 shadow-[0_40px_140px_rgba(0,0,0,0.75)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.22em] text-muted">
                      PROJECT
                    </p>
                    <h3 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
                      {openProject.title}
                    </h3>
                    <p className="mt-4 text-sm sm:text-base leading-7 text-muted">
                      {openProject.longform?.summary ?? openProject.description}
                    </p>
                  </div>

                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={() => setOpenSlug(null)}
                    className="shrink-0 rounded-full border border-faint bg-white/5 px-4 py-2 text-sm text-muted hover:bg-white/10 hover:text-foreground focus-visible:focus-ring"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {openProject.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-faint bg-white/5 px-3 py-1.5 text-sm text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-[22px] border border-faint bg-white/[0.035] p-5">
                    <p className="font-mono text-[11px] tracking-[0.22em] text-muted">
                      PROBLEM / GOAL
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {openProject.detail?.problemOrGoal ?? openProject.description}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-faint bg-white/[0.035] p-5">
                    <p className="font-mono text-[11px] tracking-[0.22em] text-muted">
                      WHAT I BUILT
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-muted">
                      {(openProject.detail?.whatIBuilt ?? []).map((x) => (
                        <li key={x} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/35" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[22px] border border-faint bg-white/[0.035] p-5">
                    <p className="font-mono text-[11px] tracking-[0.22em] text-muted">
                      HIGHLIGHTS
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-muted">
                      {(openProject.detail?.technicalDecisions ??
                        openProject.highlights ??
                        []
                      ).map((x) => (
                        <li key={x} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[rgba(165,90,255,0.55)]" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {clampUrl((openProject.links as { repo?: string }).repo) && (
                    <a
                      href={(openProject.links as { repo?: string }).repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-faint bg-white/5 px-4 py-2 text-sm text-muted hover:bg-white/10 hover:text-foreground focus-visible:focus-ring"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </motion.section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

