import type { Metadata } from "next";
import Link from "next/link";
import { GlassWalletCard } from "@/components/blocks/uitripled/glass-wallet-card-shadcnui/glass-wallet-card-shadcnui";

export const metadata: Metadata = { title: "Glass Wallet Card | Playground" };

export default function GlassWalletCardPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Glass Wallet Card</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen: UI TripleD. Tarjeta de billetera con efecto de cristal, saldo y tendencia de ejemplo.
        Puedes mostrar las acciones con el cursor o el botón; enviar y recibir están desactivados.
      </p>
      <div lang="en" className="relative isolate mt-8 flex justify-center overflow-hidden rounded-xl border bg-muted/20 px-4 py-12 sm:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute -top-12 left-1/4 -z-10 size-64 rounded-full bg-violet-400/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 bottom-0 -z-10 size-64 rounded-full bg-sky-400/20 blur-3xl" />
        <GlassWalletCard />
      </div>
    </main>
  );
}
