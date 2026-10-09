"use client";
import { ActionLink } from "../components/controls";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  Globe,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "../components/controls";
import { useAdmin } from "../demo/provider";
import { findVenue, venueCatalog } from "@/domain/venues/catalog";
import { zonesForLayout } from "../demo/fixtures";
import { applyEventExample } from "../demo/event-form-examples";
import { EventFormDemoTools } from "./event-form-demo-tools";
import { dateLabel, money, type AdminEvent, type AdminSale } from "../model";
import { validateEvent } from "./validation";
import { VenuePreview } from "./venue-preview";
import {
  EventInformationFields,
  EventVenueFields,
  EventReview,
  type Cover,
} from "./event-form-sections";
export function EventFormView({ eventId }: { eventId?: string }) {
  const { events, sales, saveEvent, canEdit } = useAdmin();
  if (!canEdit)
    return (
      <EmptyState
        title="Acceso de consulta"
        description="Tu perfil no permite crear ni editar eventos."
      />
    );
  const event = eventId
    ? events.find((item) => item.id === eventId)
    : undefined;
  if (eventId && !event)
    return (
      <EmptyState
        title="Evento no encontrado"
        description="Regresa al catálogo para elegir otro evento."
      >
        <ActionLink href="/admin/eventos">Ver eventos</ActionLink>
      </EmptyState>
    );
  const blank: AdminEvent = {
    id: "",
    title: "",
    category: "Cena baile",
    startsAt: "2027-09-15T19:00:00-06:00",
    venue: venueCatalog[0].name,
    image: "",
    images: [],
    description: "",
    includes: [],
    status: "draft",
    layout: "banquet",
    zones: zonesForLayout("banquet"),
    updatedAt: "",
  };
  const covers = Array.from(
    new Map(
      events
        .filter((item) => item.image.startsWith("/images/events/"))
        .map((item) => [item.image, { src: item.image, label: item.title }]),
    ).values(),
  );
  return (
    <EventForm
      key={eventId ?? "new"}
      initial={event ?? blank}
      sales={sales}
      covers={covers}
      onSave={saveEvent}
    />
  );
}
function EventForm({
  initial,
  sales,
  covers,
  onSave,
}: {
  initial: AdminEvent;
  sales: readonly AdminSale[];
  covers: Cover[];
  onSave: (event: AdminEvent) => string | null;
}) {
  const [draft, setDraft] = useState(initial);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [beforeExample, setBeforeExample] = useState<AdminEvent | null>(null);
  const [demoMessage, setDemoMessage] = useState("");
  const router = useRouter();
  const editing = Boolean(initial.id);
  function update<K extends keyof AdminEvent>(key: K, value: AdminEvent[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  }
  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mediaBusy) return;
    const errors = validateEvent(draft, sales);
    if (errors.length) {
      setError(errors[0]);
      return;
    }
    setError("");
    setStep(Math.min(2, step + 1));
  }
  function save(publish: boolean) {
    const errors = validateEvent(draft, sales);
    if (errors.length) {
      setError(errors[0]);
      return;
    }
    setSaving(true);
    const result = {
      ...draft,
      id: draft.id || `evento-${crypto.randomUUID()}`,
      title: draft.title.trim(),
      description: draft.description.trim(),
      includes: draft.includes.map((item) => item.trim()).filter(Boolean),
      status: publish ? ("published" as const) : draft.status,
      updatedAt: new Date().toISOString(),
    };
    const issue = onSave(result);
    if (issue) {
      setError(issue);
      setSaving(false);
      return;
    }
    router.push(`/admin/eventos/${result.id}`);
  }
  return (
    <div className="admin-page">
      <Link
        className="admin-back"
        href={editing ? `/admin/eventos/${initial.id}` : "/admin/eventos"}
      >
        <ArrowLeft size={15} />
        {editing ? "Volver al evento" : "Eventos"}
      </Link>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">CADA DETALLE CUENTA</p>
          <h1>{editing ? "Editar evento" : "Crea tu próximo encuentro"}</h1>
          <p>Información, distribución y precios, en un solo lugar.</p>
        </div>
        <span className="admin-form-step">Paso {step + 1} de 3</span>
      </div>
      <ol className="admin-stepper">
        {[
          "Información del evento",
          "Recinto y precios",
          "Revisar y guardar",
        ].map((label, index) => (
          <li key={label} aria-current={step === index ? "step" : undefined}>
            <span>{step > index ? <Check size={14} /> : index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <form onSubmit={next} className="admin-editor-grid">
        <div className="admin-panel admin-form-panel">
          <EventFormDemoTools
            editing={editing}
            category={draft.category}
            disabled={mediaBusy || saving}
            canUndo={beforeExample !== null}
            message={demoMessage}
            onFill={(category) => {
              setBeforeExample(draft);
              setDraft(applyEventExample(draft, category));
              setError("");
              setDemoMessage(
                editing
                  ? "Campos vacíos completados. Revisa los datos antes de guardar."
                  : `Ejemplo de ${category.toLowerCase()} cargado. Aún no se ha guardado.`,
              );
            }}
            onUndo={() => {
              if (!beforeExample) return;
              setDraft(beforeExample);
              setBeforeExample(null);
              setError("");
              setDemoMessage(
                "Se restauraron los campos anteriores al autollenado.",
              );
            }}
          />
          {step === 0 && (
            <EventInformationFields
              onMediaChange={(media) =>
                setDraft((current) => ({ ...current, ...media }))
              }
              onMediaBusyChange={setMediaBusy}
              draft={draft}
              covers={covers}
              update={update}
            />
          )}
          {step === 1 && (
            <EventVenueFields
              draft={draft}
              sales={sales}
              update={update}
              onVenueChange={(name) => {
                const venue = findVenue(name);
                if (venue)
                  setDraft({
                    ...draft,
                    venue: venue.name,
                    layout: venue.layout,
                    zones: zonesForLayout(venue.layout),
                    seatOverrides: [],
                  });
              }}
            />
          )}
          {step === 2 && <EventReview draft={draft} editing={editing} />}
          {error && (
            <p className="admin-error admin-form-error" role="alert">
              {error}
            </p>
          )}
          <div className="admin-form-footer">
            {step > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                }}
              >
                <ArrowLeft />
                Anterior
              </Button>
            ) : (
              <ActionLink variant="ghost" href="/admin/eventos">
                Cancelar
              </ActionLink>
            )}
            <div>
              {step < 2 ? (
                <Button type="submit" disabled={mediaBusy}>
                  Continuar
                  <ArrowRight />
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() => save(false)}
                  >
                    <Save />
                    {editing ? "Guardar cambios" : "Guardar borrador"}
                  </Button>
                  {draft.status !== "published" && (
                    <Button
                      type="button"
                      disabled={saving}
                      onClick={() => save(true)}
                    >
                      <Globe />
                      Publicar evento
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <aside className="admin-editor-preview">
          <p className="admin-eyebrow">VISTA PREVIA</p>
          <div className="admin-panel">
            {step === 1 ? (
              <VenuePreview layout={draft.layout} zones={draft.zones} />
            ) : (
              <>
                <div className="admin-form-cover">
                  {draft.image ? (
                    <Image
                      src={draft.image}
                      alt="Portada seleccionada"
                      fill
                      sizes="340px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Sin portada seleccionada
                    </div>
                  )}
                </div>
                <div className="admin-panel-content">
                  <span className="admin-eyebrow">{draft.category}</span>
                  <h2>{draft.title || "Tu próximo gran evento"}</h2>
                  <p>
                    <CalendarDays size={14} />
                    {Number.isFinite(Date.parse(draft.startsAt))
                      ? dateLabel(draft.startsAt, true)
                      : "Fecha por definir"}
                  </p>
                  <p>
                    <MapPin size={14} />
                    {draft.venue}
                  </p>
                  <div className="admin-preview-price">
                    <span>Desde</span>
                    <strong>
                      {money(
                        Math.min(...draft.zones.map((zone) => zone.priceMinor)),
                      )}{" "}
                      <small>MXN</small>
                    </strong>
                  </div>
                </div>
              </>
            )}
          </div>
          <small>
            Los cambios se reflejan aquí mientras preparas el evento.
          </small>
        </aside>
      </form>
    </div>
  );
}
