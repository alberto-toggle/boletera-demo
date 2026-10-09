"use client";
import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchTickets, type AccessTicket } from "@/features/access/model";
export function TicketSearch({
  tickets,
  eventId,
  onSelect,
}: {
  tickets: AccessTicket[];
  eventId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(12);
  const rows = searchTickets(tickets, eventId, query);
  return (
    <section className="staff-search-panel">
      <header>
        <div>
          <h2>Encuentra al asistente</h2>
          <p>Cada boleto puede ingresar por separado.</p>
        </div>
        <span>{rows.length} boletos</span>
      </header>
      <label className="staff-search">
        <Search size={18} />
        <Input
          aria-label="Buscar asistente"
          placeholder="Nombre, correo, folio de compra o boleto"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(12);
          }}
        />
      </label>
      <div className="staff-ticket-results">
        {rows.slice(0, limit).map((t) => (
          <button
            className="staff-ticket-row"
            key={t.id}
            onClick={() => onSelect(t.id)}
          >
            <span className="staff-avatar">
              {t.buyer
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </span>
            <span>
              <strong>{t.buyer}</strong>
              <small>
                {t.id} · Zona {t.zone} · {t.seat}
              </small>
            </span>
            <span className="staff-status" data-used={!!t.usedAt}>
              {t.usedAt ? "Utilizado" : "Disponible"}
            </span>
            <ArrowUpRight size={15} />
          </button>
        ))}
      </div>
      {!rows.length && (
        <p className="staff-empty">
          No encontramos boletos. Prueba con otro nombre o código.
        </p>
      )}
      {rows.length > limit && (
        <Button variant="outline" onClick={() => setLimit(limit + 12)}>
          Ver más resultados
        </Button>
      )}
    </section>
  );
}
