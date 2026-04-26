"use client";

import { portfolio } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ButtonLink";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const nav = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-faint bg-[rgba(7,8,11,0.72)] backdrop-blur-md">
        <div
          className={cn(
            "container flex items-center justify-between py-3 transition-[padding] duration-300",
            scrolled ? "py-2" : "py-3"
          )}
        >
          <a
            href="#top"
            className="group inline-flex items-baseline gap-2 rounded-xl px-2 py-1 focus-visible:focus-ring"
          >
            <span className="text-sm font-semibold tracking-tight">
              {portfolio.person.name}
            </span>
            <span className="hidden sm:inline text-xs text-muted">
              {portfolio.person.role}
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 focus-visible:focus-ring"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink
              href={`mailto:${portfolio.contact.email}`}
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              Email
            </ButtonLink>
            <ButtonLink href="#contact" className="hidden sm:inline-flex">
              Contact
            </ButtonLink>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-faint bg-white/5 hover:bg-white/10",
                "focus-visible:focus-ring"
              )}
            >
              <span className="font-mono text-xs">{open ? "CLOSE" : "MENU"}</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden border-b border-faint bg-[rgba(7,8,11,0.92)] backdrop-blur-md"
          >
            <div className="container py-4">
              <div className="grid gap-2">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm text-muted hover:text-foreground hover:bg-white/5 focus-visible:focus-ring"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="mt-2 flex gap-2">
                  <ButtonLink
                    href={`mailto:${portfolio.contact.email}`}
                    variant="ghost"
                  >
                    Email
                  </ButtonLink>
                  <ButtonLink href="#contact">Contact</ButtonLink>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

