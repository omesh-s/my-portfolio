"use client";

import { useEffect, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

export function BlackHoleBackdrop() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const gsap = ensureGsap();

    const ctx = gsap.context(() => {
      // Slow cosmic drift (transform only) so the background feels alive.
      gsap.set(el, { y: 0 });
      gsap.to(el, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none"
      style={{ position: "fixed", inset: 0, zIndex: 2 }}
    >
      <div
        ref={root}
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(1200px 900px at 60% 30%, rgba(150, 90, 255, 0.10), transparent 60%), radial-gradient(1100px 850px at 30% 80%, rgba(90, 140, 255, 0.06), transparent 62%)",
        }}
      />
      {/* Global vignette so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_40%,transparent_0%,rgba(7,8,11,0.22)_55%,rgba(7,8,11,0.55)_100%)]" />
    </div>
  );
}

