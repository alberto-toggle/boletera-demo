import type { Metadata } from "next";
import Link from "next/link";
import CarouselGallery from "@/components/blocks/shadcn-ui-blocks/marketing-gallery-carousel-gallery/marketing-gallery-carousel-gallery";

export const metadata: Metadata = { title: "Carousel Gallery | Playground" };

export default function CarouselGalleryPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Carousel Gallery</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Galería de shadcn-ui-blocks con miniaturas y reproducción automática.
        Usa las flechas, el teclado o desliza en móvil para recorrer las imágenes.
      </p>
      <div className="mt-8 overflow-hidden rounded-xl border"><CarouselGallery /></div>
    </main>
  );
}
