import Link from "next/link";
import Demo from "@/components/blocks/21st-dev/area-charts-2-sean0205/demo";
export const metadata = { title: "Area Charts 2 · sean0205 | Playground" };
export default function Page() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Area Charts 2 · sean0205</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Origen: 21st.dev · sean0205. Datos de ejemplo.
      </p>
      <div lang="en" className="mt-8 min-w-0 overflow-x-auto">
        <Demo />
      </div>
    </main>
  );
}
