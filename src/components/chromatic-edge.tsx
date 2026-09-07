/**
 * Chromatic edge — a band pinned to the bottom of the viewport that smears
 * whatever scrolls underneath it, ramping from clean to a hard RGB split at the
 * very bottom of the screen.
 *
 * Reverse-engineered from strand.framer.website. Three ideas do the work:
 *
 *  1. `backdrop-filter`, not `filter`. The band has no content of its own — it
 *     filters what is BEHIND it, so the page scrolls through a stationary
 *     distortion instead of the distortion travelling with any one element.
 *
 *  2. The filter is a hand-built chromatic aberration: blur the backdrop, split
 *     it into pure R / G / B copies with three colour matrices, slide red left
 *     and blue right, then screen the three back together. Where the copies
 *     stop overlapping you get the coloured fringe.
 *
 *  3. `backdrop-filter` cannot be interpolated across a gradient, so intensity
 *     is faked with LAYERS stacked copies of the band. Each one carries a
 *     stronger filter and a mask exposing only its own horizontal slice, and the
 *     slices overlap so they cross-fade into a continuous ramp.
 *
 * LAYERS is the cost/quality dial: every layer is another backdrop-filter pass
 * recomputed on each scroll frame. The original uses 5; 3 keeps the shape of the
 * ramp for roughly half the work.
 *
 * Strength grows with the square of the layer index — the top of the band is
 * almost untouched and the bottom edge falls off a cliff, which is what makes
 * it read as an edge effect rather than a blurry strip.
 *
 * Caveat: `backdrop-filter: url(...)` is a Chromium capability. Safari's
 * `-webkit-backdrop-filter` takes only the shorthand functions (blur, saturate…)
 * and ignores SVG filter references, so there the band renders as nothing at
 * all. That is a clean degradation — the effect is decorative — but it does
 * mean most iOS visitors will never see it.
 */

const LAYERS = 3;

/** Peak displacement, as a fraction of the band's width (primitiveUnits="objectBoundingBox"). */
const MAX_STRENGTH = 0.006;

const ID = "chromatic-edge";

/** Isolates one channel and keeps alpha. */
const CHANNEL = {
  r: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  g: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  b: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
};

export function ChromaticEdge() {
  // One slice per layer. Derived from LAYERS rather than hardcoded, so the count
  // stays a single knob: fewer layers means a coarser ramp, never a broken one.
  const slice = 100 / LAYERS;
  const at = (n: number) => `${+(n * slice).toFixed(3)}%`;

  const layers = Array.from({ length: LAYERS }, (_, i) => ({
    id: `${ID}-${i}`,
    // quadratic ramp: barely there at the top, all of it at the bottom edge
    strength: MAX_STRENGTH * ((i + 1) / LAYERS) ** 2,
    // opaque across its own slice, feathering a full slice into each neighbour
    mask: `linear-gradient(to bottom, transparent ${at(i)}, #000 ${at(i + 1)}, #000 ${at(i + 2)}, transparent ${at(i + 3)})`,
  }));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[9vh] min-h-[52px] max-h-[88px] overflow-hidden motion-reduce:hidden"
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          {layers.map(({ id, strength }) => (
            <filter
              key={id}
              id={id}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              primitiveUnits="objectBoundingBox"
              /* linearRGB would wash the fringe out to grey */
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blurred" />
              <feOffset in="blurred" dx={-strength * (2 / 3)} dy="0" result="shifted" />
              <feColorMatrix in="shifted" type="matrix" values={CHANNEL.r} result="r" />
              <feColorMatrix in="shifted" type="matrix" values={CHANNEL.g} result="g" />
              <feColorMatrix in="shifted" type="matrix" values={CHANNEL.b} result="b" />
              <feOffset in="r" dx={-strength} dy="0" result="rOff" />
              <feOffset in="g" dx="0" dy="0" result="gOff" />
              <feOffset in="b" dx={strength} dy="0" result="bOff" />
              <feBlend in="rOff" in2="gOff" mode="screen" result="rg" />
              <feBlend in="rg" in2="bOff" mode="screen" />
            </filter>
          ))}
        </defs>
      </svg>

      {layers.map(({ id, mask }) => (
        <div
          key={id}
          className="absolute inset-0"
          style={{
            backdropFilter: `url(#${id})`,
            WebkitBackdropFilter: `url(#${id})`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      ))}
    </div>
  );
}
