import type { Metadata } from "next";
import Link from "next/link";
import Timeline from "@/components/blocks/21st-dev/timeline-02/timeline-02";
import { timelineItems } from "@/components/blocks/21st-dev/timeline-02/timeline-02-data";

export const metadata: Metadata = { title: "Interactive Timeline | Playground" };

export default function TimelinePage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Interactive Timeline</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@shadcnspace/components/timeline-02" target="_blank" rel="noreferrer" className="underline underline-offset-4">shadcnspace / 21st.dev</a>.
        {" "}Selecciona un año para ver su imagen y descripción. Los hitos pertenecen al ejemplo del autor.
      </p>
      <section aria-label="Vista previa de la línea de tiempo" className="mt-8 rounded-xl border bg-background px-4 py-12 sm:px-8">
        <Timeline items={timelineItems} />
      </section>
    </main>
  );
}
