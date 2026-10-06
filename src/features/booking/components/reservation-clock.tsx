"use client";
import { useState } from "react";
import { Timer } from "lucide-react";
import { RollingDigits } from "./countdown/rolling-digits";

export function ReservationClock({
  remainingSeconds,
}: {
  remainingSeconds: number;
}) {
  const [alert, setAlert] = useState(false);
  const value = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;
  return (
    <div
      className={`purchase-clock${alert ? " purchase-clock-alert" : ""}`}
    >
      <Timer className="purchase-clock-icon" size={22} aria-hidden="true" />
      <strong>Completa tu compra en</strong>
      <time role="timer" aria-label={`Tiempo restante de reserva: ${value}`}>
        <RollingDigits value={value} />
      </time>
      <button type="button" aria-pressed={alert}
        title="Activar o desactivar el pulso en icono y números"
        onClick={() => setAlert(!alert)}>
        Alerta <small>Demo</small>
      </button>
    </div>
  );
}
