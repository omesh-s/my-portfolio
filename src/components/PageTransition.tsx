"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = overlay.current;
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.set(el, { yPercent: -110 });

    const tl = gsap.timeline();
    tl.to(el, { yPercent: 0, duration: 0.55, ease: "power3.inOut" })
      .to(el, { yPercent: 110, duration: 0.6, ease: "power3.inOut" }, "+=0.08")
      .set(el, { yPercent: -110 });

    return () => {
      tl.kill();
    };
  }, [pathname, reduced]);

  return (
    <div className="relative">
      <div
        ref={overlay}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] h-screen w-screen bg-[#07080b]"
        style={{
          backgroundImage:
            "radial-gradient(900px 520px at 20% 20%, rgba(140,180,255,0.08), transparent 62%), radial-gradient(700px 480px at 80% 30%, rgba(180,140,255,0.06), transparent 62%)",
        }}
      />
      {children}
    </div>
  );
}

