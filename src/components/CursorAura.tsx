"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

export function CursorAura() {
  const reduced = usePrefersReducedMotion();
  const enabled = useRef(false);
  const raf = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    // Only on fine pointers (no touch).
    const mql = window.matchMedia("(pointer: fine)");
    if (!mql.matches) return;

    enabled.current = true;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (raf.current != null) return;
      raf.current = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      raf.current = null;
      const lerp = 0.18;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;
      document.documentElement.style.setProperty(
        "--cursor-x",
        `${current.current.x}px`
      );
      document.documentElement.style.setProperty(
        "--cursor-y",
        `${current.current.y}px`
      );
      // keep easing while moving
      const dx = Math.abs(target.current.x - current.current.x);
      const dy = Math.abs(target.current.y - current.current.y);
      if (dx + dy > 0.25) raf.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      enabled.current = false;
      window.removeEventListener("pointermove", onMove);
      if (raf.current != null) window.cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [reduced]);

  if (reduced) return null;
  return <div aria-hidden="true" className="cursor-aura" />;
}

