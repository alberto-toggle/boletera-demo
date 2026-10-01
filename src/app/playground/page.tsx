import type { Metadata } from "next";
import Link from "next/link";
import { playgroundBlocks } from "@/lib/playground";

export const metadata: Metadata = {
  title: "Playground | Boletera",
  description: "Espacio para explorar bloques y componentes de Boletera.",
};

export default function PlaygroundPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:px-10">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Boletera / Playground
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        Bloques y componentes
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
        Un espacio para explorar y probar componentes. Cada bloque o grupo de
        componentes tendrá su propia vista para revisarlo por separado.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {playgroundBlocks.map((block) => (
          <li key={block.href}>
            <Link
              href={block.href}
              className="block rounded-2xl border p-6 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <p className="text-xs font-medium text-muted-foreground">{block.provider}</p>
              <h2 className="mt-2 text-lg font-medium">{block.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{block.description}</p>
              <span className="mt-4 inline-block text-sm font-medium">Ver bloque →</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
