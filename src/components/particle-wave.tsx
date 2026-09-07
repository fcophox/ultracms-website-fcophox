"use client";

import { useEffect, useRef } from "react";

/**
 * Particle wave — a grid of points deformed by travelling sine waves and drawn
 * in perspective, looping forever.
 *
 * Written against raw WebGL rather than three.js on purpose. The scene is one
 * thing: a single gl.POINTS draw call whose vertices are displaced in the vertex
 * shader. There is no geometry, no material, no lighting and no scene graph to
 * manage, so a 3D engine would add ~150 KB gzipped to the bundle to run code we
 * would still have to write ourselves.
 *
 * Everything moves on the GPU. The only per-frame work on the main thread is
 * writing the uniforms, so the animation keeps its frame rate even while the
 * page is busy hydrating or loading images.
 *
 * Every tunable lives in WaveParams and reaches the shader as a uniform, so the
 * tuning page at /particle-lab can drive the real component instead of a copy
 * of it that then drifts out of sync.
 */

export type WaveParams = {
  /** Grid resolution. Changing these rebuilds the vertex buffer. */
  cols: number;
  rows: number;

  /** Plane size in world units. Wider needs more cols or the grid thins out. */
  xScale: number;
  zScale: number;
  /** How far the plane sits below the camera. */
  yOffset: number;

  /** Multiplies all four wave amplitudes — relief, not busyness. */
  amp: number;
  /** Multiplies all four wave speeds — busyness, not relief. */
  speed: number;

  /** Camera tilt in radians. Negative lifts far rows toward the horizon. */
  pitch: number;
  /** Camera distance. Lower dollies in and strengthens the perspective. */
  camDist: number;
  focal: number;

  /** Final framing in clip space. */
  vStretch: number;
  yShift: number;

  /** Depth fade, measured out from camDist. */
  depthFar: number;
  depthNear: number;

  /** Where the left/right feather starts, in grid coords (1.0 = no fade). */
  edgeStart: number;

  /** Point size before the perspective divide, and its clamps in px. */
  pointScale: number;
  pointMin: number;
  pointMax: number;

  /** Peak opacity of a dot. */
  alpha: number;
};

/**
 * Tuned by eye at /particle-lab, which drives this component directly. Earlier
 * values were fitted by rendering offscreen and counting lit pixels — a way to
 * work blind, not a better method. Change them there, not here.
 */
export const WAVE_DEFAULTS: WaveParams = {
  cols: 336,
  rows: 110,
  xScale: 6.7,
  zScale: 2.8,
  yOffset: 0.71,
  amp: 1.6,
  speed: 1.35,
  pitch: -0.36,
  camDist: 5.8,
  focal: 4,
  vStretch: 0.84,
  yShift: 0.48,
  depthFar: 2.4,
  depthNear: 0.7,
  edgeStart: 0.53,
  pointScale: 22,
  pointMin: 1.5,
  pointMax: 3,
  alpha: 0.5,
};

/** Cap the device pixel ratio: past 2x the extra pixels buy nothing visible. */
const MAX_DPR = 2;

const VERT = `
attribute vec2 aGrid;          // position on the plane, both axes in [-1, 1]

uniform float uTime;
uniform float uAspect;
uniform float uDpr;

uniform float uXScale, uZScale, uYOffset;
uniform float uAmp, uSpeed;
uniform float uPitch, uCamDist, uFocal;
uniform float uVStretch, uYShift;
uniform float uDepthFar, uDepthNear;
uniform float uEdgeStart;
uniform float uPointScale, uPointMin, uPointMax;

varying float vDepth;          // 0 far, 1 near — drives the fade
varying float vCrest;          // -1 trough, 1 crest — drives the colour

void main() {
  float x = aGrid.x;
  float z = aGrid.y;
  float t = uTime * uSpeed;

  // Four sines at incommensurable frequencies. Because the periods never line
  // up, the surface never visibly repeats — that is what sells an infinite loop
  // without storing any state between frames.
  //
  // uAmp and uSpeed are deliberately separate knobs: scaling amplitude deepens
  // the same swell, scaling speed only makes it busier.
  float y = (
      sin(x * 2.20 + t * 0.45) * 0.150
    + sin(z * 1.70 - t * 0.32) * 0.120
    + sin((x + z) * 1.30 + t * 0.23) * 0.085
    + sin((x * 0.70 - z * 1.90) + t * 0.17) * 0.055
  ) * uAmp;

  vCrest = y * 4.0 / max(uAmp, 0.001);

  // Feather the outermost sliver of the grid so the plane has no hard border.
  // Push uEdgeStart out and the mesh bleeds off the sides instead of tapering.
  float edge = 1.0 - smoothstep(uEdgeStart, 1.0, abs(x));

  vec3 p = vec3(x * uXScale, y - uYOffset, z * uZScale);

  // Pitch the scene so the camera looks onto the plane rather than along it. A
  // vertical offset alone cannot do this: it slides an edge-on view up and down
  // the frame but never reveals more surface.
  //
  // The sign matters and is easy to get backwards. Negative tilts the far rows
  // UP toward the horizon and drops the near rows toward the viewer, which is
  // how a receding plane actually reads. Positive turns the surface inside out.
  float cp = cos(uPitch);
  float sp = sin(uPitch);
  vec3 q = vec3(p.x, p.y * cp - p.z * sp, p.y * sp + p.z * cp);

  // uFocal and uCamDist together choose the lens. Pulling the camera back while
  // opening the focal length flattens the perspective — far and near cells stay
  // closer in size — where dollying in exaggerates it. Neither is more correct;
  // the current defaults take the flat, long-lens end.
  float camZ = q.z + uCamDist;

  vDepth = smoothstep(uCamDist + uDepthFar, uCamDist - uDepthNear, camZ) * edge;

  gl_Position = vec4(
    (q.x * uFocal / camZ) / uAspect,
    (q.y * uFocal / camZ) * uVStretch + uYShift,
    0.0,
    1.0
  );

  // Points shrink with distance like anything else in perspective. The scale is
  // not a taste knob: too low and the sprites land under a pixel, the round
  // mask in the fragment shader eats what is left, and the grid disappears.
  gl_PointSize = clamp(uPointScale / camZ, uPointMin, uPointMax) * uDpr;
}
`;

const FRAG = `
precision mediump float;

uniform vec3 uLow;
uniform vec3 uHigh;
uniform float uAlpha;

varying float vDepth;
varying float vCrest;

void main() {
  // Round the square point sprite off, or the grid reads as pixels not dots.
  float d = length(gl_PointCoord - 0.5);
  float dot = smoothstep(0.5, 0.15, d);

  float a = dot * vDepth * uAlpha;
  if (a < 0.002) discard;

  vec3 col = mix(uLow, uHigh, clamp(vCrest * 0.5 + 0.5, 0.0, 1.0));

  // Premultiplied: the blend expects colour already scaled by alpha.
  gl_FragColor = vec4(col * a, a);
}
`;

const UNIFORM_NAMES = [
  "uTime", "uAspect", "uDpr",
  "uXScale", "uZScale", "uYOffset",
  "uAmp", "uSpeed",
  "uPitch", "uCamDist", "uFocal",
  "uVStretch", "uYShift",
  "uDepthFar", "uDepthNear",
  "uEdgeStart",
  "uPointScale", "uPointMin", "uPointMax",
  "uAlpha",
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

/** Resolves a CSS custom property to concrete rgb, so the mesh follows the design tokens. */
function tokenToRgb(el: HTMLElement, token: string, fallback: [number, number, number]) {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${token})`;
  el.appendChild(probe);
  const parsed = getComputedStyle(probe).color.match(/[\d.]+/g);
  probe.remove();
  if (!parsed || parsed.length < 3) return fallback;
  return [+parsed[0] / 255, +parsed[1] / 255, +parsed[2] / 255] as [number, number, number];
}

export function ParticleWave({
  className = "",
  params,
}: {
  className?: string;
  params?: Partial<WaveParams>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Params reach the render loop through a ref so that dragging a slider never
  // tears down the GL context — only cols/rows rebuild anything.
  const p: WaveParams = { ...WAVE_DEFAULTS, ...params };
  const paramsRef = useRef(p);
  paramsRef.current = p;

  const redrawRef = useRef<(() => void) | null>(null);
  const { cols, rows } = p;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    // No WebGL (old browser, blocklisted GPU): the canvas stays empty. It is
    // decorative, so that is the whole fallback.
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

    // The grid is uploaded once. The wave is entirely a function of the clock,
    // so there is no vertex data to re-send per frame.
    const verts = new Float32Array(cols * rows * 2);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        verts[i++] = (c / (cols - 1)) * 2 - 1;
        verts[i++] = (r / (rows - 1)) * 2 - 1;
      }
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    const aGrid = gl.getAttribLocation(prog, "aGrid");
    gl.enableVertexAttribArray(aGrid);
    gl.vertexAttribPointer(aGrid, 2, gl.FLOAT, false, 0, 0);

    const u = Object.fromEntries(
      UNIFORM_NAMES.map((n) => [n, gl.getUniformLocation(prog, n)]),
    ) as Record<(typeof UNIFORM_NAMES)[number], WebGLUniformLocation | null>;

    const host = canvas.parentElement ?? document.body;
    gl.uniform3fv(gl.getUniformLocation(prog, "uLow"), tokenToRgb(host, "--color-primary", [0.376, 0.647, 0.98]));
    gl.uniform3fv(gl.getUniformLocation(prog, "uHigh"), tokenToRgb(host, "--color-secondary", [0.655, 0.545, 0.98]));

    gl.enable(gl.BLEND);
    // Premultiplied source-over. Additive would blow the crests out to white
    // where the waves overlap; this keeps the palette intact.
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(u.uAspect, rect.width / rect.height);
      gl.uniform1f(u.uDpr, dpr);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (t: number) => {
      const v = paramsRef.current;
      gl.uniform1f(u.uTime, t);
      gl.uniform1f(u.uXScale, v.xScale);
      gl.uniform1f(u.uZScale, v.zScale);
      gl.uniform1f(u.uYOffset, v.yOffset);
      gl.uniform1f(u.uAmp, v.amp);
      gl.uniform1f(u.uSpeed, v.speed);
      gl.uniform1f(u.uPitch, v.pitch);
      gl.uniform1f(u.uCamDist, v.camDist);
      gl.uniform1f(u.uFocal, v.focal);
      gl.uniform1f(u.uVStretch, v.vStretch);
      gl.uniform1f(u.uYShift, v.yShift);
      gl.uniform1f(u.uDepthFar, v.depthFar);
      gl.uniform1f(u.uDepthNear, v.depthNear);
      gl.uniform1f(u.uEdgeStart, v.edgeStart);
      gl.uniform1f(u.uPointScale, v.pointScale);
      gl.uniform1f(u.uPointMin, v.pointMin);
      gl.uniform1f(u.uPointMax, v.pointMax);
      gl.uniform1f(u.uAlpha, v.alpha);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, cols * rows);
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

    // Lets a paused canvas still repaint when a slider moves.
    redrawRef.current = () => {
      if (!running) draw(lastT);
    };

    // Reduced motion still gets the mesh, just frozen: the shape is the
    // content, the drift is the decoration.
    if (reduced.matches) draw(0);

    // Off-screen and background tabs cost nothing.
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
    // Only the grid resolution owns GL resources; everything else is a uniform.
  }, [cols, rows]);

  // Repaint a frozen canvas when a control moves.
  useEffect(() => {
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
