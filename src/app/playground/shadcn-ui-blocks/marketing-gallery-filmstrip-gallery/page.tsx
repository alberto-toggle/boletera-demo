import type { Metadata } from "next";
import Link from "next/link";
import FilmstripGallery from "@/components/blocks/shadcn-ui-blocks/marketing-gallery-filmstrip-gallery/marketing-gallery-filmstrip-gallery";

export const metadata: Metadata = { title: "Filmstrip Gallery | Playground" };

export default function FilmstripGalleryPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Filmstrip Gallery</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Galería de shadcn-ui-blocks con marcos de película y desplazamiento horizontal.
        Usa los botones, las flechas del teclado al enfocar la tira o desliza en móvil.
      </p>
      <div lang="en" className="mt-8 overflow-hidden rounded-xl border"><FilmstripGallery /></div>
    </main>
  );
}
