"use client";

import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { ensureGsap } from "@/lib/gsap";
import { useEffect, useRef } from "react";
import { TechConstellationForce } from "@/components/TechConstellationForce";

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = scene.current;
    if (!el) return;

    const gsap = ensureGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.set("[data-hero='curtain']", { autoAlpha: 1 })
        .set("[data-hero='name']", { autoAlpha: 0, y: 24 })
        .set("[data-hero='role']", { autoAlpha: 0, y: 16 })
        .to("[data-hero='curtain']", {
          autoAlpha: 0,
          duration: 0.85,
          ease: "power3.inOut",
        })
        .to(
          "[data-hero='name']",
          { autoAlpha: 1, y: 0, duration: 1.05, ease: "power3.out" },
          "-=0.35"
        )
        .to(
          "[data-hero='role']",
          { autoAlpha: 1, y: 0, duration: 0.95, ease: "power3.out" },
          "-=0.75"
        );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="top"
      ref={scene}
      className="relative min-h-[92svh] pt-14 sm:pt-18 overflow-hidden"
    >
      {/* Intro curtain (only for GSAP intro) */}
      <div
        data-hero="curtain"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5 bg-[#07080b] opacity-0"
      />

      <div className="container relative z-10 min-h-[70svh]">
        <div className="grid min-h-[70svh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div ref={root} className="w-full">
            <h1
              data-hero="name"
              className="text-[clamp(3.25rem,8.5vw,6.5rem)] font-semibold tracking-tight leading-[0.92]"
            >
              Omesh Sana
            </h1>
            <p
              data-hero="role"
              className="mt-4 text-[clamp(1.05rem,2.4vw,1.6rem)] text-muted"
            >
              Full stack developer and AI/ML engineer
            </p>
            <p className="mt-6 max-w-2xl text-sm sm:text-base leading-7 text-muted">
              Computer Science student at UT Dallas. I build across frontend, backend,
              graphics/rendering, and database systems — with a focus on performance,
              interaction design, and technically deep, polished delivery.
            </p>
          </div>

          {/* Right-side signal map to balance composition */}
          <div className="hidden lg:block">
            <div className="relative ml-auto h-[70svh] w-full min-h-[500px]">
              <TechConstellationForce />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

