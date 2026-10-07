"use client";
// Adapted from shadcn.io Music Concert Countdown: same countdown calculation and NumberFlow.
import NumberFlow from "@number-flow/react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCountdown } from "./countdown";

function Countdown({ startsAt }: { startsAt: string }) {
  const [remaining, setRemaining] = useState<ReturnType<
    typeof getCountdown
  > | null>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const target = Date.parse(startsAt);
    const update = () => {
      setRemaining(getCountdown(target, Date.now()));
      if (Date.now() >= target) clearInterval(interval);
    };
    const interval = window.setInterval(update, 1000);
    const initial = window.setTimeout(update, 0);
    return () => {
      clearInterval(interval);
      clearTimeout(initial);
    };
  }, [startsAt]);
  const ended = remaining && Object.values(remaining).every((v) => v === 0);
  return (
    <div className="event-countdown">
      <p>{ended ? "El evento ya comenzó" : "El evento comienza en"}</p>
      {!ended && (
        <div
          className="event-countdown-units"
          role="timer"
          aria-label={
            remaining
              ? `${remaining.days} días, ${remaining.hours} horas, ${remaining.minutes} minutos, ${remaining.seconds} segundos`
              : "Cargando cuenta regresiva"
          }
        >
          {(
            [
              ["days", "Días"],
              ["hours", "Horas"],
              ["minutes", "Minutos"],
              ["seconds", "Segundos"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} aria-hidden="true">
              <strong>
                {remaining ? (
                  <NumberFlow
                    value={remaining[key]}
                    locales="es-MX"
                    format={{ minimumIntegerDigits: 2, useGrouping: false }}
                    animated={!reduce}
                  />
                ) : (
                  "—"
                )}
              </strong>
              <small>{label}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export function EventCountdown({ startsAt }: { startsAt: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="event-countdown-demo">
      <button
        data-demo
        type="button"
        aria-expanded={visible}
        onClick={() => setVisible(!visible)}
      >
        {visible ? "Ocultar cuenta regresiva" : "Mostrar cuenta regresiva"}
        <small>Demo</small>
      </button>
      {visible && <Countdown startsAt={startsAt} />}
    </div>
  );
}
