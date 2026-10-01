import type { Metadata } from "next";
import Link from "next/link";
import { ConferenceTicket } from "@/components/blocks/uitripled/conference-ticket-shadcnui/conference-ticket-shadcnui";

export const metadata: Metadata = { title: "Conference Ticket | Playground" };

export default function ConferenceTicketPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Conference Ticket</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen: UI TripleD. Boleto de conferencia con efecto de cristal, brillo e inclinación al pasar el cursor.
        Los datos y el estado de confirmación son de ejemplo; el QR es decorativo.
      </p>
      <div lang="en" className="relative isolate mt-8 overflow-hidden rounded-xl border bg-background">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/4 top-16 -z-10 size-64 rounded-full bg-violet-400/20 blur-3xl" />
        <ConferenceTicket />
      </div>
    </main>
  );
}
