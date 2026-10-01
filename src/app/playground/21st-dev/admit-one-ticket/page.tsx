import type { Metadata } from "next";
import Link from "next/link";
import { AdmitOneTicket } from "@/components/blocks/21st-dev/admit-one-ticket/admit-one-ticket";

export const metadata: Metadata = { title: "Admit One Ticket | Playground" };

export default function AdmitOneTicketPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Admit One Ticket</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Boleto de larsen66 en 21st.dev, con textura animada e inclinación al mover
        el cursor. Datos de ejemplo.
      </p>
      <div lang="en" className="mt-8 flex min-h-72 items-center justify-center overflow-hidden rounded-xl border bg-[#281d14] px-6 py-16 sm:min-h-[640px] sm:p-12">
        <AdmitOneTicket
          name="Garry Tan"
          presenter="Y Combinator presents"
          event="Startup School 2026"
          venue="Chase Center, SF"
          dates="July 25–26"
          stubText="Admit one"
          watermark="2026"
        />
      </div>
    </main>
  );
}
