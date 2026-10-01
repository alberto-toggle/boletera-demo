import type { Metadata } from "next";
import Link from "next/link";
import LandingAccordionItem from "@/components/blocks/21st-dev/interactive-image-accordion/interactive-image-accordion";

export const metadata: Metadata = { title: "Interactive Image Accordion | Playground" };

export default function InteractiveImageAccordionPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Interactive Image Accordion</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@minhxthanh/components/interactive-image-accordion" target="_blank" rel="noreferrer" className="underline underline-offset-4">minhxthanh / 21st.dev</a>.
        {" "}Pasa el puntero, toca o enfoca un panel para expandirlo. La galería permite desplazamiento horizontal.
      </p>
      <div className="mt-8"><LandingAccordionItem /></div>
    </main>
  );
}
