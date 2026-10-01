import type { Metadata } from "next";
import Link from "next/link";
import ProductCardVirtualEvent from "@/components/blocks/shadcn-io/product-card-virtual-event/product-card-virtual-event";

export const metadata: Metadata = {
  title: "Product Card Virtual Event | Playground",
};

export default function ProductCardVirtualEventPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Product Card Virtual Event</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Bloque de shadcn.io con datos de ejemplo de un evento virtual. Prueba las
        entradas Free, Standard y VIP para comparar sus precios y beneficios.
      </p>
      <div className="mt-8 rounded-xl border bg-muted/20">
        <ProductCardVirtualEvent />
      </div>
    </main>
  );
}
