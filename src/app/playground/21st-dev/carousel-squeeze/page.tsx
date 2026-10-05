import type { Metadata } from "next";
import Link from "next/link";
import SqueezeCarouselDemo from "@/components/blocks/21st-dev/carousel-squeeze/carousel-squeeze-demo";

export const metadata: Metadata = { title: "Squeeze Carousel | Playground" };

export default function SqueezeCarouselPage() {
  return (
    <main
      lang="es"
      className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8"
    >
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Squeeze Carousel</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a
          href="https://21st.dev/@yura/components/carousel-squeeze"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          yura / 21st.dev
        </a>
        . Paneles expansibles con transición animada. Selecciona una imagen, usa
        los botones o las flechas del teclado con la galería enfocada.
      </p>
      <section
        aria-label="Vista previa del carrusel"
        className="mt-8 rounded-xl border"
      >
        <SqueezeCarouselDemo />
      </section>
    </main>
  );
}
