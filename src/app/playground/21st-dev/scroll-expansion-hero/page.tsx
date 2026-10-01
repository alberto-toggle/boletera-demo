import type { Metadata } from "next";
import Link from "next/link";
import ScrollExpansionHeroDemo from "@/components/blocks/21st-dev/scroll-expansion-hero/scroll-expansion-hero-demo";

export const metadata: Metadata = { title: "Scroll Expansion Hero | Playground" };

export default function ScrollExpansionHeroPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Scroll Expansion Hero</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@arunachalam/components/scroll-expansion-hero" target="_blank" rel="noreferrer" className="underline underline-offset-4">arunachalam / 21st.dev</a>.
        {" "}Desplázate dentro de la vista previa para expandir el contenido. Puedes enfocarla y usar las flechas o Av Pág.
      </p>
      <div className="mt-8"><ScrollExpansionHeroDemo /></div>
    </main>
  );
}
