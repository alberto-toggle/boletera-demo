"use client";
import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DateRange } from "../model";
export function DateFilter({
  value,
  onChange,
  referenceDate,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
  referenceDate: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const presets = [
    { label: "Últimos 7 días", days: 7 },
    { label: "Últimos 30 días", days: 30 },
    { label: "Este mes", days: 0 },
    { label: "Todo el historial", days: -1 },
  ];
  const short = (date: string) =>
    new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(`${date}T12:00:00Z`));
  function preset(days: number) {
    const start = new Date(`${referenceDate}T12:00:00Z`);
    if (days === 0) start.setUTCDate(1);
    else start.setUTCDate(start.getUTCDate() - days + 1);
    onChange(
      days === -1
        ? { from: "", to: "" }
        : { from: start.toISOString().slice(0, 10), to: referenceDate },
    );
    setOpen(false);
  }
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setDraft(value);
      }}
    >
      <Popover.Trigger
        render={<Button variant="outline" className="admin-date-trigger" />}
      >
        <CalendarDays size={15} />
        {value.from && value.to
          ? `${short(value.from)} – ${short(value.to)}`
          : "Todo el historial"}
        <ChevronDown size={13} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          sideOffset={8}
          align="end"
          className="admin-popover-positioner"
        >
          <Popover.Popup className="admin-theme admin-date-popup">
            <Popover.Title>Fecha de venta</Popover.Title>
            <p>Horario de Ciudad de México</p>
            <div className="admin-date-presets">
              {presets.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => preset(item.days)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="admin-date-inputs">
              <label>
                Desde
                <Input
                  type="date"
                  value={draft.from}
                  max={draft.to || undefined}
                  onChange={(e) => setDraft({ ...draft, from: e.target.value })}
                />
              </label>
              <label>
                Hasta
                <Input
                  type="date"
                  value={draft.to}
                  min={draft.from || undefined}
                  onChange={(e) => setDraft({ ...draft, to: e.target.value })}
                />
              </label>
            </div>
            {draft.from && draft.to && draft.from > draft.to && (
              <p role="alert" className="admin-error">
                La fecha inicial debe ser anterior a la final.
              </p>
            )}
            <Button
              className="admin-full"
              disabled={!draft.from || !draft.to || draft.from > draft.to}
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              Aplicar rango
            </Button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
