import type { Metadata } from "next";
import Link from "next/link";
import { CardFolderDemo } from "@/components/blocks/beui/card-folder/demo";

export const metadata: Metadata = { title: "Card Folder | Playground" };

export default function CardFolderPage() {
  return (
    <main
      lang="es"
      className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8"
    >
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Card Folder</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        BE UI · Toca la cartera para descubrir la tarjeta o usa Enter al
        enfocarla. El botón del ojo permite probar la animación de los datos de
        ejemplo.
      </p>
      <div className="mt-8">
        <CardFolderDemo />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Tarjetas ficticias para explorar el componente. No guarda métodos de
        pago ni realiza cargos.
      </p>
    </main>
  );
}
