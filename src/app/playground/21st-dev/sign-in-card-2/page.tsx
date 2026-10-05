import type { Metadata } from "next";
import Link from "next/link";
import SignInCardDemo from "@/components/blocks/21st-dev/sign-in-card-2/sign-in-card-2-demo";

export const metadata: Metadata = { title: "Sign In Card | Playground" };

export default function SignInCardPage() {
  return (
    <main
      lang="es"
      className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8"
    >
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Sign In Card</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a
          href="https://21st.dev/@jatin-yadav05/components/sign-in-card-2"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          jatin-yadav05 / 21st.dev
        </a>
        . Tarjeta de acceso con luces animadas, fondo morado e inclinación
        interactiva.
      </p>
      <section aria-label="Vista previa de inicio de sesión" className="mt-8">
        <SignInCardDemo />
      </section>
    </main>
  );
}
