"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
export function QrScanner({ onRead }: { onRead: (value: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const callback = useRef(onRead);
  useEffect(() => {
    callback.current = onRead;
  }, [onRead]);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let stream: MediaStream | undefined;
    let frame = 0;
    let last = 0;
    let previous = "";
    let lastRead = 0;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error(
            "La cámara requiere HTTPS o localhost. Puedes capturar el código manualmente.",
          );
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const element = video.current;
        if (!element) return;
        element.srcObject = stream;
        await element.play();
        const { default: decode } = await import("jsqr");
        if (cancelled) return;
        const scan = (time: number) => {
          if (cancelled) return;
          if (context && element.readyState >= 2 && time - last > 180) {
            last = time;
            canvas.width = 640;
            canvas.height = Math.round(
              (640 * element.videoHeight) / element.videoWidth,
            );
            context.drawImage(element, 0, 0, canvas.width, canvas.height);
            const pixels = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            );
            const code = decode(pixels.data, pixels.width, pixels.height, {
              inversionAttempts: "dontInvert",
            });
            if (
              code?.data &&
              (code.data !== previous || time - lastRead > 5000)
            ) {
              previous = code.data;
              lastRead = time;
              callback.current(code.data);
            }
          }
          frame = requestAnimationFrame(scan);
        };
        frame = requestAnimationFrame(scan);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof DOMException && e.name === "NotAllowedError"
              ? "No se concedió acceso a la cámara. Puedes usar la búsqueda o capturar el código."
              : e instanceof Error
                ? e.message
                : "No se pudo abrir la cámara.",
          );
          setActive(false);
        }
      }
    }
    void start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active]);
  return (
    <section className="staff-scanner">
      <div className="staff-viewfinder">
        {active ? (
          <video
            ref={video}
            muted
            playsInline
            aria-label="Vista de cámara para leer QR"
          />
        ) : (
          <div className="staff-camera-placeholder">
            <ScanLine size={58} strokeWidth={1} />
            <strong>Un boleto. Una bienvenida.</strong>
            <p>Activa la cámara y coloca el QR dentro del encuadre.</p>
          </div>
        )}
        <div className="staff-scan-frame" aria-hidden="true" />
        {active && <span className="staff-camera-live">Cámara activa</span>}
      </div>
      <div className="staff-scanner-controls">
        <span>Lectura de códigos QR</span>
        <Button
          variant="outline"
          onClick={() => {
            setError("");
            setActive(!active);
          }}
        >
          {active ? <CameraOff size={16} /> : <Camera size={16} />}{" "}
          {active ? "Detener cámara" : "Activar cámara"}
        </Button>
      </div>
      {error && (
        <p className="staff-inline-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
