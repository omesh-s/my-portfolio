"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

export function CursorAura() {
  const reduced = usePrefersReducedMotion();
  const enabled = useRef(false);

  useEffect(() => {
    if (reduced) return;
    // Only on fine pointers (no touch).
    const mql = window.matchMedia("(pointer: fine)");
    if (!mql.matches) return;

    enabled.current = true;

    const onMove = (e: PointerEvent) => {
      document.documentElement.style.setProperty(
        "--cursor-x",
        `${e.clientX}px`
      );
      document.documentElement.style.setProperty(
        "--cursor-y",
        `${e.clientY}px`
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      enabled.current = false;
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  if (reduced) return null;
  return <div aria-hidden="true" className="cursor-aura" />;
}

