import type { Metadata } from "next";
import { InstitutionalHome } from "@/features/event-discovery/views/institutional-home";
export const metadata: Metadata = {
  title: "Boletera · Propuesta institucional",
};
export default function Page() {
  return <InstitutionalHome />;
}
