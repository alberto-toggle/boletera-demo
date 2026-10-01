import type { Metadata } from "next";
import Link from "next/link";
import EventRegistration from "@/components/blocks/shadcn-ui-blocks/marketing-hero-forms-event-registration-countdown/marketing-hero-forms-event-registration-countdown";

export const metadata: Metadata = { title: "Event Registration Countdown | Playground" };

export default function EventRegistrationPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Event Registration Countdown</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Hero de shadcn-ui-blocks con cuenta regresiva y formulario de registro.
        Puedes probar los campos y tipos de boleto con datos ficticios; el envío está desactivado.
      </p>
      <div lang="en" className="mt-8 overflow-hidden rounded-xl border">
        <EventRegistration />
      </div>
    </main>
  );
}
