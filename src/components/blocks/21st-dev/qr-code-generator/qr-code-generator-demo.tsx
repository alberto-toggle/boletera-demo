"use client";

import { useEffect, useState } from "react";
import QRCodeDisplay, { type QRCodeResult } from "./qr-code-generator";
import { makePlaceholderDataURL } from "./qr-code-placeholder";

type PreviewState =
  | { status: "loading" }
  | { status: "ready"; result: QRCodeResult }
  | { status: "error"; message: string };

export default function QRCodeGeneratorDemo() {
  const [state, setState] = useState<PreviewState>({ status: "loading" });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const size = 300;
        setState({
          status: "ready",
          result: { data: "Patrón visual de ejemplo; no es un QR válido", size, output: makePlaceholderDataURL(size) },
        });
      } catch {
        setState({ status: "error", message: "No se pudo crear la imagen de ejemplo." });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <QRCodeDisplay
      data={state.status === "ready" ? state.result : null}
      isLoading={state.status === "loading"}
      error={state.status === "error" ? state.message : null}
    />
  );
}
