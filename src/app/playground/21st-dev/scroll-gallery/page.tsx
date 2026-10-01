import type { Metadata } from "next";
import Link from "next/link";
import ScrollGalleryDemo from "@/components/blocks/21st-dev/scroll-gallery/scroll-gallery-demo";

export const metadata: Metadata = { title: "Scroll Gallery | Playground" };

export default function ScrollGalleryPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Scroll Gallery</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@soralabs/components/scroll-gallery" target="_blank" rel="noreferrer" className="underline underline-offset-4">soralabs / 21st.dev</a>.
        {" "}Desplázate dentro de la galería para revelar las imágenes. También puedes enfocarla y usar las flechas o Av Pág.
      </p>
      <div className="mt-8">
        <ScrollGalleryDemo />
      </div>
    </main>
  );
}
