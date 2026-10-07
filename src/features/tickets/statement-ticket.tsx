"use client";

// Typed adaptation of larsen66/admit-one-ticket: ticketClipPath geometry, perforation,
// warm palette, label/name/stub composition and pointer tilt. See ../immersive/README.md.
import { TicketQr } from "./ticket-qr";
import { useId, useRef } from "react";
import { useMotionPreference } from "./use-motion-preference";
import type { DiscoveryEvent } from "./model";
import { formatEventDate, formatEventTime } from "./model";
import type { DemoTicket } from "./model";

function ticketClipPath(width: number, height: number) {
  const r = (25 / 741) * width,
    n = (21 / 741) * width,
    p = (562 / 741) * width;
  return [
    `M ${r} 0`,
    `L ${p - n} 0`,
    `A ${n} ${n} 0 0 0 ${p + n} 0`,
    `L ${width - r} 0`,
    `A ${r} ${r} 0 0 1 ${width} ${r}`,
    `L ${width} ${height - r}`,
    `A ${r} ${r} 0 0 1 ${width - r} ${height}`,
    `L ${p + n} ${height}`,
    `A ${n} ${n} 0 0 0 ${p - n} ${height}`,
    `L ${r} ${height}`,
    `A ${r} ${r} 0 0 1 0 ${height - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    `Z`,
  ].join(" ");
}
export function StatementTicket({
  event,
  ticket,
}: {
  event: DiscoveryEvent;
  ticket?: DemoTicket;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const words = event.title.split(" ");
  const split = Math.ceil(words.length / 2);
  const lines = [
    words.slice(0, split).join(" "),
    words.slice(split).join(" "),
  ].filter(Boolean);
  const fontSize = Math.min(
    58,
    (440 / Math.max(...lines.map((line) => line.length))) * 1.55,
  );
  return (
    <article
      className={
        ticket ? "issued-ticket statement-issued" : "statement-preview"
      }
      aria-label={
        ticket
          ? `Boleto de demostración ${ticket.id}`
          : "Diseño del boleto de demostración"
      }
    >
      <div
        className="statement-ticket"
        ref={ref}
        onPointerMove={(event) => {
          if (reduced || event.pointerType !== "mouse" || !ref.current) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5,
            y = (event.clientY - rect.top) / rect.height - 0.5;
          ref.current.style.transform = `perspective(1200px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg)`;
        }}
        onPointerLeave={() => {
          if (ref.current) ref.current.style.transform = "none";
        }}
      >
        <svg viewBox="0 0 741 425" role="img" aria-labelledby={`${id}-title`}>
          <title
            id={`${id}-title`}
          >{`${event.title}, ${formatEventDate(event.startsAt)}, ${ticket?.seatLabel ?? "Elige tu lugar"}. Boleto de demostración sin validez.`}</title>
          <defs>
            <clipPath id={`${id}-clip`}>
              <path d={ticketClipPath(741, 425)} />
            </clipPath>
            <radialGradient id={`${id}-color`} cx="65%" cy="20%" r="95%">
              <stop stopColor="#fff9ed" />
              <stop offset=".5" stopColor="#eee0c6" />
              <stop offset="1" stopColor="#d8c39e" />
            </radialGradient>
            <pattern
              id={`${id}-grain`}
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r=".6" fill="#947c55" opacity=".14" />
            </pattern>
          </defs>
          <g clipPath={`url(#${id}-clip)`}>
            <path d={ticketClipPath(741, 425)} fill={`url(#${id}-color)`} />
            <path d={ticketClipPath(741, 425)} fill={`url(#${id}-grain)`} />
            <g
              className="ticket-orbits"
              stroke="#b69a67"
              fill="none"
              opacity=".25"
              strokeWidth="22"
            >
              <circle cx="670" cy="105" r="175" />
              <circle cx="670" cy="105" r="220" />
              <circle cx="670" cy="105" r="265" />
            </g>
            <path
              d="M562 22V403"
              stroke="#947c55"
              strokeOpacity=".5"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
            <g fill="#35283f" fontFamily="Arial, sans-serif">
              <text x="48" y="60" fontSize="18" letterSpacing="2">
                BOLETERA PRESENTA
              </text>
              <text x="48" y="88" fontSize="12" letterSpacing="1.5">
                UN ENCUENTRO PARA RECORDAR
              </text>
              {lines.map((line, index) => (
                <text
                  key={line}
                  x="48"
                  y={185 + index * 65}
                  fontSize={fontSize}
                  fontWeight="600"
                  letterSpacing="-2"
                >
                  {line}
                </text>
              ))}
              <text x="48" y="305" fontSize="16">
                {ticket?.seatLabel ?? event.venue}
              </text>
              <text x="48" y="335" fontSize="14">
                {formatEventDate(event.startsAt)} ·{" "}
                {formatEventTime(event.startsAt)} h
              </text>
              <text x="48" y="382" fontSize="12" letterSpacing="1">
                {ticket?.id ?? "VISTA PREVIA · BOLETO DE DEMOSTRACIÓN"}
              </text>
              <text
                x="650"
                y="212"
                transform="rotate(90 650 212)"
                textAnchor="middle"
                fontSize="49"
                fontWeight="600"
                letterSpacing="-1"
              >
                ADMITE UNO
              </text>
            </g>
          </g>
        </svg>
      </div>
      {ticket && <TicketQr ticket={ticket} />}
      {ticket && (
        <div className="issued-ticket-details">
          <strong>{ticket.seatLabel}</strong>
          <span>
            {formatEventDate(event.startsAt)} ·{" "}
            {formatEventTime(event.startsAt)} h
          </span>
          <span>{event.venue}</span>
          <code>{ticket.id}</code>
        </div>
      )}
      <p className="ticket-validity">DEMO · SIN VALIDEZ DE ACCESO</p>
    </article>
  );
}
