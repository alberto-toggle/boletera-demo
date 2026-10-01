import type { Metadata } from "next";
import Link from "next/link";
import { CardsSlider } from "@/components/blocks/uitripled/cards-slider-shadcnui/cards-slider-shadcnui";

export const metadata: Metadata = { title: "Cards Slider | Playground" };

export default function CardsSliderPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Cards Slider</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen: UI TripleD. Carrusel de tarjetas que puedes arrastrar o recorrer con los botones.
        También admite las flechas del teclado al enfocarlo. Contenido de ejemplo; «View Details» está desactivado.
      </p>
      <div lang="en" className="mt-8 overflow-hidden rounded-xl border bg-muted/20"><CardsSlider /></div>
    </main>
  );
}
