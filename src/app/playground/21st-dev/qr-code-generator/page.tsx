import type { Metadata } from "next";
import Link from "next/link";
import QRCodeGeneratorDemo from "@/components/blocks/21st-dev/qr-code-generator/qr-code-generator-demo";

export const metadata: Metadata = { title: "QR Code Generator | Playground" };

export default function QRCodeGeneratorPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">QR Code Generator</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@user_xn1cklas/components/qr-code-generator" target="_blank" rel="noreferrer" className="underline underline-offset-4">user_xn1cklas / 21st.dev</a>.
        {" "}Vista previa y descarga en PNG. El ejemplo original usa un patrón decorativo: no contiene datos escaneables ni funciona como boleto.
      </p>
      <div className="mt-8 flex justify-center"><QRCodeGeneratorDemo /></div>
    </main>
  );
}
