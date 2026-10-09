"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Asterisk,
  ArrowLeft,
  ArrowUpRight,
  CheckCheck,
  Ticket,
  Clock,
  Search,
} from "lucide-react";
import { QrCode } from "@ark-ui/react/qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useInternalAccess,
  InternalSignOut,
} from "@/features/internal-access/access";
import { accessCatalog } from "@/features/access/demo/catalog";
import { registerAccess, useAccessRecords } from "@/features/access/demo/store";
import { checkTicket, type AccessResult } from "@/features/access/model";
import { QrScanner } from "./components/qr-scanner";
import { AccessResultCard } from "./components/access-result";
import { TicketSearch } from "./components/ticket-search";
export function StaffApp() {
  const { name } = useInternalAccess();
  const [catalog] = useState(accessCatalog);
  const records = useAccessRecords();
  const tickets = useMemo(
    () =>
      catalog.tickets.map((t) => ({
        ...t,
        usedAt:
          records.find((r) => r.ticketId === t.id && r.eventId === t.eventId)
            ?.usedAt ?? t.usedAt,
      })),
    [catalog, records],
  );
  const [eventId, setEventId] = useState<string | null>(null);
  const [mode, setMode] = useState<"scan" | "search">("scan");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AccessResult | null>(null);
  const [entered, setEntered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const event = catalog.events.find((e) => e.id === eventId);
  const eventTickets = tickets.filter((t) => t.eventId === eventId);
  const used = eventTickets.filter((t) => t.usedAt).length;
  function inspect(value: string) {
    if (busy || (result?.kind === "ready" && !entered)) return;
    setResult(checkTicket(tickets, eventId ?? "", value));
    setEntered(false);
    setNotice("");
  }
  function select(value: string) {
    if (busy) return;
    setCode(value);
    setResult(checkTicket(tickets, eventId ?? "", value));
    setEntered(false);
    setNotice("");
  }
  async function confirm() {
    if (!eventId || result?.kind !== "ready" || busy) return;
    setBusy(true);
    try {
      const current = checkTicket(tickets, eventId, result.ticket.id);
      if (current.kind !== "ready") {
        setResult(current);
        return;
      }
      const response = await registerAccess({
        ticketId: current.ticket.id,
        eventId,
        usedAt: new Date().toISOString(),
        operator: name,
      });
      if (response.duplicate) {
        setResult({
          kind: "used",
          ticket: current.ticket,
          usedAt: response.record.usedAt,
        });
        setEntered(false);
      } else {
        setEntered(true);
        if (!response.persisted)
          setNotice(
            "Ingreso guardado solo en esta pestaña: el navegador no permite conservar datos.",
          );
      }
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="staff-theme">
      <header className="staff-header">
        <Link href="/" className="staff-brand">
          <Asterisk size={28} />
          boletera.
        </Link>
        <span className="staff-workspace">Control de acceso</span>
        <div>
          <span>{name}</span>
          <InternalSignOut />
        </div>
      </header>
      <main className="staff-main">
        {!event ? (
          <>
            <div className="staff-heading">
              <div>
                <p className="staff-kicker">
                  UNA GRAN EXPERIENCIA EMPIEZA EN LA PUERTA
                </p>
                <h1>¿A quién recibimos hoy?</h1>
                <p>Selecciona el evento para comenzar a validar boletos.</p>
              </div>
              <label className="staff-search">
                <Search size={17} />
                <Input
                  aria-label="Buscar evento de acceso"
                  placeholder="Buscar evento"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            <div className="staff-event-grid">
              {catalog.events
                .filter((e) =>
                  e.title.toLowerCase().includes(query.toLowerCase()),
                )
                .map((e) => (
                  <button
                    key={e.id}
                    className="staff-event"
                    onClick={() => {
                      setEventId(e.id);
                      setResult(null);
                      setEntered(false);
                    }}
                  >
                    <div className="staff-event-photo">
                      <Image
                        src={e.image}
                        alt=""
                        fill
                        sizes="(max-width:700px) 100vw, 33vw"
                      />
                    </div>
                    <div>
                      <small>
                        {new Intl.DateTimeFormat("es-MX", {
                          dateStyle: "long",
                          timeZone: "America/Mexico_City",
                        }).format(new Date(e.startsAt))}
                      </small>
                      <h2>{e.title}</h2>
                      <p>{e.venue}</p>
                      <span>
                        Abrir control de acceso
                        <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </button>
                ))}
            </div>
            <p data-demo className="staff-demo-note">
              Puedes explorar el acceso de cualquier evento de demostración,
              independientemente de su fecha.
            </p>
          </>
        ) : (
          <>
            <button
              className="staff-back"
              onClick={() => {
                setEventId(null);
                setResult(null);
                setCode("");
              }}
            >
              <ArrowLeft size={15} />
              Cambiar evento
            </button>
            <div className="staff-heading">
              <div>
                <p className="staff-kicker">CONTROL DE ACCESO</p>
                <h1>{event.title}</h1>
                <p>{event.venue}</p>
              </div>
              <span className="staff-live">Sesión de acceso</span>
            </div>
            <div className="staff-metrics">
              {[
                {
                  label: "Boletos vendidos",
                  value: eventTickets.length,
                  icon: Ticket,
                },
                {
                  label: "Entradas registradas",
                  value: used,
                  icon: CheckCheck,
                },
                {
                  label: "Pendientes de ingreso",
                  value: eventTickets.length - used,
                  icon: Clock,
                },
              ].map((m) => (
                <div key={m.label}>
                  <m.icon size={18} />
                  <span>{m.label}</span>
                  <strong>{m.value}</strong>
                </div>
              ))}
            </div>
            <div className="staff-workbench">
              <div>
                <div className="staff-tabs">
                  <button
                    aria-pressed={mode === "scan"}
                    onClick={() => setMode("scan")}
                  >
                    Escanear boleto
                  </button>
                  <button
                    aria-pressed={mode === "search"}
                    onClick={() => setMode("search")}
                  >
                    Buscar asistente
                  </button>
                </div>
                {mode === "scan" ? (
                  <>
                    <QrScanner onRead={inspect} />
                    <form
                      className="staff-code-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        select(code);
                      }}
                    >
                      <label htmlFor="ticket-code">
                        O captura el código del boleto
                      </label>
                      <div>
                        <Input
                          id="ticket-code"
                          required
                          maxLength={120}
                          value={code}
                          placeholder="Ej. ADM-1002-1"
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <Button type="submit" disabled={busy}>
                          Consultar
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <TicketSearch
                    tickets={tickets}
                    eventId={event.id}
                    onSelect={select}
                  />
                )}
                <div data-demo className="staff-demo-controls">
                  <strong>Probar escenarios</strong>
                  {[
                    {
                      label: "Válido",
                      id: eventTickets.find((t) => !t.usedAt)?.id,
                    },
                    {
                      label: "Ya utilizado",
                      id: eventTickets.find((t) => t.usedAt)?.id,
                    },
                    {
                      label: "Otro evento",
                      id: tickets.find((t) => t.eventId !== event.id)?.id,
                    },
                    { label: "Inexistente", id: "DEMO-NO-EXISTE" },
                  ].map((item) => (
                    <Button
                      variant="outline"
                      size="sm"
                      key={item.label}
                      disabled={!item.id || busy}
                      onClick={() => item.id && select(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
                {eventTickets.find((t) => !t.usedAt) && (
                  <details data-demo className="staff-sample-qr">
                    <summary>Mostrar QR de prueba</summary>
                    <QrCode.Root
                      value={eventTickets.find((t) => !t.usedAt)?.id ?? ""}
                      encoding={{ ecc: "M", border: 4 }}
                    >
                      <QrCode.Frame aria-label="QR de boleto de prueba">
                        <QrCode.Pattern />
                      </QrCode.Frame>
                    </QrCode.Root>
                    <code>{eventTickets.find((t) => !t.usedAt)?.id}</code>
                    <p>
                      Abre este QR en otro dispositivo para probar la cámara.
                      Solo corresponde al catálogo de staff de esta demo.
                    </p>
                  </details>
                )}
              </div>
              <aside>
                <AccessResultCard
                  result={result}
                  entered={entered}
                  busy={busy}
                  onConfirm={() => void confirm()}
                  onClose={() => {
                    setResult(null);
                    setEntered(false);
                    setCode("");
                  }}
                />
                {notice && <p role="status">{notice}</p>}
                <p className="staff-access-note">
                  Solo se registra el primer ingreso. Los reingresos se
                  controlan con el mecanismo físico definido para el evento.
                </p>
              </aside>
            </div>
          </>
        )}
      </main>
      <footer className="staff-footer">
        Boletera · Staff de puerta <span>Entorno de demostración</span>
      </footer>
    </div>
  );
}
