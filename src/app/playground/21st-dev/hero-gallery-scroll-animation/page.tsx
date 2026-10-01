import type { Metadata } from "next";
import Link from "next/link";
import HeroGalleryDemo from "@/components/blocks/21st-dev/hero-gallery-scroll-animation/hero-gallery-demo";

export const metadata: Metadata = { title: "Hero Gallery Scroll Animation | Playground" };

export default function HeroGalleryPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Hero Gallery Scroll Animation</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@youcefbnm/components/hero-gallery-scroll-animation" target="_blank" rel="noreferrer" className="underline underline-offset-4">youcefbnm / 21st.dev</a>.
        {" "}Tres variantes del autor. Desplázate dentro de la vista previa para ampliar la galería y desvanecer el texto; los botones del hero avanzan la demostración.
      </p>
      <div className="mt-8"><HeroGalleryDemo /></div>
    </main>
  );
}
