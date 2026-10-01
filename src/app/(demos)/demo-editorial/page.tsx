import type { Metadata } from "next";
import { EditorialHome } from "@/features/event-discovery/views/editorial-home";
export const metadata: Metadata = { title: "Boletera · Propuesta editorial" };
export default function Page() {
  return <EditorialHome />;
}
