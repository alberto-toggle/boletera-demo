import type { Metadata } from "next";
import Link from "next/link";
import SignUpDemo from "@/components/blocks/21st-dev/sign-up-1/sign-up-1-demo";

export const metadata: Metadata = { title: "Sign Up Split Panel | Playground" };

export default function SignUpPage() {
  return (
    <main
      lang="es"
      className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8"
    >
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Sign Up Split Panel</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a
          href="https://21st.dev/@diarmuradi/components/sign-up-1"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          diarmuradi / 21st.dev
        </a>
        . Registro con proveedores sociales, contraseña visible u oculta y panel
        lateral de testimonio del ejemplo original.
      </p>
      <section aria-label="Vista previa del registro" className="mt-8">
        <SignUpDemo />
      </section>
    </main>
  );
}
