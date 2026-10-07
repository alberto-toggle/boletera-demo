"use client";
import { ActionLink } from "../components/controls";
import { eventCategories } from "@/domain/events/category";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowUpRight, ListFilter, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "../demo/provider";
import {
  dateLabel,
  eventInventory,
  eventStatusLabels,
  matchesQuery,
  money,
} from "../model";
import {
  AdminSelect,
  EmptyState,
  Pagination,
  SearchField,
  StatusBadge,
} from "../components/controls";
export function EventsView() {
  const { events, sales } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [ascending, setAscending] = useState(true);
  const filtered = events
    .filter(
      (event) =>
        (status === "all" || event.status === status) &&
        (category === "all" || event.category === category) &&
        matchesQuery(`${event.title} ${event.venue}`, query),
    )
    .sort((a, b) =>
      ascending
        ? a.startsAt.localeCompare(b.startsAt)
        : b.startsAt.localeCompare(a.startsAt),
    );
  const pageSize = 8;
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / pageSize)),
  );
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">DE LA IDEA AL ENCUENTRO</p>
          <h1>Eventos</h1>
          <p>Prepara, publica y acompaña cada experiencia.</p>
        </div>
        <ActionLink href="/admin/eventos/nuevo">
          <Plus />
          Crear evento
        </ActionLink>
      </div>
      <div className="admin-tabs" role="group" aria-label="Filtrar por estado">
        {[
          { value: "all", label: "Todos" },
          { value: "published", label: "Publicados" },
          { value: "draft", label: "Borradores" },
          { value: "unpublished", label: "No publicados" },
        ].map((tab) => (
          <button
            type="button"
            key={tab.value}
            aria-pressed={status === tab.value}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
          >
            {tab.label}
            <span>
              {
                events.filter(
                  (event) => tab.value === "all" || event.status === tab.value,
                ).length
              }
            </span>
          </button>
        ))}
      </div>
      <section className="admin-panel">
        <div className="admin-toolbar">
          <SearchField
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Buscar evento o recinto…"
          />
          <div>
            <ListFilter size={16} className="admin-muted" />
            <AdminSelect
              label="Categoría de evento"
              value={category}
              onChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
              options={[
                { value: "all", label: "Todas las categorías" },
                ...eventCategories.map((value) => ({ value, label: value })),
              ]}
            />
            <Button variant="outline" onClick={() => setAscending(!ascending)}>
              <ArrowDownUp />
              {ascending ? "Fecha ascendente" : "Fecha descendente"}
            </Button>
          </div>
        </div>
        {filtered.length ? (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Fecha y hora</th>
                  <th>Estado</th>
                  <th>Aforo vendido</th>
                  <th className="align-right">Desde</th>
                  <th>
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((event) => {
                    const stats = eventInventory(event, sales);
                    return (
                      <tr key={event.id}>
                        <td>
                          <Link
                            className="admin-event-cell"
                            href={`/admin/eventos/${event.id}`}
                          >
                            <Image
                              src={event.image}
                              width={48}
                              height={42}
                              alt=""
                            />
                            <span>
                              <strong>{event.title}</strong>
                              <small>{event.venue}</small>
                            </span>
                          </Link>
                        </td>
                        <td className="admin-nowrap">
                          {dateLabel(event.startsAt)}
                          <small className="admin-cell-sub">
                            {new Intl.DateTimeFormat("es-MX", {
                              timeZone: "America/Mexico_City",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }).format(new Date(event.startsAt))}{" "}
                            h · CDMX
                          </small>
                        </td>
                        <td>
                          <StatusBadge
                            label={eventStatusLabels[event.status]}
                            tone={
                              event.status === "published"
                                ? "green"
                                : event.status === "draft"
                                  ? "amber"
                                  : "neutral"
                            }
                          />
                        </td>
                        <td>
                          <div className="admin-capacity">
                            <span>
                              {stats.sold} <small>/ {stats.capacity}</small>
                              <small>{stats.percentage}%</small>
                            </span>
                            <progress
                              value={stats.sold}
                              max={stats.capacity}
                              aria-label={`Aforo vendido de ${event.title}`}
                            />
                          </div>
                        </td>
                        <td className="align-right admin-money">
                          {money(
                            Math.min(
                              ...event.zones.map((zone) => zone.priceMinor),
                            ),
                          )}
                        </td>
                        <td>
                          <ActionLink
                            variant="ghost"
                            size="icon"
                            href={`/admin/eventos/${event.id}`}
                            aria-label={`Gestionar ${event.title}`}
                          >
                            <ArrowUpRight />
                          </ActionLink>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No encontramos eventos"
            description="Prueba otra búsqueda o cambia los filtros."
          >
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setStatus("all");
              }}
            >
              Limpiar filtros
            </Button>
          </EmptyState>
        )}
        <Pagination
          page={currentPage}
          total={filtered.length}
          pageSize={pageSize}
          onChange={setPage}
        />
      </section>
    </div>
  );
}
