import type { Metadata } from "next";
import Link from "next/link";
import ImageUpload from "@/components/blocks/21st-dev/file-upload-1/file-upload-1";
import DirectoryUpload from "@/components/blocks/21st-dev/file-upload-1/directory-upload";

export const metadata: Metadata = { title: "File Upload — Imagen y carpeta | Playground" };

export default function FileUploadVariantsPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">File Upload — Imagen y carpeta</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@anubra266/components/file-upload-1" target="_blank" rel="noreferrer" className="underline underline-offset-4">anubra266 / 21st.dev</a>.
        {" "}Selección local y vista previa: no se envían archivos a ningún servidor.
      </p>
      <section className="mt-8 space-y-5 rounded-xl border p-6">
        <h2 className="text-lg font-semibold">Imagen</h2>
        <ImageUpload />
      </section>
      <section className="mt-6 space-y-5 rounded-xl border p-6">
        <h2 className="text-lg font-semibold">Carpeta</h2>
        <p className="text-sm text-muted-foreground">Puedes quitar archivos individualmente o vaciar toda la selección. La selección de carpetas depende del soporte de tu navegador.</p>
        <DirectoryUpload />
      </section>
    </main>
  );
}
