"use client";
import { EventMediaEditor } from "../media/event-media-editor";
import type { EventMedia } from "../media/model";
import { eventCategories, isEventCategory } from "@/domain/events/category";
import { findVenue, venueCatalog } from "@/domain/venues/catalog";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminSelect } from "../components/controls";
import {
  dateLabel,
  money,
  zoneSold,
  type AdminEvent,
  type AdminSale,
} from "../model";
export interface Cover {
  src: string;
  label: string;
}
export type UpdateEvent = <K extends keyof AdminEvent>(
  key: K,
  value: AdminEvent[K],
) => void;

export function EventInformationFields({
  draft,
  covers,
  update,
  onMediaChange,
  onMediaBusyChange,
}: {
  draft: AdminEvent;
  covers: Cover[];
  onMediaChange: (media: EventMedia) => void;
  onMediaBusyChange: (busy: boolean) => void;
  update: UpdateEvent;
}) {
  return (
    <>
      <div className="admin-form-section">
        <h2>Información general</h2>
        <p>Lo que tus asistentes necesitan saber.</p>
        <label>
          Nombre del evento
          <Input
            required
            minLength={3}
            maxLength={100}
            value={draft.title}
            placeholder="Ej. Noche de Independencia"
            onChange={(e) => update("title", e.target.value)}
          />
        </label>
        <div className="admin-form-row">
          <label>
            Categoría
            <AdminSelect
              label="Categoría"
              value={draft.category}
              options={eventCategories.map((value) => ({
                value,
                label: value,
              }))}
              onChange={(value) => {
                if (isEventCategory(value)) update("category", value);
              }}
            />
          </label>
          <label>
            Fecha y hora · CDMX
            <Input
              type="datetime-local"
              required
              value={draft.startsAt.slice(0, 16)}
              onChange={(e) => update("startsAt", `${e.target.value}:00-06:00`)}
            />
          </label>
        </div>
        <label>
          Descripción
          <textarea
            required
            minLength={20}
            maxLength={2000}
            rows={4}
            value={draft.description}
            placeholder="Cuenta qué hace especial a este encuentro…"
            onChange={(e) => update("description", e.target.value)}
          />
        </label>
        <label>
          ¿Qué incluye?
          <textarea
            rows={3}
            value={draft.includes.join("\n")}
            placeholder={"Cena de tres tiempos\nMúsica en vivo\nLugar asignado"}
            onChange={(e) => update("includes", e.target.value.split("\n"))}
          />
          <small>Un elemento por línea.</small>
        </label>
      </div>
      <EventMediaEditor
        value={{ image: draft.image, images: draft.images ?? [] }}
        covers={covers}
        onChange={onMediaChange}
        onBusyChange={onMediaBusyChange}
      />
    </>
  );
}
export function EventVenueFields({
  draft,
  sales,
  update,
  onVenueChange,
}: {
  draft: AdminEvent;
  sales: readonly AdminSale[];
  update: UpdateEvent;
  onVenueChange: (name: string) => void;
}) {
  const sold = sales.some(
    (sale) => sale.eventId === draft.id && sale.status === "confirmed",
  );
  const totalCapacity = draft.zones.reduce(
    (sum, zone) => sum + zone.capacity,
    0,
  );
  return (
    <>
      <div className="admin-form-section">
        <h2>Recinto y distribución</h2>
        <p>
          Elige el recinto; su mapa y distribución se cargan automáticamente.
        </p>
        <label>
          Recinto
          <AdminSelect
            label="Recinto"
            value={draft.venue}
            options={venueCatalog.map((venue) => ({
              value: venue.name,
              label: venue.name,
            }))}
            disabled={sold}
            onChange={onVenueChange}
          />
        </label>
        <div className="admin-note" role="status">
          <strong>Distribución del recinto</strong>
          <p>{findVenue(draft.venue)?.description}</p>
        </div>
        {sold && (
          <p className="admin-note">
            Este evento ya tiene ventas. Conservamos su recinto y distribución
            para proteger los lugares emitidos.
          </p>
        )}
      </div>
      <div className="admin-form-section">
        <h2>Aforo y precios</h2>
        <p>
          Los precios nuevos aplican a ventas futuras. Los boletos emitidos
          conservan su importe.
        </p>
        <div className="admin-table-scroll">
          <table className="admin-table admin-pricing-table">
            <thead>
              <tr>
                <th>Zona</th>
                <th>Capacidad</th>
                <th>Precio · MXN</th>
              </tr>
            </thead>
            <tbody>
              {draft.zones.map((zone, index) => (
                <tr key={zone.id}>
                  <td>
                    <strong>{zone.name}</strong>
                    <small className="admin-cell-sub">
                      {zoneSold(draft.id, zone.id, sales)} vendidos
                    </small>
                  </td>
                  <td>
                    <Input
                      aria-label={`Capacidad ${zone.name}`}
                      type="number"
                      required
                      min={Math.max(1, zoneSold(draft.id, zone.id, sales))}
                      max={10000}
                      step={1}
                      value={zone.capacity || ""}
                      onChange={(e) =>
                        update(
                          "zones",
                          draft.zones.map((item, i) =>
                            i === index
                              ? { ...item, capacity: Number(e.target.value) }
                              : item,
                          ),
                        )
                      }
                    />
                  </td>
                  <td>
                    <Input
                      aria-label={`Precio ${zone.name}`}
                      type="number"
                      required
                      min={0}
                      max={1000000}
                      step="0.01"
                      value={zone.priceMinor / 100}
                      onChange={(e) =>
                        update(
                          "zones",
                          draft.zones.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  priceMinor: Math.round(
                                    Number(e.target.value) * 100,
                                  ),
                                }
                              : item,
                          ),
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-pricing-total">
          <span>Capacidad total</span>
          <strong>{totalCapacity} lugares</strong>
        </div>
      </div>
    </>
  );
}
export function EventReview({
  draft,
  editing,
}: {
  draft: AdminEvent;
  editing: boolean;
}) {
  const totalCapacity = draft.zones.reduce(
    (sum, zone) => sum + zone.capacity,
    0,
  );
  return (
    <div className="admin-form-section">
      <h2>Todo listo para tu evento</h2>
      <p>Revisa los detalles antes de guardar o publicar.</p>
      <dl className="admin-review-list">
        <div>
          <dt>Nombre</dt>
          <dd>{draft.title}</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>{dateLabel(draft.startsAt, true)} · CDMX</dd>
        </div>
        <div>
          <dt>Recinto</dt>
          <dd>{draft.venue}</dd>
        </div>
        <div>
          <dt>Distribución</dt>
          <dd>
            {draft.layout === "banquet" ? "Cena-baile" : "Auditorio"} ·{" "}
            {totalCapacity} lugares
          </dd>
        </div>
        <div>
          <dt>Precios</dt>
          <dd>
            {money(Math.min(...draft.zones.map((zone) => zone.priceMinor)))} –{" "}
            {money(Math.max(...draft.zones.map((zone) => zone.priceMinor)))}
          </dd>
        </div>
      </dl>
      <h3>Descripción</h3>
      <p className="admin-description">{draft.description}</p>
      <ul className="admin-includes">
        {draft.includes.filter(Boolean).map((item, index) => (
          <li key={index}>
            <Check size={14} />
            {item}
          </li>
        ))}
      </ul>
      <div className="admin-note">
        {editing
          ? "Los cambios conservan las ventas y los boletos existentes."
          : "Puedes guardarlo como borrador y publicarlo cuando esté listo."}
      </div>
    </div>
  );
}
