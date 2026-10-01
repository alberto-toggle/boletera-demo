export const clamp01 = (v: number): number => (v > 0 ? (v > 1 ? 1 : v) : 0)

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  if (edge0 === edge1) return x < edge0 ? 0 : 1
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** 12745012 → "12,745,012". Negative, fractional or non-finite input never prints garbage. */
export const formatCount = (n: number, sep: string = ","): string => {
  const v = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, sep)
}

/** A clip-path polygon with the four corners cut: top-left, top-right, bottom-right, bottom-left, in px. */
export const chamfer = (tl: number, tr: number, br: number, bl: number): string =>
  "polygon(" +
  [
    tl + "px 0",
    "calc(100% - " + tr + "px) 0",
    "100% " + tr + "px",
    "100% calc(100% - " + br + "px)",
    "calc(100% - " + br + "px) 100%",
    bl + "px 100%",
    "0 calc(100% - " + bl + "px)",
    "0 " + tl + "px",
  ].join(", ") +
  ")"

export type TypeTiming = { type: number; hold: number; erase: number; gap: number }
export const TYPE: TypeTiming = { type: 55, hold: 2600, erase: 22, gap: 420 }

/** Where a looping typewriter is after `ms`: type a phrase, hold it, erase it, pause, next. */
export const typeFrame = (
  phrases: string[],
  ms: number,
  k: TypeTiming = TYPE,
): { index: number; text: string; phase: "type" | "hold" | "erase" | "gap" } => {
  const list = phrases.filter((p) => p.length > 0)
  if (!list.length) return { index: 0, text: "", phase: "gap" }
  const spans = list.map((p) => p.length * k.type + k.hold + p.length * k.erase + k.gap)
  const total = spans.reduce((a, b) => a + b, 0)
  let t = Number.isFinite(ms) && total > 0 ? ((ms % total) + total) % total : 0
  let i = 0
  while (i < list.length - 1 && t >= spans[i]) t -= spans[i++]
  const p = list[i]
  const typing = p.length * k.type
  if (t < typing) return { index: i, text: p.slice(0, Math.floor(t / k.type) + 1), phase: "type" }
  t -= typing
  if (t < k.hold) return { index: i, text: p, phase: "hold" }
  t -= k.hold
  const erasing = p.length * k.erase
  if (t < erasing) return { index: i, text: p.slice(0, p.length - Math.floor(t / k.erase)), phase: "erase" }
  return { index: i, text: "", phase: "gap" }
}

/** A small integer hash → [0, 1). Deterministic, so a scramble frame is reproducible. */
export const hash = (n: number): number => {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b)
  x ^= x >>> 13
  x = Math.imul(x, 0xc2b2ae35)
  x ^= x >>> 16
  return (x >>> 0) / 4294967296
}

export const NOISE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>"

/**
 * The blurb decoding itself: at `p` = 0 every letter is noise, at 1 it is the
 * text. Letters settle left to right. Length and whitespace never change, so
 * justified text doesn't reflow while it decodes.
 */
export const scramble = (text: string, p: number, tick: number): string => {
  if (!(p < 1)) return text
  const n = text.length
  let out = ""
  for (let i = 0; i < n; i++) {
    const ch = text[i]
    if (/\s/.test(ch) || p * 1.3 - 0.3 > i / n) out += ch
    else out += NOISE[Math.floor(hash(i * 131 + tick * 7919) * NOISE.length)]
  }
  return out
}

export type Ring = { x: number; y: number; r: number; a: number }
export type Tone = {
  /** Where the halftone starts, as a fraction of the wordmark's height. */
  fade: number
  /** How much ink is left at the very bottom: 1 dissolves it completely. */
  depth: number
  /** The pointer lens: centre, radius (px) and strength 0 → 1. */
  lensX: number
  lensY: number
  lensR: number
  lens: number
  /** Print-in sweep, 0 → 1, left to right. */
  reveal: number
  /** Idle shimmer amplitude in the halftone band. */
  wave: number
  time: number
  rings: Ring[]
  ringW: number
}

/** How much ink a halftone cell at (x, y) keeps, 0 → 1. */
export const coverage = (x: number, y: number, w: number, h: number, s: Tone): number => {
  const ny = y / h
  let c = 1 - smoothstep(s.fade, 1.04, ny) * s.depth
  if (s.wave) c += s.wave * Math.sin((x / w) * 11 + s.time * 1.3 + ny * 4) * smoothstep(s.fade - 0.1, 1, ny)
  if (s.lens > 0) {
    const dx = x - s.lensX
    const dy = y - s.lensY
    c *= 1 - s.lens * Math.exp(-(dx * dx + dy * dy) / (s.lensR * s.lensR))
  }
  for (const g of s.rings) {
    const d = Math.hypot(x - g.x, y - g.y) - g.r
    c *= 1 - g.a * Math.exp(-(d * d) / (s.ringW * s.ringW))
  }
  c *= clamp01(s.reveal * 1.6 - (x / w) * 0.6)
  return clamp01(c)
}

/**
 * Dot radius for a coverage. Cells sit on staggered rows (every other row
 * shifted half a cell), whose covering radius is 0.625 of a cell — so a full
 * cell at 0.66 closes every gap and the letter reads solid.
 */
export const dotRadius = (c: number, cell: number): number => cell * 0.66 * Math.sqrt(clamp01(c))

/**
 * A point on the unit sphere: `theta` runs round the great circle through the
 * poles at longitude `lon`, then the globe is tipped (`tilt`, about x) and
 * leant (`roll`, about the view axis). z > 0 faces the viewer.
 */
export const project = (theta: number, lon: number, tilt: number, roll: number): [number, number, number] => {
  const x0 = Math.cos(theta) * Math.sin(lon)
  const y0 = Math.sin(theta)
  const z0 = Math.cos(theta) * Math.cos(lon)
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)
  const y1 = y0 * ct - z0 * st
  const z1 = y0 * st + z0 * ct
  const cr = Math.cos(roll)
  const sr = Math.sin(roll)
  return [x0 * cr - y1 * sr, x0 * sr + y1 * cr, z1]
}

/** The visible (front) half of one meridian as SVG path data, in screen space. */
export const meridianPath = (
  lon: number,
  tilt: number,
  roll: number,
  cx: number,
  cy: number,
  r: number,
  steps: number = 96,
): string => {
  let d = ""
  let pen = false
  for (let i = 0; i <= steps; i++) {
    const [x, y, z] = project((i / steps) * Math.PI * 2, lon, tilt, roll)
    if (z < 0) {
      pen = false
      continue
    }
    d += (pen ? "L" : "M") + (cx + r * x).toFixed(1) + " " + (cy - r * y).toFixed(1)
    pen = true
  }
  return d
}

/** The tallest a wordmark's ascenders may stand, as a fraction of its width. */
export const MAX_CAP = 0.2

/**
 * Font size and extra tracking (px) so a word fills the width `w`. Scaled to
 * the width, unless that would stand it taller than `maxH`: then it is capped
 * and the leftover is spread between the letters. `ink100` and `asc100` are
 * the word's ink width and ascent measured at 100px.
 */
export const fitWord = (
  ink100: number,
  asc100: number,
  w: number,
  maxH: number,
  letters: number,
): { size: number; extra: number } => {
  if (!(ink100 > 0) || !(w > 0)) return { size: 0, extra: 0 }
  let size = (100 * w) / ink100
  let extra = 0
  if (asc100 > 0 && maxH > 0 && (asc100 * size) / 100 > maxH) {
    size = (100 * maxH) / asc100
    if (letters > 1) extra = (w - (ink100 * size) / 100) / (letters - 1)
  }
  return { size, extra }
}

/** Next counter step: how long to wait and how many tickets land, from a rate in tickets/second. */
export const nextTick = (rate: number, rand: () => number = Math.random): { delay: number; add: number } => {
  const delay = 450 + rand() * 900
  const mean = Number.isFinite(rate) && rate > 0 ? (rate * delay) / 1000 : 0
  return { delay, add: mean > 0 ? Math.max(1, Math.round(mean * (0.4 + rand() * 1.2))) : 0 }
}
