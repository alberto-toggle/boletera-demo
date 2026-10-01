import type { Metadata } from "next";
import Link from "next/link";
import { LocationMap } from "@/components/blocks/21st-dev/expand-map/expand-map";

export const metadata: Metadata = { title: "Expand Map | Playground" };

export default function ExpandMapPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Expand Map</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@jatin-yadav05/components/expand-map" target="_blank" rel="noreferrer" className="underline underline-offset-4">jatin-yadav05 / 21st.dev</a>.
        {" "}Tarjeta con expansión e inclinación. El mapa es ilustrativo y las coordenadas son las del ejemplo; no utiliza geolocalización.
      </p>
      <section aria-label="Vista previa del mapa expandible" className="relative mt-8 flex min-h-[480px] flex-col items-center justify-center gap-8 rounded-xl border px-4 py-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(52,211,153,0.03)_0%,_transparent_70%)]" />
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Ubicación de ejemplo</p>
        <LocationMap location="San Francisco, CA" coordinates="37.7749° N, 122.4194° W" />
      </section>
    </main>
  );
}
