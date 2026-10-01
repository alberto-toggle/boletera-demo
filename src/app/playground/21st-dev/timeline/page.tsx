import type { Metadata } from "next";
import Link from "next/link";
import TimelineDemo from "@/components/blocks/21st-dev/timeline/timeline-demo";
import { timelineData } from "@/components/blocks/21st-dev/timeline/timeline-data";

export const metadata: Metadata = { title: "Timeline — Aceternity | Playground" };

export default function TimelinePage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Timeline — Aceternity</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@manuarora700/components/timeline" target="_blank" rel="noreferrer" className="underline underline-offset-4">manuarora700 / 21st.dev</a>.
        {" "}Desplázate dentro de la vista previa para recorrer los hitos y ver avanzar la línea. Contenido ilustrativo del autor.
      </p>
      <div className="mt-8"><TimelineDemo data={timelineData} /></div>
    </main>
  );
}
