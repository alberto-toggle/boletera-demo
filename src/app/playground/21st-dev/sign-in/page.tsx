import type { Metadata } from "next";
import Link from "next/link";
import SignInPageDemo from "@/components/blocks/21st-dev/sign-in/sign-in-demo";

export const metadata: Metadata = { title: "Sign In | Playground" };

export default function SignInPlaygroundPage() {
  return (
    <main
      lang="es"
      className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-10 sm:px-8"
    >
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Sign In</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a
          href="https://21st.dev/@jahed/components/sign-in"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          jahed / 21st.dev
        </a>
        . Formulario de acceso con imagen lateral, testimonios y animaciones de
        entrada.
      </p>
      <section
        aria-label="Vista previa de inicio de sesión"
        className="mt-8 overflow-hidden rounded-3xl border"
      >
        <SignInPageDemo />
      </section>
    </main>
  );
}
