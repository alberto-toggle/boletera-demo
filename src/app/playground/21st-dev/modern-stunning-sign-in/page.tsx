import type { Metadata } from "next";
import Link from "next/link";
import ModernStunningSignInDemo from "@/components/blocks/21st-dev/modern-stunning-sign-in/modern-stunning-sign-in-demo";

export const metadata: Metadata = {
  title: "Modern & Stunning Sign In | Playground",
};

export default function ModernStunningSignInPage() {
  return (
    <main
      lang="es"
      className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8"
    >
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">
        Modern &amp; Stunning Sign In
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a
          href="https://21st.dev/@preetsuthar17/components/modern-stunning-sign-in"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          preetsuthar17 / 21st.dev
        </a>
        . Formulario de acceso oscuro con tarjeta translúcida y avatares del
        ejemplo original.
      </p>
      <section aria-label="Vista previa de inicio de sesión" className="mt-8">
        <ModernStunningSignInDemo />
      </section>
    </main>
  );
}
