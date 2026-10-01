import type { Metadata } from "next";
import Link from "next/link";
import { GlassOrderSummary } from "@/components/blocks/uitripled/glass-order-summary-shadcnui/glass-order-summary-shadcnui";

export const metadata: Metadata = { title: "Glass Order Summary | Playground" };

export default function GlassOrderSummaryPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Glass Order Summary</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Resumen de pedido de UI TripleD con efecto de cristal, productos e
        importes de ejemplo. El pago está inactivo.
      </p>
      <div lang="en" className="relative isolate mt-8 flex justify-center overflow-hidden rounded-xl border bg-muted/20 px-4 py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -top-12 left-1/4 -z-10 size-64 rounded-full bg-violet-400/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 bottom-0 -z-10 size-64 rounded-full bg-sky-400/20 blur-3xl" />
        <GlassOrderSummary />
      </div>
    </main>
  );
}
