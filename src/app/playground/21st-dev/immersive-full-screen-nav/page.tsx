import type { Metadata } from "next";
import Link from "next/link";
import ImmersiveFullscreenNavDemo from "@/components/blocks/21st-dev/immersive-full-screen-nav/immersive-full-screen-nav-demo";

export const metadata: Metadata = { title: "Immersive Full Screen Navigation | Playground" };

export default function ImmersiveNavigationPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Immersive Full Screen Navigation</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@hyperiux/components/immersive-full-screen-nav" target="_blank" rel="noreferrer" className="underline underline-offset-4">Hyperiux / 21st.dev</a>.
        {" "}Abre el menú para probar la transición y las animaciones.
        La navegación ocupa el área de vista previa; los enlaces son ilustrativos.
      </p>
      <section id="immersive-preview" aria-label="Vista previa de navegación inmersiva" lang="en" className="mt-8 rounded-xl border">
        <ImmersiveFullscreenNavDemo />
      </section>
    </main>
  );
}
