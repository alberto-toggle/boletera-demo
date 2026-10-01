import type { Metadata } from "next";
import Link from "next/link";
import ConditionGrid from "@/components/blocks/21st-dev/conditiongrid/conditiongrid";
import { conditionGridProjects } from "@/components/blocks/21st-dev/conditiongrid/conditiongrid-data";

export const metadata: Metadata = { title: "Condition Grid | Playground" };

export default function ConditionGridPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Condition Grid</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@uilayout.contact/components/conditiongrid" target="_blank" rel="noreferrer" className="underline underline-offset-4">uilayout.contact / 21st.dev</a>.
        {" "}Cuadrícula de proyectos con columnas alternadas y entrada animada al aparecer en pantalla.
      </p>
      <div className="mt-8"><ConditionGrid projects={conditionGridProjects} /></div>
    </main>
  );
}
