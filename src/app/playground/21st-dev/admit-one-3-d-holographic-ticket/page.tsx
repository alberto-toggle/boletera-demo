import type { Metadata } from "next";
import Link from "next/link";
import { AdmitOneHolographicTicket } from "@/components/blocks/21st-dev/admit-one-3-d-holographic-ticket/admit-one-3-d-holographic-ticket";

export const metadata: Metadata = { title: "Admit One 3D Holographic Ticket | Playground" };

export default function HolographicTicketPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Admit One 3D Holographic Ticket</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Variante del boleto de 21st.dev, integrada desde el código que compartiste.
        Textura morada animada e inclinación con el cursor; datos de ejemplo.
      </p>
      <div lang="en" className="mt-8 flex min-h-[500px] flex-col items-center justify-center gap-6 overflow-hidden rounded-xl border bg-zinc-950 px-5 py-12 sm:px-10">
        <AdmitOneHolographicTicket
          name="ALEXANDER VANCE"
          presenter="CYBERSPACE 2026"
          event="TECH INNOVATION SUMMIT"
          venue="SECTOR 07 • MAINFRAME AUDITORIUM"
          dates="OCTOBER 24-26, 2026 • SAN FRANCISCO"
          stubText="VIP ACCESS"
          watermark="2026"
        />
        <p className="max-w-xl text-center font-mono text-xs text-zinc-400">
          Move your cursor over the ticket to explore the 3D tilt and highlights.
        </p>
      </div>
    </main>
  );
}
