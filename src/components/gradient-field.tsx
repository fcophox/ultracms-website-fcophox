"use client";

import { useEffect, useRef } from "react";

/**
 * Gradient field — a flowing colour field painted procedurally, meant to stand
 * in for the blurred looping video behind the hero.
 *
 * The point is not the 248 KB the video weighs; that is less than one photo.
 * It is the `blur-3xl` the video is drawn through: a 64px gaussian over the
 * whole viewport, recomputed every frame on top of a continuous h264 decode.
 * A shader does not need that pass at all — softness is painted, not
 * post-processed, so the most expensive part of the old approach simply stops
 * existing.
 *
 * One fullscreen quad, no geometry, no engine. Colours come from the design
 * tokens, so the field follows a palette change that a baked video cannot.
 */

export type FieldParams = {
  /** Noise zoom. Lower is broader, calmer shapes. */
  scale: number;
  /** Drift speed. */
  speed: number;
  /** Domain-warp strength — how much the field folds into itself. */
  warp: number;
  /** How strongly the colour sits over the page background. */
  intensity: number;
  /** Pushes the field toward flat or toward defined blobs. */
  contrast: number;
  /** Balance between the primary and secondary token. */
  mixBias: number;
  /** Corner darkening. */
  vignette: number;
  /** Dither strength. A little breaks up banding on wide flat gradients. */
  grain: number;
  /**
   * How far up the frame the bottom dissolves into the page background, as a
   * fraction of the height. Baked into the shader rather than layered as a CSS
   * gradient on top: one less full-viewport surface to composite every frame,
   * and the field then hands off to the page on its own wherever it is used.
   */
  bottomFade: number;
  /**
   * Render scale. The field has no hard edges, so drawing it at a fraction of
   * the viewport and letting the browser upscale is invisible — and it is the
   * single biggest lever on cost, since this shader is fragment-bound.
   */
  resolution: number;
};

/** Tuned by eye at /hero-lab, which drives this component directly. */
export const FIELD_DEFAULTS: FieldParams = {
  scale: 0.75,
  speed: 0.355,
  warp: 2.45,
  intensity: 1.02,
  contrast: 0.7,
  mixBias: 0.31,
  vignette: 0.95,
  grain: 0.018,
  bottomFade: 0.7,
  resolution: 1,
};

const MAX_DPR = 2;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2  uRes;
uniform vec3  uA, uB, uBg;
uniform float uScale, uSpeed, uWarp, uIntensity, uContrast, uMixBias, uVignette, uGrain, uBottomFade;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);   // smoothstep, so the field has no creases
  return mix(
    mix(hash(i),                hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Three octaves, not the usual five. Past three the detail lands below the
// resolution this is rendered at, so the extra samples cost and show nothing.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  // Sample around the CENTRE of the canvas, not its corner.
  //
  // With the origin at the corner, changing the aspect ratio slid the whole
  // sampling window across the noise instead of just widening it, so the same
  // parameters showed a different region of the field at every viewport shape —
  // hero against lab, and desktop against portrait phones. Centring pins the
  // middle of the canvas to a fixed point in the field: aspect now only decides
  // how much is revealed left and right, never what sits in the middle.
  vec2 p = (vUv - 0.5) * uScale;
  p.x *= uRes.x / max(uRes.y, 1.0);

  float t = uTime * uSpeed;

  // Domain warping: feed the field its own offset shape. This is what turns
  // plain noise into something that folds and drifts like liquid instead of
  // sliding past like a texture.
  vec2 q = vec2(
    fbm(p + vec2(0.0, t)),
    fbm(p + vec2(5.2, 1.3) - t * 0.8)
  );
  float f = fbm(p + uWarp * q + vec2(1.7, 9.2) + t * 0.5);

  float m = clamp((f - 0.5) * uContrast + 0.5, 0.0, 1.0);

  // q.x drives which token shows where, so the two colours travel with the
  // shapes rather than being a fixed left-to-right ramp.
  vec3 tint = mix(uA, uB, clamp(q.x * uMixBias * 2.0, 0.0, 1.0));
  vec3 col = mix(uBg, tint, m * uIntensity);

  vec2 d = vUv - 0.5;
  col *= 1.0 - uVignette * dot(d, d) * 2.0;

  // Dissolve the bottom into the page colour so the field ends by handing off
  // to the page instead of stopping on an edge. vUv.y is 0 at the bottom here.
  col = mix(uBg, col, smoothstep(0.0, max(uBottomFade, 0.001), vUv.y));

  // Ordered-ish dither. Wide, nearly flat gradients band badly in 8 bits.
  col += (hash(vUv * uRes) - 0.5) * uGrain;

  gl_FragColor = vec4(col, 1.0);
}
`;

const UNIFORMS = [
  "uTime", "uRes", "uA", "uB", "uBg",
  "uScale", "uSpeed", "uWarp", "uIntensity", "uContrast", "uMixBias",
  "uVignette", "uGrain", "uBottomFade",
] as const;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function tokenToRgb(el: HTMLElement, token: string, fallback: [number, number, number]) {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${token})`;
  el.appendChild(probe);
  const parsed = getComputedStyle(probe).color.match(/[\d.]+/g);
  probe.remove();
  if (!parsed || parsed.length < 3) return fallback;
  return [+parsed[0] / 255, +parsed[1] / 255, +parsed[2] / 255] as [number, number, number];
}

export function GradientField({
  className = "",
  params,
}: {
  className?: string;
  params?: Partial<FieldParams>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const p: FieldParams = { ...FIELD_DEFAULTS, ...params };
  const paramsRef = useRef(p);
  paramsRef.current = p;

  const redrawRef = useRef<(() => void) | null>(null);
  const resizeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    // No WebGL: the canvas stays empty and whatever sits behind it shows
    // through. Callers keep a CSS gradient there as the fallback.
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Two triangles covering clip space. That is the entire geometry.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = Object.fromEntries(
      UNIFORMS.map((n) => [n, gl.getUniformLocation(prog, n)]),
    ) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;

    const host = canvas.parentElement ?? document.body;
    gl.uniform3fv(u.uA, tokenToRgb(host, "--color-primary", [0.376, 0.647, 0.98]));
    gl.uniform3fv(u.uB, tokenToRgb(host, "--color-secondary", [0.655, 0.545, 0.98]));
    gl.uniform3fv(u.uBg, tokenToRgb(host, "--color-background", [0.063, 0.063, 0.071]));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) * paramsRef.current.resolution;
      canvas.width = Math.max(2, Math.round(rect.width * dpr));
      canvas.height = Math.max(2, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
    };
    resizeRef.current = resize;
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (t: number) => {
      const v = paramsRef.current;
      gl.uniform1f(u.uTime, t);
      gl.uniform1f(u.uScale, v.scale);
      gl.uniform1f(u.uSpeed, v.speed);
      gl.uniform1f(u.uWarp, v.warp);
      gl.uniform1f(u.uIntensity, v.intensity);
      gl.uniform1f(u.uContrast, v.contrast);
      gl.uniform1f(u.uMixBias, v.mixBias);
      gl.uniform1f(u.uVignette, v.vignette);
      gl.uniform1f(u.uGrain, v.grain);
      gl.uniform1f(u.uBottomFade, v.bottomFade);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let running = false;
    let start = 0;
    let lastT = 0;

    const loop = (now: number) => {
      if (!start) start = now;
      lastT = (now - start) / 1000;
      draw(lastT);
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    const play = () => {
      if (running || reduced.matches) return;
      running = true;
      start = 0;
      raf = requestAnimationFrame(loop);
    };

    redrawRef.current = () => {
      if (!running) draw(lastT);
    };

    if (reduced.matches) draw(0);

    // The old <video> kept decoding regardless. This stops entirely when the
    // hero scrolls away or the tab goes to the background.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? play() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : undefined);
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionChange = () => {
      stop();
      if (reduced.matches) draw(lastT);
      else play();
    };
    reduced.addEventListener("change", onMotionChange);

    return () => {
      stop();
      redrawRef.current = null;
      resizeRef.current = null;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionChange);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  // Resolution changes the drawing-buffer size, so it needs a resize, not just
  // a repaint. Everything else is a uniform.
  useEffect(() => {
    resizeRef.current?.();
    redrawRef.current?.();
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}
