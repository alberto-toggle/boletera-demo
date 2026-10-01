import type { Metadata } from "next";
import Link from "next/link";
import { SmoothScrollHero } from "@/components/blocks/21st-dev/modern-hero/modern-hero";

export const metadata: Metadata = { title: "Modern Hero | Playground" };

export default function ModernHeroPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Modern Hero</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@uniquesonu/components/modern-hero" target="_blank" rel="noreferrer" className="underline underline-offset-4">uniquesonu / 21st.dev</a>.
        {" "}Hero espacial con revelado al desplazarse, imágenes con paralaje y agenda ilustrativa del autor.
        Haz scroll dentro de la vista previa o usa “Launch Schedule” para llegar a la agenda.
      </p>
      <div className="mt-8"><SmoothScrollHero /></div>
    </main>
  );
}
