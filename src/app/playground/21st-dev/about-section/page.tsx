import type { Metadata } from "next";
import Link from "next/link";
import AboutSection from "@/components/blocks/21st-dev/about-section/about-section";

export const metadata: Metadata = { title: "About Section | Playground" };

export default function AboutSectionPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">About Section</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@uilayout.contact/components/about-section" target="_blank" rel="noreferrer" className="underline underline-offset-4">uilayout.contact / 21st.dev</a>.
        {" "}Presentación personal con imagen recortada, estadísticas y entrada escalonada de textos. Contenido ilustrativo del autor.
      </p>
      <div className="mt-8"><AboutSection /></div>
    </main>
  );
}
