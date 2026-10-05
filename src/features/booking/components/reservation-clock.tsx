import { Timer } from "lucide-react";

export function ReservationClock({
  remainingSeconds,
}: {
  remainingSeconds: number;
}) {
  const urgent = remainingSeconds <= 60;
  return (
    <div className={`reservation-banner${urgent ? " reservation-urgent" : ""}`}>
      <Timer size={22} aria-hidden="true" />
      <div>
        <strong>Tus lugares están reservados</strong>
        <span>
          {urgent
            ? "Queda menos de un minuto para completar tu compra."
            : "Completa tu compra antes de que termine el tiempo."}
        </span>
      </div>
      <time role="timer" aria-label="Tiempo restante de reserva">
        {String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:
        {String(remainingSeconds % 60).padStart(2, "0")}
      </time>
      <span className="sr-only" role="status">
        {urgent
          ? "Tu reserva está por vencer."
          : "Reserva de demostración iniciada por cinco minutos."}
      </span>
    </div>
  );
}
