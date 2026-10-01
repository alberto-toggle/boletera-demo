import type { Metadata } from "next";
import Link from "next/link";
import Carousel10 from "@/components/blocks/21st-dev/c-carousel-10/c-carousel-10";

export const metadata: Metadata = { title: "Carousel 10 | Playground" };

export default function Carousel10Page() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Carousel 10</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@sean0205/components/c-carousel-10" target="_blank" rel="noreferrer" className="underline underline-offset-4">sean0205 / 21st.dev</a>.
        {" "}Carrusel con miniaturas superpuestas. Arrastra las imágenes,
        selecciona una miniatura o enfoca la galería y usa las flechas del teclado.
      </p>
      <section aria-label="Vista previa del carrusel" className="mt-8 flex justify-center rounded-xl border py-8">
        <Carousel10 />
      </section>
    </main>
  );
}
