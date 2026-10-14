"use client";

import { useState, type ComponentProps } from "react";
import { Sparkles, Move, Maximize2 } from "lucide-react";
import { LiquidGlassCard } from "./liquid-glass";

type GlassProps = ComponentProps<typeof LiquidGlassCard>;

export default function LiquidGlassDemo() {
  const [blur, setBlur] =
    useState<NonNullable<GlassProps["blurIntensity"]>>("md");
  const [glow, setGlow] =
    useState<NonNullable<GlassProps["glowIntensity"]>>("sm");
  const [draggable, setDraggable] = useState(true);
  const [expandable, setExpandable] = useState(false);
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-xl border bg-card p-4 text-sm">
        <label className="flex items-center gap-2">
          Desenfoque
          <select
            className="rounded-md border bg-background px-3 py-2"
            value={blur}
            onChange={(e) =>
              setBlur(
                e.target.value as NonNullable<GlassProps["blurIntensity"]>,
              )
            }
          >
            <option value="sm">Suave</option>
            <option value="md">Medio</option>
            <option value="lg">Alto</option>
            <option value="xl">Intenso</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Brillo
          <select
            className="rounded-md border bg-background px-3 py-2"
            value={glow}
            onChange={(e) =>
              setGlow(
                e.target.value as NonNullable<GlassProps["glowIntensity"]>,
              )
            }
          >
            <option value="none">Sin brillo</option>
            <option value="xs">Sutil</option>
            <option value="sm">Suave</option>
            <option value="md">Medio</option>
            <option value="lg">Alto</option>
            <option value="xl">Intenso</option>
          </select>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={draggable}
            onChange={(e) => setDraggable(e.target.checked)}
          />
          Arrastrar
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={expandable}
            onChange={(e) => setExpandable(e.target.checked)}
          />
          Expandir al pulsar
        </label>
      </div>
      <div
        className="relative isolate flex min-h-[580px] items-center justify-center overflow-hidden rounded-2xl bg-slate-950 bg-cover bg-center px-8 py-24 text-white"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgb(0 0 0 / .35), rgb(0 0 0 / .1)), url('/images/events/banquet.jpg')",
        }}
      >
        <div className="absolute left-6 top-6">
          <LiquidGlassCard
            draggable={false}
            blurIntensity="sm"
            borderRadius="999px"
            className="px-4 py-2 text-xs font-medium"
          >
            UI Layouts · Liquid Glass
          </LiquidGlassCard>
        </div>
        <LiquidGlassCard
          key={String(expandable)}
          blurIntensity={blur}
          glowIntensity={glow}
          draggable={draggable}
          expandable={expandable}
          width="100%"
          height="260px"
          expandedWidth="100%"
          expandedHeight="340px"
          className="max-w-sm bg-black/15 p-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Sparkles className="mb-7" size={28} aria-hidden="true" />
          <p className="text-xs font-medium uppercase tracking-[.2em]">
            Luz, textura y movimiento
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Liquid Glass
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/90">
            Una superficie translúcida que distorsiona el fondo y refleja la luz
            en sus bordes.
          </p>
        </LiquidGlassCard>
        <p className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-center gap-4 text-center text-xs text-white/90">
          {draggable && (
            <span className="inline-flex items-center gap-2">
              <Move size={14} />
              Arrastra y suelta la tarjeta
            </span>
          )}
          {expandable && (
            <span className="inline-flex items-center gap-2">
              <Maximize2 size={14} />
              Pulsa la tarjeta o usa Enter para expandir
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
