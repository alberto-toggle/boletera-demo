import type { Metadata } from "next";
import Link from "next/link";
import Navbar2 from "@/components/blocks/21st-dev/navbar2/navbar2";

export const metadata: Metadata = { title: "Mega Menu Navbar | Playground" };

export default function Navbar2Page() {
  return (
    <main lang="es" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Mega Menu Navbar</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@anelkabag/components/navbar2" target="_blank" rel="noreferrer" className="underline underline-offset-4">
          anelkabag / 21st.dev
        </a>
        . Megamenús animados, selector de idioma y navegación móvil.
        Los enlaces son de muestra; el selector cambia su etiqueta, sin traducir el contenido.
      </p>
      <section id="navbar2-preview" aria-label="Vista previa del bloque" lang="en" className="mt-8 min-h-[640px] rounded-2xl border bg-zinc-50 py-6">
        <Navbar2 />
      </section>
    </main>
  );
}
