import { AppearanceBootstrap } from "@/features/demo-appearance/appearance-bootstrap";
import { defaultAppearance } from "@/features/demo-appearance/appearance-config";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/features/demo-tools/demo-tools.css";
import { DemoTools } from "@/features/demo-tools/demo-tools";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boletera · Propuestas de boletera",
  description:
    "Tres propuestas visuales para una plataforma de eventos y encuentros. Demostración con datos ficticios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      data-demo-appearance={defaultAppearance}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <AppearanceBootstrap />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <DemoTools />
      </body>
    </html>
  );
}
