import Link from "next/link";
import Demo from "@/components/blocks/21st-dev/animated-card-diagram-badtzx0/demo";
export const metadata = {
  title: "Animated Card Diagram · badtzx0 | Playground",
};
export default function Page() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">
        Animated Card Diagram · badtzx0
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Origen: 21st.dev · badtzx0. Datos de ejemplo.
      </p>
      <div lang="en" className="mt-8 min-w-0 overflow-x-auto">
        <Demo />
      </div>
    </main>
  );
}
