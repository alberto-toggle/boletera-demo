"use client";
import { ActionLink } from "../components/controls";
import { useState } from "react";
import { EventImageGallery } from "../media/event-image-gallery";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  EyeOff,
  Globe,
  CalendarDays,
  MapPin,
  Ticket,
  Wallet,
  Armchair,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "../demo/provider";
import {
  dateLabel,
  eventInventory,
  eventStatusLabels,
  money,
  zoneSold,
} from "../model";
import { AdminDialog, EmptyState, StatusBadge } from "../components/controls";
import { MetricCards } from "../components/metric-cards";
import { VenuePreview } from "./venue-preview";
export function EventDetail({ eventId }: { eventId: string }) {
  const { events, sales, saveEvent } = useAdmin();
  const event = events.find((item) => item.id === eventId);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  if (!event)
    return (
      <EmptyState
        title="Evento no encontrado"
        description="Es posible que se hayan restablecido los datos de esta demo."
      >
        <ActionLink href="/admin/eventos">Volver a eventos</ActionLink>
      </EmptyState>
    );
  const inventory = eventInventory(event, sales);
  const published = event.status === "published";
  return (
    <div className="admin-page">
      <Link href="/admin/eventos" className="admin-back">
        <ArrowLeft size={15} />
        Eventos
      </Link>
      <div className="admin-page-heading">
        <div className="admin-detail-title">
          <StatusBadge
            label={eventStatusLabels[event.status]}
            tone={
              published
                ? "green"
                : event.status === "draft"
                  ? "amber"
                  : "neutral"
            }
          />
          <h1>{event.title}</h1>
          <p>
            {event.category} · {event.venue}
          </p>
        </div>
        <div className="admin-actions">
          <ActionLink
            variant="outline"
            href={`/admin/eventos/${event.id}/editar`}
          >
            <Pencil />
            Editar evento
          </ActionLink>
          <Button
            variant={published ? "outline" : "default"}
            onClick={() => setConfirm(true)}
          >
            {published ? <EyeOff /> : <Globe />}
            {published ? "Retirar publicación" : "Publicar evento"}
          </Button>
        </div>
      </div>
      <MetricCards
        items={[
          {
            label: "Capacidad total",
            value: String(inventory.capacity),
            detail: `${event.zones.length} zonas configuradas`,
            icon: Armchair,
          },
          {
            label: "Boletos vendidos",
            value: String(inventory.sold),
            detail: `${inventory.percentage}% del aforo`,
            icon: Ticket,
          },
          {
            label: "Disponibles",
            value: String(inventory.available),
            detail: "Inventario de esta demo",
            icon: CalendarDays,
          },
          {
            label: "Ingresos acumulados",
            value: money(inventory.revenue),
            detail: "Solo ventas confirmadas · MXN",
            icon: Wallet,
          },
        ]}
      />
      <div className="admin-detail-grid">
        <section className="admin-panel">
          <EventImageGallery
            cover={event.image}
            title={event.title}
            images={event.images}
          />
          <div className="admin-panel-content">
            <h2>Acerca del evento</h2>
            <p className="admin-description">{event.description}</p>
            <div className="admin-event-facts">
              <div>
                <CalendarDays size={17} />
                <span>
                  <strong>{dateLabel(event.startsAt, true)}</strong>
                  <small>Horario de Ciudad de México</small>
                </span>
              </div>
              <div>
                <MapPin size={17} />
                <span>
                  <strong>{event.venue}</strong>
                  <small>Ciudad de México</small>
                </span>
              </div>
            </div>
            <h3>La experiencia incluye</h3>
            <ul className="admin-includes">
              {event.includes.map((item) => (
                <li key={item}>
                  <Check size={14} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Recinto y distribución</h2>
              <p>
                {event.layout === "banquet"
                  ? "Cena-baile · Mesas y pista central"
                  : "Auditorio · Asientos numerados"}
              </p>
            </div>
          </div>
          <VenuePreview layout={event.layout} zones={event.zones} />
          <p className="admin-venue-caption">
            Distribución de referencia · No está a escala
          </p>
          <div className="admin-panel-content admin-top-line">
            <h3>Publicación</h3>
            <p className="admin-description">
              {published
                ? "El evento está marcado como disponible para ambos canales en esta propuesta."
                : "El evento no está disponible para nuevas ventas en esta propuesta."}
            </p>
            <p data-demo>
              La publicación es una simulación aislada: no modifica los eventos
              de las demos públicas ni de taquilla.
            </p>
          </div>
        </section>
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Zonas y precios</h2>
            <p>Importes por boleto en pesos mexicanos</p>
          </div>
          <Link
            href={`/admin/ventas?evento=${event.id}`}
            className="admin-text-link"
          >
            Ver ventas del evento
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Zona</th>
                <th>Capacidad</th>
                <th>Vendidos</th>
                <th>Disponibles</th>
                <th className="align-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              {event.zones.map((zone) => {
                const sold = zoneSold(event.id, zone.id, sales);
                return (
                  <tr key={zone.id}>
                    <td>
                      <strong>{zone.name}</strong>
                    </td>
                    <td>{zone.capacity}</td>
                    <td>{sold}</td>
                    <td>{zone.capacity - sold}</td>
                    <td className="align-right admin-money">
                      {money(zone.priceMinor)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <AdminDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={
          published
            ? "¿Retirar este evento de publicación?"
            : "¿Publicar este evento?"
        }
        description={event.title}
      >
        <p>
          {published
            ? "Se ocultará para nuevas ventas dentro de esta propuesta. Los boletos ya vendidos y sus registros se conservan."
            : "El evento quedará marcado como publicado para venta en línea y taquilla dentro de esta propuesta."}
        </p>
        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
        <div className="admin-dialog-actions">
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Volver
          </Button>
          <Button
            onClick={() => {
              const result = saveEvent({
                ...event,
                status: published ? "unpublished" : "published",
                updatedAt: new Date().toISOString(),
              });
              if (result) setError(result);
              else setConfirm(false);
            }}
          >
            {published ? "Retirar publicación" : "Publicar evento"}
          </Button>
        </div>
      </AdminDialog>
    </div>
  );
}
