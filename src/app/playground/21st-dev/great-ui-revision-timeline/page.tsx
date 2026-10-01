import type { Metadata } from "next";
import Link from "next/link";
import RevisionTimeline from "@/components/blocks/21st-dev/great-ui-revision-timeline/great-ui-revision-timeline";
import { revisionTimelineData } from "@/components/blocks/21st-dev/great-ui-revision-timeline/revision-timeline-data";

export const metadata: Metadata = { title: "Great UI Revision Timeline | Playground" };

export default function RevisionTimelinePage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Great UI Revision Timeline</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@saurabh-2607/components/great-ui-revision-timeline" target="_blank" rel="noreferrer" className="underline underline-offset-4">saurabh-2607 / 21st.dev</a>.
        {" "}Historial ilustrativo del autor. Usa las flechas o las marcas de fecha para cambiar de revisión.
      </p>
      <div className="mt-8 flex justify-center"><RevisionTimeline revisions={revisionTimelineData} /></div>
    </main>
  );
}
