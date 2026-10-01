import type { Metadata } from "next";
import Link from "next/link";
import InteractiveSelector from "@/components/blocks/21st-dev/interactive-selector/interactive-selector";

export const metadata: Metadata = { title: "Interactive Selector | Playground" };

export default function InteractiveSelectorPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Interactive Selector</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@minhxthanh/components/interactive-selector" target="_blank" rel="noreferrer" className="underline underline-offset-4">minhxthanh / 21st.dev</a>.
        {" "}Selecciona una experiencia para expandir su imagen. En pantallas pequeñas puedes desplazar la galería horizontalmente.
      </p>
      <div className="mt-8"><InteractiveSelector /></div>
    </main>
  );
}
