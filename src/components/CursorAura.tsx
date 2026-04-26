"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

export function CursorAura() {
  const reduced = usePrefersReducedMotion();
  const enabled = useRef(false);
  const rafRef = useRef<number | null>(null);
  const pointRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  useEffect(() => {
    if (reduced) return;
    // Only on fine pointers (no touch).
    const mql = window.matchMedia("(pointer: fine)");
    if (!mql.matches) return;

    enabled.current = true;

    const flushPointer = () => {
      rafRef.current = null;
      const { x, y } = pointRef.current;
      const root = document.documentElement.style;
      root.setProperty("--cursor-x", `${x}px`);
      root.setProperty("--cursor-y", `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      pointRef.current.x = e.clientX;
      pointRef.current.y = e.clientY;
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(flushPointer);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      enabled.current = false;
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [reduced]);

  if (reduced) return null;
  return <div aria-hidden="true" className="cursor-aura" />;
}

