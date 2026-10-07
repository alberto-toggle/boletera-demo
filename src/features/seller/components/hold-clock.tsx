"use client";

import { useState } from "react";
import { Timer } from "lucide-react";
import { RollingDigits } from "@/components/ui/rolling-digits";

export function HoldClock({
  remainingSeconds,
  held,
  collecting,
  extended,
  onExtend,
  onDemoShorten,
}: {
  remainingSeconds: number;
  held: boolean;
  collecting: boolean;
  extended: boolean;
  onExtend: () => void;
  onDemoShorten: () => void;
}) {
  const [alert, setAlert] = useState(false);
  const value = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;
  return (
    <div
      className={`seller-clock${alert && !held ? " seller-clock-alert" : ""}`}
    >
      <div className="seller-clock-time">
        <Timer className="seller-clock-icon" size={22} aria-hidden="true" />
        <strong>{held ? "Lugares retenidos" : "Completa la venta en"}</strong>
        {!held && (
          <time
            role="timer"
            aria-label={`Tiempo restante de apartado: ${value}`}
          >
            <RollingDigits value={value} />
          </time>
        )}
      </div>
      {held ? (
        <small>
          {collecting
            ? "Hasta aclarar el cobro"
            : "Venta con pagos registrados"}
        </small>
      ) : (
        <div className="seller-clock-actions">
          <button
            data-demo
            type="button"
            aria-pressed={alert}
            title="Activar o desactivar el pulso en icono y números"
            onClick={() => setAlert(!alert)}
          >
            Alerta <small>Demo</small>
          </button>
          <button
            data-demo
            type="button"
            disabled={remainingSeconds <= 10}
            onClick={onDemoShorten}
          >
            Saltar a 00:10 <small>Demo</small>
          </button>
          {extended ? (
            <small role="status">Extensión de 5 minutos utilizada</small>
          ) : (
            <button
              type="button"
              disabled={remainingSeconds <= 0}
              onClick={onExtend}
            >
              Extender 5 minutos <small>Una vez</small>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
