"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

const VERT = `#version 300 es
precision highp float;
out vec2 v_uv;
// Fullscreen triangle (no vertex buffers).
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

// Adapted from "Singularity" by @XorDev (Shadertoy 3csSWB) via mechanical adaptation.
// Uniforms exposed for tuning + a simple tint/offset layer for art direction.
const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform float u_time;
uniform vec2 u_resolution;

uniform float u_i_init;
uniform float u_viewport_scale;
uniform float u_wave_amp;
uniform float u_loop_limit;
uniform float u_disk_scale;

uniform vec2 u_offset;     // art-direction offset in "p" space
uniform vec3 u_tint;       // multiply tint
uniform float u_intensity; // post intensity

void main() {
  // Iterator and attenuation
  float i = u_i_init, a;
  vec2 r = u_resolution;
  vec2 p = (gl_FragCoord.xy + gl_FragCoord.xy - r) / r.y / u_viewport_scale;
  p -= u_offset;

  vec2 d = vec2(-1.0, 1.0);
  vec2 b = p - i * d;
  vec2 c = p * mat2(1.0, 1.0, d / (0.1 + i / dot(b, b)));

  vec2 v = c * mat2(cos(0.5 * log(a = dot(c, c)) + u_time * i + vec4(0.0, 33.0, 11.0, 0.0))) / i;
  vec4 w = vec4(0.0);

  for (; i++ < u_loop_limit; w += 1.0 + sin(vec4(v, v))) {
    v += u_wave_amp * sin(v.yx * i + u_time) / i + 0.5;
  }

  float disk = length(sin(vec2(v) / u_disk_scale) * 0.4 + c * (3.0 + d));

  vec4 col = 1.0 - exp(
    -exp(c.x * vec4(0.6, -0.4, -1.0, 0.0))
    / max(w.xyyx, vec4(0.001))
    / (2.0 + disk * disk / 4.0 - disk)
    / (0.5 + 1.0 / max(a, 0.001))
    / (0.03 + abs(length(p) - 0.7))
  );

  vec3 rgb = col.rgb * u_tint * u_intensity;
  outColor = vec4(rgb, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("Failed to create shader");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log ?? "Shader compile failed");
  }
  return sh;
}

function link(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  const prog = gl.createProgram();
  if (!prog) throw new Error("Failed to create program");
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(log ?? "Program link failed");
  }
  return prog;
}

export function SingularityBackground({
  className,
  // Bias right by default on desktop; positive x moves singularity to the right visually.
  offset = { x: -0.34, y: 0.02 },
  intensity = 0.95,
  tint = [1.0, 0.74, 1.15] as [number, number, number],
}: {
  className?: string;
  offset?: { x: number; y: number };
  intensity?: number;
  tint?: [number, number, number];
}) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const uniforms = useMemo(
    () => ({
      u_i_init: 0.2,
      // Larger => zoomed out (smaller singularity).
      u_viewport_scale: 0.82,
      u_wave_amp: 0.72,
      u_loop_limit: 9.0,
      u_disk_scale: 0.3,
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true });
    if (!gl) return;

    let prog: WebGLProgram | null = null;
    try {
      prog = link(gl, VERT, FRAG);
    } catch {
      // Fail silently in production; background is optional.
      return;
    }

    gl.useProgram(prog);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    const loc = (n: string) => gl.getUniformLocation(prog!, n);
    const uTime = loc("u_time");
    const uRes = loc("u_resolution");
    const uIInit = loc("u_i_init");
    const uViewport = loc("u_viewport_scale");
    const uWave = loc("u_wave_amp");
    const uLoop = loc("u_loop_limit");
    const uDisk = loc("u_disk_scale");
    const uOffset = loc("u_offset");
    const uTint = loc("u_tint");
    const uIntensity = loc("u_intensity");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const render = (t: number) => {
      if (!startRef.current) startRef.current = t;
      const time = (t - startRef.current) / 1000;
      gl.uniform1f(uTime, reduced ? 0 : time);
      gl.uniform1f(uIInit, uniforms.u_i_init);
      gl.uniform1f(uViewport, uniforms.u_viewport_scale);
      gl.uniform1f(uWave, uniforms.u_wave_amp * (reduced ? 0.35 : 1.0));
      gl.uniform1f(uLoop, uniforms.u_loop_limit);
      gl.uniform1f(uDisk, uniforms.u_disk_scale);
      gl.uniform2f(uOffset, offset.x, offset.y);
      gl.uniform3f(uTint, tint[0], tint[1], tint[2]);
      gl.uniform1f(uIntensity, intensity * (reduced ? 0.85 : 1.0));

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduced) rafRef.current = window.requestAnimationFrame(render);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Start animating (or draw once in reduced motion).
    rafRef.current = window.requestAnimationFrame(render);

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (prog) gl.deleteProgram(prog);
    };
  }, [intensity, offset.x, offset.y, reduced, tint, uniforms]);

  return (
    <div
      className={cn("pointer-events-none", className)}
      style={{
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-70 md:opacity-80"
        style={{
          // Bias visibility to the right side; keeps it cinematic and avoids washing the left copy.
          WebkitMaskImage:
            "radial-gradient(55% 65% at 78% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 48%, rgba(0,0,0,0) 78%)",
          maskImage:
            "radial-gradient(55% 65% at 78% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 48%, rgba(0,0,0,0) 78%)",
        }}
      />
      {/* Feather bottom edge to avoid seams into next section */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          background:
            "radial-gradient(60% 70% at 75% 45%, rgba(190,120,255,0.10), transparent 60%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

