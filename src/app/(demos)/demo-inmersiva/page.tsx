import type { Metadata } from "next";
import { ImmersiveHome } from "@/features/immersive/immersive-home";
export const metadata: Metadata = { title: "Boletera · Propuesta inmersiva" };
export default function Page() {
  return <ImmersiveHome />;
}
