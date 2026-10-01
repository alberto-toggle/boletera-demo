"use client"

import * as React from "react"

/**
 * Ticket Stub Footer — a dark, hairline-ruled closing section for an ops
 * product, with the brand printed on an orange ticket.
 *
 * Top: a numbered section index, a hero (typewriter eyebrow, light grotesk
 * headline, chamfered CTA), a slowly turning globe of meridians with orange
 * tickets flying over it, and two link columns. Below: an orange ticket with a
 * punchable stub, a live agent status, a rolling "tickets solved" odometer, a
 * mono blurb that decodes itself in, and a full-width serif wordmark whose
 * foot dissolves into a halftone. Point at the wordmark and it breaks into
 * dots under the pointer; click and a ripple runs through it.
 *
 * No dependencies and nothing fetched: React is the only import, the globe is
 * SVG built from numbers, the wordmark is canvas drawn from system fonts.
 */

import { chamfer, formatCount, typeFrame, scramble, nextTick, meridianPath, project, fitWord, MAX_CAP, coverage, dotRadius, clamp01, type Ring, type Tone } from "./ticket-stub-footer-utils";
import "./ticket-stub-footer.css";

export type StubLink = { label: string; href?: string }
export type StubLinkGroup = { title: string; links: StubLink[] }

export type TicketStubFooterProps = {
  /** Product name. Printed as the wordmark and in the footer. */
  brand?: string
  /** What the ticket prints, if not the brand. The first lowercase "i" gets a diamond for a dot. */
  wordmark?: string
  /** Footer copyright line, e.g. "Dispatch AI". */
  company?: string
  year?: string | number
  /** Numbered index down the left. Without an href an item is a button that just becomes active. */
  sections?: StubLink[]
  /** Initially active index row. */
  defaultSection?: number
  onSectionChange?: (index: number) => void
  /** Eyebrow phrases, typed out in turn. */
  eyebrow?: string[]
  /** Headline, one entry per line. */
  headline?: string[]
  description?: string
  cta?: StubLink
  onCtaClick?: () => void
  /** Link columns on the right. Two read best. */
  linkGroups?: StubLinkGroup[]
  /** Status toggle labels: [running, paused]. */
  statusLabels?: [string, string]
  statusCaption?: string
  defaultActive?: boolean
  onStatusChange?: (active: boolean) => void
  /** Starting value of the counter. */
  count?: number
  countLabel?: string
  /** Average tickets per second while running. 0 stops the counter. */
  rate?: number
  /** Mono paragraph on the ticket. */
  blurb?: string
  /** Footer links after the copyright. No href renders as plain text. */
  legal?: StubLink[]
  /** Fired when the stub is punched, with the new total. */
  onDispatch?: (total: number) => void
  /** Page colour behind everything. */
  background?: string
  /** Cream text and the CTA. */
  ink?: string
  /** Secondary text. */
  muted?: string
  /** The ticket. */
  accent?: string
  /** The stub, a shade darker than the ticket. */
  accentDeep?: string
  /** Text and wordmark on the ticket. */
  accentInk?: string
  /** Headlines, links and body. */
  fontSans?: string
  /** The wordmark. */
  fontSerif?: string
  /** Eyebrow and blurb. */
  fontMono?: string
  /** Wordmark weight. */
  serifWeight?: number
  /** Halftone foot on the wordmark, plus the pointer lens. false prints it solid. */
  halftone?: boolean
  className?: string
}

const DEFAULT_SECTIONS: StubLink[] = [
  { label: "Intro" },
  { label: "Capabilities" },
  { label: "Performance" },
  { label: "Features" },
  { label: "Integrations" },
  { label: "Pricing" },
  { label: "Testimonials" },
  { label: "Resources" },
]

const DEFAULT_LINKS: StubLinkGroup[] = [
  {
    title: "Pages",
    links: [{ label: "Homepage" }, { label: "Company" }, { label: "Updates" }, { label: "Waitlist" }, { label: "Blog" }, { label: "404" }],
  },
  {
    title: "Social",
    links: [{ label: "Telegram" }, { label: "Youtube" }, { label: "Linkedin" }, { label: "Discord" }, { label: "Github" }, { label: "X" }],
  },
]

const DEFAULT_EYEBROW = ["Ready to ship support ops", "Guardrails on, humans in the loop", "Routing tickets while you sleep"]

const SANS = '"Neue Montreal", "Inter Tight", Inter, "Helvetica Neue", Helvetica, Arial, sans-serif'
const SERIF =
  '"GT Super Display", Canela, Didot, "Bodoni 72", "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, "Times New Roman", serif'
const MONO = '"JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

/** Diamond with a play cut-out: the brand mark on the stub and in the footer. */
function Mark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-hidden="true" focusable="false">
      <path fillRule="evenodd" fill="currentColor" d="M24 1.5 46.5 24 24 46.5 1.5 24Z M19.5 15.5 32 24 19.5 32.5Z" />
    </svg>
  )
}

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    if (typeof matchMedia === "undefined") return
    const mq = matchMedia("(prefers-reduced-motion: reduce)")
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener("change", onMq)
    return () => mq.removeEventListener("change", onMq)
  }, [])
  return reduced
}

/** Rolling digits. Keys count from the right so a digit keeps its column as the number grows. */
function Odometer({ value }: { value: number }) {
  const s = formatCount(value)
  return (
    <span className="tsf-odo" aria-hidden="true">
      {s.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span className="tsf-odo-d" key={s.length - i}>
            <span className="tsf-odo-s" style={{ transform: "translateY(" + -Number(ch) * 10 + "%)" }}>
              {"0123456789".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={"s" + (s.length - i)}>{ch}</span>
        ),
      )}
    </span>
  )
}

function Eyebrow({ phrases, reduced, visible }: { phrases: string[]; reduced: boolean; visible: boolean }) {
  const [ms, setMs] = React.useState(0)
  const msRef = React.useRef(0)
  React.useEffect(() => {
    if (reduced || !visible) return
    const t0 = performance.now() - msRef.current
    const id = setInterval(() => {
      msRef.current = performance.now() - t0
      setMs(msRef.current)
    }, 40)
    return () => clearInterval(id)
  }, [reduced, visible])
  const text = reduced ? phrases[0] ?? "" : typeFrame(phrases, ms).text
  return (
    <div className="tsf-eyebrow">
      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <path d="M6 1 11 6 6 11 1 6Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="sr-only">{phrases[0]}</span>
      <span className="tsf-type" aria-hidden="true">
        {text}
        {!reduced && <span className="tsf-caret" />}
      </span>
      <span className="tsf-dots" aria-hidden="true" />
    </div>
  )
}

/** The blurb decodes itself the first time it is seen. */
function Blurb({ text, reduced, visible }: { text: string; reduced: boolean; visible: boolean }) {
  const [shown, setShown] = React.useState(text)
  const done = React.useRef(false)
  React.useEffect(() => {
    if (reduced || !visible || done.current) {
      setShown(text)
      return
    }
    done.current = true
    let raf = 0
    const t0 = performance.now()
    const step = (now: number) => {
      const p = (now - t0) / 1400
      setShown(scramble(text, p, Math.floor((now - t0) / 45)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [text, reduced, visible])
  return (
    <p className="tsf-blurb">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </p>
  )
}

type Packet = { k: number; theta: number; speed: number; life: number }

const MERIDIANS = 12
const TILT = 0.34
const ROLL = -1.36

/** A turning globe of meridians. Drag to spin it; punched tickets fly over it. */
function Orbit({ reduced, visible, pulse }: { reduced: boolean; visible: boolean; pulse: number }) {
  const boxRef = React.useRef<HTMLDivElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const paths = React.useRef<(SVGPathElement | null)[]>([])
  const dots = React.useRef<(SVGCircleElement | null)[]>([])
  const st = React.useRef({
    spin: 0.4,
    vel: 0.14,
    drag: false,
    lastX: 0,
    lastT: 0,
    w: 1,
    h: 1,
    packets: [{ k: 3, theta: -1.2, speed: 0.32, life: Infinity }] as Packet[],
    paint: () => {},
  })

  React.useEffect(() => {
    const s = st.current
    if (pulse > 0 && s.packets.length < 7) {
      s.packets.push({ k: Math.floor(Math.random() * MERIDIANS), theta: -1.6, speed: 0.9 + Math.random() * 0.5, life: 1 })
      s.paint()
    }
  }, [pulse])

  React.useEffect(() => {
    const svg = svgRef.current
    const s = st.current
    if (!svg) return
    const paint = () => {
      const { w, h } = s
      const cx = w * 0.56
      const cy = h * 1.5
      const r = Math.min(h * 1.42, w * 0.62)
      for (let k = 0; k < MERIDIANS; k++) {
        const el = paths.current[k]
        if (el) el.setAttribute("d", meridianPath(s.spin + (k * Math.PI) / MERIDIANS, TILT, ROLL, cx, cy, r))
      }
      for (let i = 0; i < 7; i++) {
        const el = dots.current[i]
        const p = s.packets[i]
        if (!el) continue
        if (!p) {
          el.setAttribute("opacity", "0")
          continue
        }
        const [x, y, z] = project(p.theta, s.spin + (p.k * Math.PI) / MERIDIANS, TILT, ROLL)
        const Y = cy - r * y
        el.setAttribute("cx", (cx + r * x).toFixed(1))
        el.setAttribute("cy", Y.toFixed(1))
        el.setAttribute("opacity", z > 0 && Y < h - 1 ? "1" : "0")
      }
    }
    s.paint = paint
    const measure = () => {
      s.w = svg.clientWidth || 1
      s.h = svg.clientHeight || 1
      svg.setAttribute("viewBox", "0 0 " + s.w + " " + s.h)
      paint()
    }
    const ro = new ResizeObserver(measure)
    ro.observe(svg)
    measure()
    if (reduced || !visible) return () => ro.disconnect()
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!s.drag) {
        s.vel += (0.14 - s.vel) * (1 - Math.exp(-dt * 1.6))
        s.spin += s.vel * dt
      }
      for (const p of s.packets) p.theta += p.speed * dt
      // the resident packet loops forever; punched ones fly once and leave
      s.packets = s.packets.filter((p) => p.life === Infinity || p.theta < Math.PI * 1.5)
      for (const p of s.packets) if (p.life === Infinity && p.theta > Math.PI * 1.5) p.theta -= Math.PI * 2
      paint()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduced, visible])

  const onDown = (e: React.PointerEvent) => {
    const s = st.current
    s.drag = true
    s.lastX = e.clientX
    s.lastT = performance.now()
    s.vel = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    const s = st.current
    if (!s.drag) return
    const now = performance.now()
    const d = ((e.clientX - s.lastX) / s.w) * 2.4
    s.spin += d
    s.vel = d / Math.max(0.008, (now - s.lastT) / 1000)
    s.lastX = e.clientX
    s.lastT = now
    if (reduced || !visible) s.paint()
  }
  const onUp = () => {
    const s = st.current
    s.drag = false
    s.vel = Math.max(-6, Math.min(6, s.vel))
  }

  return (
    <div
      ref={boxRef}
      className="tsf-orbit"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      aria-hidden="true"
    >
      <svg ref={svgRef} preserveAspectRatio="none" focusable="false">
        {Array.from({ length: MERIDIANS }, (_, k) => (
          <path
            key={k}
            ref={(el) => {
              paths.current[k] = el
            }}
            fill="none"
            stroke="var(--tsf-ink)"
            strokeOpacity={0.82}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <circle
            key={i}
            ref={(el) => {
              dots.current[i] = el
            }}
            r={i === 0 ? 2.6 : 3.2}
            fill="var(--tsf-accent)"
            opacity={0}
          />
        ))}
      </svg>
    </div>
  )
}

/**
 * The wordmark: set in the serif, fitted to the width, its foot dissolving
 * into a halftone. A canvas, so every dot is placed by hand: a full-ink mask
 * of dots is painted first, then the word is drawn `source-in` over it, so
 * letter edges stay crisp wherever the ink is solid.
 */
function Wordmark({
  word,
  fontSerif,
  weight,
  color,
  halftone,
  reduced,
  visible,
}: {
  word: string
  fontSerif: string
  weight: number
  color: string
  halftone: boolean
  reduced: boolean
  visible: boolean
}) {
  const boxRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [height, setHeight] = React.useState<number | null>(null)
  const st = React.useRef({
    lens: 0,
    lensTarget: 0,
    lx: 0,
    ly: 0,
    rings: [] as Ring[],
    reveal: 0,
    rot: 0,
    rotTarget: 0,
    time: 0,
    kick: () => {},
  })

  // Where the i's dot goes. The i itself is set dotless.
  const iAt = word.indexOf("i")
  const shown = iAt > -1 ? word.slice(0, iAt) + "\u0131" + word.slice(iAt + 1) : word

  React.useEffect(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext("2d")
    if (!box || !canvas || !ctx) return
    const s = st.current
    const g = { w: 1, h: 1, dpr: 1, font: "", size: 0, track: 0, x0: 0, base: 0, dx: 0, dy: 0, dr: 0, cell: 6 }

    const setFont = (px: number, track: number) => {
      ctx.font = weight + " " + px + "px " + fontSerif
      ctx.letterSpacing = track.toFixed(2) + "px"
    }

    const measure = () => {
      const w = box.clientWidth
      if (!w) return
      setFont(100, -3)
      const m100 = ctx.measureText(shown)
      const ink100 = m100.actualBoundingBoxLeft + m100.actualBoundingBoxRight || m100.width
      const fit = fitWord(ink100, m100.actualBoundingBoxAscent || 72, w * 0.995, w * MAX_CAP, shown.length)
      const size = fit.size || 1
      // Measure again at the real size: tracking isn't proportional once a short word is spread out.
      g.size = size
      g.track = -0.03 * size
      if (fit.extra) {
        setFont(size, g.track)
        const m0 = ctx.measureText(shown)
        const ink0 = m0.actualBoundingBoxLeft + m0.actualBoundingBoxRight
        if (shown.length > 1 && ink0 > 0) g.track += (w * 0.995 - ink0) / (shown.length - 1)
      }
      setFont(size, g.track)
      g.font = ctx.font
      const m = ctx.measureText(shown)
      const asc = m.actualBoundingBoxAscent || size * 0.72
      g.x0 = m.actualBoundingBoxLeft
      g.dr = 0
      let top = asc
      if (iAt > -1) {
        const pre = ctx.measureText(shown.slice(0, iAt)).width
        const iw = ctx.measureText("\u0131").width - g.track
        const xh = ctx.measureText("x").actualBoundingBoxAscent || size * 0.5
        g.dr = size * 0.085
        g.dx = g.x0 + pre + iw / 2
        g.dy = xh + g.dr * 1.55 // above the baseline
        top = Math.max(top, g.dy + g.dr * 1.05)
      }
      const h = Math.ceil(top + size * 0.05)
      g.base = h + size * 0.01
      g.dy = g.base - g.dy
      g.w = w
      g.h = h
      g.dpr = Math.min(2, window.devicePixelRatio || 1)
      g.cell = Math.max(3.5, Math.min(9, w / 170))
      canvas.width = Math.round(w * g.dpr)
      canvas.height = Math.round(h * g.dpr)
      setHeight((prev) => (prev !== null && Math.abs(prev - h) < 0.5 ? prev : h))
      draw()
    }

    const draw = () => {
      const { w, h, dpr, cell } = g
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = "source-over"
      ctx.clearRect(0, 0, w, h)
      ctx.letterSpacing = g.track.toFixed(2) + "px"
      ctx.font = g.font
      ctx.textBaseline = "alphabetic"
      if (halftone) {
        const tone: Tone = {
          fade: 0.44,
          depth: 0.84,
          lensX: s.lx,
          lensY: s.ly,
          lensR: w * 0.09,
          lens: s.lens * 0.95,
          reveal: s.reveal,
          wave: reduced ? 0 : 0.06,
          time: s.time,
          rings: s.rings,
          ringW: w * 0.02,
        }
        ctx.beginPath()
        const half = cell / 2
        for (let j = 0, y = half; y < h + half; j++, y += cell) {
          const off = j % 2 ? half : 0
          for (let x = off; x < w + half; x += cell) {
            const c = coverage(x, y, w, h, tone)
            if (c < 0.01) continue
            if (c > 0.995) {
              ctx.rect(x - half - 0.3, y - half - 0.3, cell + 0.6, cell + 0.6)
              continue
            }
            const r = dotRadius(c, cell)
            ctx.moveTo(x + r, y)
            ctx.arc(x, y, r, 0, Math.PI * 2)
          }
        }
        ctx.fillStyle = "#000"
        ctx.fill()
        ctx.globalCompositeOperation = "source-in"
      }
      ctx.fillStyle = color
      ctx.fillText(shown, g.x0, g.base)
      ctx.globalCompositeOperation = "source-over"
      if (g.dr > 0) {
        const a = Math.min(1, s.reveal * 1.6 - (g.dx / w) * 0.6)
        if (a > 0) {
          ctx.save()
          ctx.globalAlpha = halftone ? clamp01(a) : 1
          ctx.translate(g.dx, g.dy)
          ctx.rotate(s.rot)
          ctx.beginPath()
          ctx.moveTo(0, -g.dr)
          ctx.lineTo(g.dr, 0)
          ctx.lineTo(0, g.dr)
          ctx.lineTo(-g.dr, 0)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        }
      }
    }

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      s.time += dt
      if (reduced || !halftone) {
        s.reveal = 1
        s.lens = s.lensTarget
        s.rot = s.rotTarget
        s.rings = []
      } else {
        s.reveal = Math.min(1, s.reveal + dt / 1.5)
        s.lens += (s.lensTarget - s.lens) * (1 - Math.exp(-dt * 7))
        s.rot += (s.rotTarget - s.rot) * (1 - Math.exp(-dt * 6))
        for (const r of s.rings) {
          r.r += g.w * 0.75 * dt
          r.a *= Math.exp(-dt * 1.4)
        }
        s.rings = s.rings.filter((r) => r.a > 0.02)
      }
      draw()
      const busy = !reduced && halftone && visible
      raf = busy ? requestAnimationFrame(loop) : 0
      if (!busy) last = 0
    }
    s.kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(measure)
    ro.observe(box)
    measure()
    let alive = true
    // A web font the installer passes may land after first paint.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => alive && measure())
    if (visible || reduced || !halftone) s.kick()
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      raf = 0
      ro.disconnect()
    }
  }, [shown, iAt, fontSerif, weight, color, halftone, reduced, visible])

  const local = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top]
  }
  const onMove = (e: React.PointerEvent) => {
    const s = st.current
    const [x, y] = local(e)
    s.lx = x
    s.ly = y
    s.lensTarget = halftone && e.pointerType !== "touch" ? 1 : 0
    s.kick()
  }
  const onLeave = () => {
    st.current.lensTarget = 0
    st.current.kick()
  }
  const onClick = (e: React.MouseEvent) => {
    const s = st.current
    const r = e.currentTarget.getBoundingClientRect()
    if (halftone && !reduced) s.rings.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, a: 0.9 })
    s.rotTarget += Math.PI / 2
    s.kick()
  }

  return (
    <div
      ref={boxRef}
      className="tsf-word"
      style={{ height: height === null ? undefined : height, aspectRatio: height === null ? "1000 / 240" : undefined }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  )
}

export default function TicketStubFooter({
  brand = "Dispatch",
  wordmark,
  company,
  year = 2026,
  sections = DEFAULT_SECTIONS,
  defaultSection = 0,
  onSectionChange,
  eyebrow = DEFAULT_EYEBROW,
  headline = ["Resolve tickets.", "Trigger actions."],
  description,
  cta = { label: "Get started" },
  onCtaClick,
  linkGroups = DEFAULT_LINKS,
  statusLabels = ["Active", "Paused"],
  statusCaption = "Agent Status",
  defaultActive = true,
  onStatusChange,
  count = 12745012,
  countLabel = "Tickets Solved",
  rate = 1.8,
  blurb,
  legal = [{ label: "All rights reserved" }, { label: "Terms of use", href: "#" }, { label: "Privacy Policy", href: "#" }],
  onDispatch,
  background = "#1b1a19",
  ink = "#e6dcc6",
  muted = "#8c867b",
  accent = "#ff6d36",
  accentDeep = "#d95a32",
  accentInk = "#1b1a19",
  fontSans = SANS,
  fontSerif = SERIF,
  fontMono = MONO,
  serifWeight = 500,
  halftone = true,
  className = "",
}: TicketStubFooterProps) {
  const rootRef = React.useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [visible, setVisible] = React.useState(false)
  const [seen, setSeen] = React.useState(false)
  const [section, setSection] = React.useState(defaultSection)
  const [active, setActive] = React.useState(defaultActive)
  const [total, setTotal] = React.useState(count)
  const [punch, setPunch] = React.useState(0)
  const [pulse, setPulse] = React.useState(0)
  const totalRef = React.useRef(count)
  React.useEffect(() => { totalRef.current = total }, [total])

  const word = wordmark ?? brand
  const text =
    description ??
    "Connect your stack, set guardrails, and let " + brand + " handle repetitive work\u2014while your team stays in control."
  const blurbText =
    blurb ??
    "Connect your help center, knowledge base, and CRM software. " +
      brand +
      " resolves tickets, updates records, knowledge base, and CRM software."

  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => {
        setVisible(true)
        setSeen(true)
      })
      return () => cancelAnimationFrame(frame)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // The counter runs while the agent is active and the section is on screen.
  React.useEffect(() => {
    if (!active || !visible || !(rate > 0)) return
    let id = 0
    const step = () => {
      const t = nextTick(rate)
      id = window.setTimeout(() => {
        setTotal((v) => v + t.add)
        step()
      }, t.delay)
    }
    step()
    return () => clearTimeout(id)
  }, [active, visible, rate])

  const pick = (i: number) => {
    setSection(i)
    onSectionChange?.(i)
  }
  const toggle = () => {
    const next = !active
    setActive(next)
    onStatusChange?.(next)
  }
  const dispatch = () => {
    const next = totalRef.current + 1
    totalRef.current = next
    setTotal(next)
    setPunch((p) => p + 1)
    setPulse((p) => p + 1)
    onDispatch?.(next)
  }
  const toTop = () => rootRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
  const hold = (href?: string) => (e: React.MouseEvent) => {
    if (!href || href === "#") e.preventDefault()
  }

  const vars = {
    "--tsf-bg": background,
    "--tsf-ink": ink,
    "--tsf-muted": muted,
    "--tsf-accent": accent,
    "--tsf-deep": accentDeep,
    "--tsf-aink": accentInk,
    "--tsf-sans": fontSans,
    "--tsf-mono": fontMono,
  } as React.CSSProperties

  const stubClip = chamfer(9, 9, 9, 9)
  const mainClip = chamfer(9, 9, 9, 9)

  return (
    <section
      ref={rootRef}
      className={"tsf w-full " + className}
      style={vars}
      data-seen={seen || reduced ? "1" : "0"}
      aria-label={brand}
    >
      <div className="tsf-grid">
        {[2, 3, 4, 5, 6, 7].map((c) => (
          <span key={"v" + c} className="tsf-vl" style={{ gridColumn: c }} aria-hidden="true" />
        ))}
        {[2, 3, 4, 5, 6].map((r) => (
          <span key={"h" + r} className="tsf-hl" style={{ gridRow: r }} aria-hidden="true" />
        ))}

        <nav className="tsf-nav" aria-label="Sections">
          <ol>
            {sections.map((s, i) => {
              const inner = (
                <>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.label}</span>
                </>
              )
              return (
                <li key={s.label + i}>
                  {s.href ? (
                    <a
                      href={s.href}
                      className="tsf-nav-item"
                      aria-current={section === i ? "true" : undefined}
                      onClick={(e) => {
                        hold(s.href)(e)
                        pick(i)
                      }}
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="tsf-nav-item"
                      aria-current={section === i ? "true" : undefined}
                      onClick={() => pick(i)}
                    >
                      {inner}
                    </button>
                  )}
                </li>
              )
            })}
          </ol>
          <span className="tsf-nav-bar" style={{ "--i": section } as React.CSSProperties} aria-hidden="true" />
        </nav>

        <div className="tsf-hero">
          <Eyebrow phrases={eyebrow} reduced={reduced} visible={visible} />
          <h2 className="tsf-h">
            {headline.map((line, i) => (
              <span key={i}>
                <span style={{ transitionDelay: 0.12 + i * 0.1 + "s" }}>{line}</span>
              </span>
            ))}
          </h2>
          <p className="tsf-p">{text}</p>
          <a
            href={cta.href ?? "#"}
            className="tsf-cta"
            style={{ clipPath: chamfer(0, 0, 12, 0) }}
            onClick={(e) => {
              hold(cta.href)(e)
              setPulse((p) => p + 1)
              onCtaClick?.()
            }}
          >
            <span>{cta.label}</span>
            <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
              <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </div>

        <div className="tsf-side">
          <Orbit reduced={reduced} visible={visible} pulse={pulse} />
          <div className="tsf-links" style={{ "--cols": Math.max(1, linkGroups.length) } as React.CSSProperties}>
            {linkGroups.map((g) => (
              <div key={g.title}>
                <h3>{g.title}</h3>
                <ul>
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href ?? "#"} className="tsf-link" onClick={hold(l.href)}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="tsf-ticket">
          <button
            type="button"
            className="tsf-stub"
            style={{ clipPath: stubClip }}
            onClick={dispatch}
            aria-label={"Punch the stub: dispatch one ticket (" + formatCount(total) + " solved)"}
          >
            <Mark style={{ transform: "rotate(" + punch * 90 + "deg)" }} />
            <span className="tsf-stub-tip" aria-hidden="true">
              Punch
            </span>
          </button>
          <div className="tsf-main" style={{ clipPath: mainClip }}>
            <div className="tsf-stats">
              <button type="button" className="tsf-status" aria-pressed={active} onClick={toggle}>
                <span className="tsf-stat-v">
                  {active ? statusLabels[0] : statusLabels[1]}
                  <span className="tsf-pulse" aria-hidden="true" />
                </span>
                <span className="tsf-stat-c">
                  {statusCaption} <span className="tsf-status-hint">{active ? "\u00b7 pause" : "\u00b7 resume"}</span>
                </span>
              </button>
              <div className="tsf-stat">
                <span className="tsf-stat-v">
                  <span key={punch} className={punch ? "tsf-bump" : undefined}>
                    <Odometer value={total} />
                  </span>
                  <span className="sr-only">{formatCount(total)}</span>
                </span>
                <span className="tsf-stat-c">{countLabel}</span>
              </div>
            </div>
            <span className="tsf-gutcell" aria-hidden="true" />
            <Blurb text={blurbText} reduced={reduced} visible={visible} />
            <p className="sr-only">{word}</p>
            <Wordmark
              word={word}
              fontSerif={fontSerif}
              weight={serifWeight}
              color={accentInk}
              halftone={halftone}
              reduced={reduced}
              visible={visible}
            />
          </div>
        </div>

        <footer className="tsf-foot">
          <span className="tsf-copy">
            &copy; {company ?? brand + " AI"}, {year}
          </span>
          <span className="tsf-foot-l" aria-hidden="true">
            <span className="tsf-dots" />
          </span>
          <div className="tsf-foot-r">
            {legal.map((l) =>
              l.href ? (
                <a key={l.label} href={l.href} onClick={hold(l.href)}>
                  {l.label}
                </a>
              ) : (
                <span key={l.label}>{l.label}</span>
              ),
            )}
            <span className="tsf-dots" aria-hidden="true" />
          </div>
          <button type="button" className="tsf-top" onClick={toTop} aria-label="Back to top">
            <Mark />
          </button>
        </footer>
      </div>
    </section>
  )
}
