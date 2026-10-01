import type { Metadata } from "next";
import Link from "next/link";
import CoverUpload from "@/components/blocks/21st-dev/file-upload/file-upload";

export const metadata: Metadata = { title: "File Upload | Playground" };

export default function FileUploadPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">File Upload</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@sean0205/components/file-upload" target="_blank" rel="noreferrer" className="underline underline-offset-4">sean0205 / 21st.dev</a>.
        {" "}Variante de imagen de portada. La selección y el progreso son locales; los archivos no se envían a ningún servidor.
      </p>
      <div className="mt-8"><CoverUpload /></div>
    </main>
  );
}
