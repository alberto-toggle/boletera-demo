import type { Metadata } from "next";
import Link from "next/link";
import ReceiptTiersDemo from "@/components/blocks/21st-dev/receipt-tiers/receipt-tiers-demo";

export const metadata: Metadata = { title: "Receipt Tiers | Playground" };

export default function ReceiptTiersPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Receipt Tiers</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen: 21st.dev, integrado desde el código compartido. Planes de precios con diseño de recibo.
        Importes ficticios en USD; el total mensual refleja el descuento por facturación anual.
        Los botones de contratación están desactivados.
      </p>
      <div lang="en" className="mt-8"><ReceiptTiersDemo /></div>
    </main>
  );
}
