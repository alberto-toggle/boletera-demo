import type { Metadata } from "next";
import Link from "next/link";
import MusicConcertTickets from "@/components/blocks/shadcn-io/music-concert-tickets/music-concert-tickets";

export const metadata: Metadata = {
  title: "Music Concert Tickets | Playground",
};

export default function MusicConcertTicketsPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Music Concert Tickets</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Bloque de shadcn.io con datos de ejemplo. Prueba las categorías y la
        cantidad de boletos para ver el subtotal, la comisión del 12 % y el total.
      </p>
      <div className="mt-8 rounded-xl border bg-muted/20 py-4">
        <MusicConcertTickets />
      </div>
    </main>
  );
}
