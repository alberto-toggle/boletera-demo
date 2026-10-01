import type { Metadata } from "next";
import Link from "next/link";
import { CinemaTicket } from "@/components/blocks/uitripled/cinema-ticket-shadcnui/cinema-ticket-shadcnui";

export const metadata: Metadata = { title: "Cinema Ticket | Playground" };

export default function CinemaTicketPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Cinema Ticket</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen: UI TripleD. Boleto de cine con imagen, detalles de la función y animación al pasar el cursor.
        Los datos son de ejemplo y el QR es decorativo.
      </p>
      <div lang="en" className="mt-8 overflow-hidden rounded-xl border bg-background"><CinemaTicket /></div>
    </main>
  );
}
