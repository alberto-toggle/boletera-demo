import type { Metadata } from "next";
import Link from "next/link";
import FooterEvent from "@/components/blocks/shadcn-io/footer-event/footer-event";

export const metadata: Metadata = {
  title: "Footer Event | Playground",
};

export default function FooterEventPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Footer Event</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Footer de shadcn.io con información del evento, columnas de navegación y
        patrocinadores de ejemplo. Los enlaces y la compra están inactivos en
        esta vista de prueba.
      </p>
      <div className="mt-8 rounded-xl border bg-muted/20 py-4">
        <FooterEvent />
      </div>
    </main>
  );
}
