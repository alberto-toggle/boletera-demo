import type { Metadata } from "next";
import { GalaHome } from "@/features/event-discovery/views/gala-home";
export const metadata: Metadata = { title: "Boletera · Propuesta gala" };
export default function Page() {
  return <GalaHome />;
}
