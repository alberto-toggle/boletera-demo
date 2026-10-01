import type { Metadata } from "next";
import Link from "next/link";
import { StickyScroll } from "@/components/blocks/21st-dev/sticky-scroll-reveal/sticky-scroll-reveal";
import { stickyScrollContent } from "@/components/blocks/21st-dev/sticky-scroll-reveal/sticky-scroll-reveal-data";

export const metadata: Metadata = { title: "Sticky Scroll Reveal | Playground" };

export default function StickyScrollRevealPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Sticky Scroll Reveal</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@manuarora700/components/sticky-scroll-reveal" target="_blank" rel="noreferrer" className="underline underline-offset-4">manuarora700 / 21st.dev</a>.
        {" "}Desplázate dentro de la sección para cambiar el texto destacado y su panel visual. También puedes enfocarla y usar las flechas o Av Pág.
      </p>
      <div className="mt-8"><StickyScroll content={stickyScrollContent} /></div>
    </main>
  );
}
