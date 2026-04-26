"use client";

import { useEffect, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

export function Reveal({
  children,
  delay = 0,
  y = 18,
  variant = "fadeUp",
  scrub = false,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  variant?: "fadeUp" | "fade" | "clip";
  scrub?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return;

    const gsap = ensureGsap();

    const ctx = gsap.context(() => {
      const from: gsap.TweenVars =
        variant === "clip"
          ? { autoAlpha: 0, y: y * 0.8, clipPath: "inset(0 0 100% 0)" }
          : variant === "fade"
            ? { autoAlpha: 0 }
            : { autoAlpha: 0, y };

      const to: gsap.TweenVars =
        variant === "clip"
          ? { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)" }
          : { autoAlpha: 1, y: 0 };

      gsap.set(el, from);

      gsap.to(el, {
        ...to,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          end: scrub ? "top 55%" : undefined,
          scrub: scrub ? 0.6 : false,
          toggleActions: scrub ? undefined : "play none none reverse",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, reduced, scrub, variant, y]);

  return <div ref={ref}>{children}</div>;
}

