"use client";

import dynamic from "next/dynamic";
import type { ForceGraphMethods } from "react-force-graph-2d";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import { forceCenter, forceX, forceY } from "d3-force";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

type TechNode = {
  id: string;
  label: string;
  tier: "primary" | "secondary";
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};

type TechLink = {
  source: string | TechNode;
  target: string | TechNode;
};

type SimulationBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type PointerState = {
  active: boolean;
  x: number;
  y: number;
};

function createWanderForce() {
  let nodes: TechNode[] = [];

  const force = (alpha: number) => {
    const t = performance.now() / 2100;
    for (let i = 0; i < nodes.length; i += 1) {
      const n = nodes[i];
      const drift = 0.05 * (0.65 + alpha);
      n.vx = (n.vx ?? 0) + Math.sin(t + i * 1.13) * drift;
      n.vy = (n.vy ?? 0) + Math.cos(t + i * 1.57) * drift;
      // Cap velocity so wander cannot fling nodes off-screen.
      n.vx = Math.max(-0.7, Math.min(0.7, n.vx));
      n.vy = Math.max(-0.7, Math.min(0.7, n.vy));
    }
  };

  // D3 calls initialize with the simulation nodes. We must use these,
  // not an external array, otherwise the force can appear to "do nothing".
  (force as ((alpha: number) => void) & { initialize: (initNodes: TechNode[]) => void }).initialize =
    (initNodes: TechNode[]) => {
      nodes = initNodes;
    };

  return force;
}

function createBoundsForce(boundsRef: React.RefObject<SimulationBounds>) {
  let nodes: TechNode[] = [];

  const force = (alpha: number) => {
    const b = boundsRef.current;
    if (!b) return;

    for (let i = 0; i < nodes.length; i += 1) {
      const n = nodes[i];
      const x = n.x ?? 0;
      const y = n.y ?? 0;
      const push = 0.16 * (0.55 + alpha);

      if (x < b.minX) n.vx = (n.vx ?? 0) + (b.minX - x) * push;
      if (x > b.maxX) n.vx = (n.vx ?? 0) - (x - b.maxX) * push;
      if (y < b.minY) n.vy = (n.vy ?? 0) + (b.minY - y) * push;
      if (y > b.maxY) n.vy = (n.vy ?? 0) - (y - b.maxY) * push;
    }
  };

  (force as ((alpha: number) => void) & { initialize: (initNodes: TechNode[]) => void }).initialize =
    (initNodes: TechNode[]) => {
      nodes = initNodes;
    };

  return force;
}

function createCursorRepelForce(pointerRef: React.RefObject<PointerState>) {
  let nodes: TechNode[] = [];

  const force = (alpha: number) => {
    const pointer = pointerRef.current;
    if (!pointer?.active) return;

    const radius = 280;
    const radiusSq = radius * radius;
    const strength = 1.35 * (0.85 + alpha);

    for (let i = 0; i < nodes.length; i += 1) {
      const n = nodes[i];
      const dx = (n.x ?? 0) - pointer.x;
      const dy = (n.y ?? 0) - pointer.y;
      const dSq = dx * dx + dy * dy;
      if (dSq > radiusSq) continue;

      const dist = Math.max(0.001, Math.sqrt(dSq));
      // Non-linear falloff makes near-cursor repulsion feel much stronger.
      const influence = Math.pow(1 - dist / radius, 2.7);
      const impulse = strength * influence;
      n.vx = (n.vx ?? 0) + (dx / dist) * impulse;
      n.vy = (n.vy ?? 0) + (dy / dist) * impulse;
    }
  };

  (force as ((alpha: number) => void) & { initialize: (initNodes: TechNode[]) => void }).initialize =
    (initNodes: TechNode[]) => {
      nodes = initNodes;
    };

  return force;
}

export function TechConstellationForce({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const graphRef = useRef<ForceGraphMethods<TechNode, TechLink> | undefined>(
    undefined
  );
  const didInitForcesRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState<{ w: number; h: number }>({ w: 420, h: 360 });
  const lastSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const pointerRef = useRef<PointerState>({ active: false, x: 0, y: 0 });
  const boundsRef = useRef<SimulationBounds>({
    minX: -260,
    maxX: 380,
    minY: -220,
    maxY: 220,
  });
  const reheatTimerRef = useRef<number | null>(null);
  const fitTimerRef = useRef<number | null>(null);

  const data = useMemo(() => {
    // Seed initial positions so the system starts "wide" instead of clumped.
    // (ForceGraph will still fully simulate; this just avoids early collision deadlocks.)
    const seed = () => ({
      x: 60 + (Math.random() - 0.5) * 440,
      y: (Math.random() - 0.5) * 300,
    });

    const nodes: TechNode[] = [
      { id: "fullstack", label: "Full Stack", tier: "primary", ...seed() },
      { id: "aiml", label: "AI/ML", tier: "primary", ...seed() },
      { id: "databases", label: "Databases", tier: "secondary", ...seed() },
      { id: "systems", label: "Systems", tier: "secondary", ...seed() },
      { id: "performance", label: "Performance", tier: "secondary", ...seed() },
    ];

    // No visible connecting lines; we keep the constellation as independently floating nodes.
    const links: TechLink[] = [];

    return { nodes, links };
  }, []);

  const configureForces = useCallback(
    (g: ForceGraphMethods<TechNode, TechLink>) => {
      // 1) Organic spacing (no rigid lattice)
      const charge = g.d3Force("charge");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (charge as any)?.strength?.(-190);

      // 2) Very weak center gravity (slight right bias)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("center", (() => {
        const c = forceCenter(50, 0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c as any).strength?.(0.08);
        return c;
      })());

      // Keep the swarm gently anchored so it doesn't drift out of frame.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("x", forceX(50).strength(0.02));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("y", forceY(0).strength(0.02));

      // 3) Collision OFF (allow overlap)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("collide", null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("collision", null);
      // Also clear link force if present from previous runs/hot reloads.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("link", null);

      // 4) Independent wander
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("wander", createWanderForce());
      // 5) Keep nodes inside a soft rectangular region
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("bounds", createBoundsForce(boundsRef));
      // 6) Repel nodes away from cursor when hovering the graph area
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("cursorRepel", createCursorRepelForce(pointerRef));

      // Keep flow energetic (no React state)
      if (!reduced) {
        if (reheatTimerRef.current != null) {
          window.clearInterval(reheatTimerRef.current);
        }
        reheatTimerRef.current = window.setInterval(() => {
          try {
            g.d3ReheatSimulation();
          } catch {
            // ignore
          }
        }, 1200);
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (g as any).d3AlphaTarget?.(0.06);
        g.d3ReheatSimulation();
      } catch {
        // ignore
      }

      // Start with a stable framing (avoid zoom-to-fit which can overshoot without links).
      try {
        g.centerAt(50, 0, 0);
        g.zoom(1.05, 0);
      } catch {
        // ignore
      }
    },
    [reduced]
  );

  // When the wrapper size meaningfully changes (including browser zoom),
  // re-fit the view *debounced* so nodes don't look like they collapse inward.
  useEffect(() => {
    const g = graphRef.current;
    if (!g || !didInitForcesRef.current) return;

    if (fitTimerRef.current) window.clearTimeout(fitTimerRef.current);
    fitTimerRef.current = window.setTimeout(() => {
      try {
        g.zoomToFit(400, 80);
      } catch {
        // ignore
      }
    }, 220);

    return () => {
      if (fitTimerRef.current) window.clearTimeout(fitTimerRef.current);
      fitTimerRef.current = null;
    };
  }, [size.w, size.h]);

  // Keep movement area responsive so constellation can spread further on larger screens.
  useEffect(() => {
    const halfW = Math.max(220, Math.min(420, size.w * 0.42));
    const halfH = Math.max(170, Math.min(290, size.h * 0.36));
    boundsRef.current = {
      minX: 50 - halfW,
      maxX: 50 + halfW,
      minY: -halfH,
      maxY: halfH,
    };
  }, [size.w, size.h]);

  // Track pointer globally and map it into simulation coordinates for local repel behavior.
  useEffect(() => {
    if (reduced) return;

    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        pointerRef.current.active = false;
        return;
      }

      const b = boundsRef.current;
      const relX = (e.clientX - rect.left) / Math.max(1, rect.width);
      const relY = (e.clientY - rect.top) / Math.max(1, rect.height);

      pointerRef.current.active = true;
      pointerRef.current.x = b.minX + relX * (b.maxX - b.minX);
      pointerRef.current.y = b.minY + relY * (b.maxY - b.minY);

      try {
        graphRef.current?.d3ReheatSimulation();
      } catch {
        // ignore
      }
    };

    const onLeaveWindow = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeaveWindow);
      pointerRef.current.active = false;
    };
  }, [reduced]);

  // Responsive sizing to its container
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;
    const ro = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const w = Math.max(260, Math.floor(r.width));
        const h = Math.max(500, Math.floor(r.height)); // STRICT: min-height 500px

        const prev = lastSizeRef.current;
        if (Math.abs(prev.w - w) < 2 && Math.abs(prev.h - h) < 2) return;
        lastSizeRef.current = { w, h };
        setSize({ w, h });
      });
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const setGraphInstance = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance: any) => {
      if (!instance) return;
      graphRef.current = instance as ForceGraphMethods<TechNode, TechLink>;
      if (didInitForcesRef.current) return;
      didInitForcesRef.current = true;
      configureForces(graphRef.current);
    },
    [configureForces]
  );

  const nodeCanvasObject = useCallback(
    (node: unknown, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const n = node as TechNode;
      const x = (n.x ?? 0) as number;
      const y = (n.y ?? 0) as number;

      // Keep sizes consistent in screen pixels regardless of zoom level.
      const scale = globalScale || 1;
      const r = (n.tier === "primary" ? 7.5 : 5.8) / scale;

      // High-quality glowing orb via radial gradients (white/pink core → purple/red glow)
      const isPrimary = n.tier === "primary";
      const haloR = r * (isPrimary ? 8.8 : 8.2);

      const outer = ctx.createRadialGradient(x, y, 0, x, y, haloR);
      outer.addColorStop(0.0, "rgba(255,120,205,0.16)");
      outer.addColorStop(0.22, "rgba(185,120,255,0.14)");
      outer.addColorStop(0.55, "rgba(255,80,110,0.08)");
      outer.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = outer;
      ctx.beginPath();
      ctx.arc(x, y, haloR, 0, Math.PI * 2);
      ctx.fill();

      const innerR = r * (isPrimary ? 3.0 : 2.7);
      const inner = ctx.createRadialGradient(x, y, 0, x, y, innerR);
      inner.addColorStop(0.0, "rgba(255,255,255,0.92)");
      inner.addColorStop(0.28, "rgba(255,155,215,0.88)");
      inner.addColorStop(0.62, "rgba(185,120,255,0.38)");
      inner.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = inner;
      ctx.beginPath();
      ctx.arc(x, y, innerR, 0, Math.PI * 2);
      ctx.fill();

      // Small hot core
      ctx.fillStyle = "rgba(255,240,255,0.95)";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Label text on canvas (crisp, slightly transparent)
      const fontSize = 13 / scale;
      ctx.font = `600 ${fontSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,255,255,0.78)";

      // Subtle drop shadow for readability against nebula
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      const padX = (r + 10);
      const labelY = y + (r + 16);
      ctx.fillText(n.label, x + padX, labelY);

      ctx.shadowBlur = 0;
    },
    []
  );

  return (
    <div
      ref={wrapRef}
      className={cn(
        // STRICT: wrapper must be fully transparent, no blur, no borders.
        // Also disable all pointer interaction.
        "pointer-events-none relative h-full w-full min-h-[500px] select-none bg-transparent border-0",
        className
      )}
    >
      <ForceGraph2D
        // ForceGraph2D generics are lost through next/dynamic; keep runtime ref working.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={setGraphInstance as any}
        graphData={data}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)" // STRICT: transparent canvas
        // STRICT: disable all user interaction
        enableNodeDrag={false}
        enableZoomInteraction={false}
        enablePanInteraction={false}
        enablePointerInteraction={false}
        // Keep it active unless reduced motion
        cooldownTicks={reduced ? 0 : Infinity}
        cooldownTime={reduced ? 0 : Infinity}
        d3AlphaDecay={reduced ? 1 : 0}
        d3VelocityDecay={0.1}
        nodeRelSize={2}
        // No visible links
        linkWidth={0}
        linkColor={() => "rgba(0,0,0,0)"}
        linkDirectionalParticles={0}
        // Custom glowing-orb rendering + labels (memoized)
        nodeCanvasObject={nodeCanvasObject}
      />
    </div>
  );
}

