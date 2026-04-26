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

export function TechConstellationForce({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const graphRef = useRef<ForceGraphMethods<TechNode, TechLink> | undefined>(
    undefined
  );
  const didInitForcesRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState<{ w: number; h: number }>({ w: 420, h: 360 });
  const lastSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const reheatTimerRef = useRef<number | null>(null);
  const fitTimerRef = useRef<number | null>(null);

  const data = useMemo(() => {
    // Seed initial positions so the system starts "wide" instead of clumped.
    // (ForceGraph will still fully simulate; this just avoids early collision deadlocks.)
    const seed = () => ({
      x: 40 + (Math.random() - 0.5) * 240,
      y: (Math.random() - 0.5) * 180,
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
      (charge as any)?.strength?.(-520);

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
      (g as any).d3Force?.("x", forceX(50).strength(0.03));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g as any).d3Force?.("y", forceY(0).strength(0.03));

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
      (g as any).d3Force?.("wander", () => {
        const t = performance.now() / 2100;
        data.nodes.forEach((n: any, i: number) => {
          n.vx += Math.sin(t + i) * 0.035;
          n.vy += Math.cos(t + i * 1.5) * 0.035;
          // Cap velocity so wander can't fling nodes off-screen.
          n.vx = Math.max(-0.55, Math.min(0.55, n.vx));
          n.vy = Math.max(-0.55, Math.min(0.55, n.vy));
        });
      });

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
    [data.nodes, reduced]
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
        cooldownTicks={reduced ? 0 : undefined}
        cooldownTime={reduced ? 0 : undefined}
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

