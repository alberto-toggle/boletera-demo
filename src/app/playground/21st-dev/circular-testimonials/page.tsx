import type { Metadata } from "next";
import Link from "next/link";
import { CircularTestimonialsDemo } from "@/components/blocks/21st-dev/circular-testimonials/circular-testimonials-demo";

export const metadata: Metadata = {
  title: "Circular Testimonials | Playground",
};

export default function CircularTestimonialsPage() {
  return (
    <main
      lang="es"
      className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8"
    >
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Circular Testimonials</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a
          href="https://21st.dev/@maxim.bort.devel/components/circular-testimonials"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          maxim.bort.devel / 21st.dev
        </a>
        . Variantes clara y oscura con fotografías superpuestas y texto animado.
        Usa los botones o las flechas del teclado con un control enfocado. Los
        testimonios son ficticios.
      </p>
      <div className="mt-8">
        <CircularTestimonialsDemo />
      </div>
    </main>
  );
}
