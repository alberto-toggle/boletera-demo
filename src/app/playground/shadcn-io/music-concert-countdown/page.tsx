import type { Metadata } from "next";
import Link from "next/link";
import MusicConcertCountdown from "@/components/blocks/shadcn-io/music-concert-countdown/music-concert-countdown";

export const metadata: Metadata = {
  title: "Music Concert Countdown | Playground",
};

export default function MusicConcertCountdownPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Music Concert Countdown</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Contador de shadcn.io para un concierto de ejemplo el 17 de noviembre de
        2026 a las 20:00 en Washington, DC (EST, UTC−5). Se actualiza cada segundo;
        compra y calendario están inactivos.
      </p>
      <div className="mt-8 rounded-xl border bg-muted/20 py-4">
        <MusicConcertCountdown />
      </div>
    </main>
  );
}
