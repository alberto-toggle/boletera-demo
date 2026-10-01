import type { Metadata } from "next";
import Link from "next/link";
import InfiniteSliderDemo from "@/components/blocks/21st-dev/infinite-slider/infinite-slider-demo";

export const metadata: Metadata = { title: "Infinite Slider | Playground" };

export default function InfiniteSliderPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Infinite Slider</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@ibelick/components/infinite-slider" target="_blank" rel="noreferrer" className="underline underline-offset-4">ibelick / 21st.dev</a>.
        {" "}Carrusel continuo con los logotipos del ejemplo original y control para pausar la animación.
      </p>
      <div className="mt-8"><InfiniteSliderDemo /></div>
    </main>
  );
}
