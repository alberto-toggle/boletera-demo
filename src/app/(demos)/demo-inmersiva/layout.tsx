import "@/features/immersive/immersive.css";
import { ImmersivePalette } from "@/features/immersive/components/palette-switcher";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ImmersivePalette>{children}</ImmersivePalette>;
}
