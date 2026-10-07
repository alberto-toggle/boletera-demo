"use client";
// Calendar behavior from installed Ark UI DatePicker (MIT).
// https://ark-ui.com/docs/components/date-picker
import { useRef } from "react";
import { DatePicker, parseDate } from "@ark-ui/react/date-picker";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { datePresets, presetRange, type DateRange } from "../sales-filters";
export function SalesDateRange({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (value: DateRange) => void;
}) {
  const calendarRef = useRef<HTMLDetailsElement>(null);
  const validRange = !value.from || !value.to || value.from <= value.to;
  const dates =
    validRange && value.from
      ? [parseDate(value.from), ...(value.to ? [parseDate(value.to)] : [])]
      : [];
  return (
    <div className="seller-date-filter">
      <div className="seller-date-presets">
        {datePresets.map((preset) => (
          <button
            key={preset}
            type="button"
            className="seller-secondary"
            onClick={() => onChange(presetRange(preset, Date.now()))}
          >
            {preset}
          </button>
        ))}
      </div>
      <div className="seller-date-inputs">
        <label>
          Desde
          <input
            type="date"
            value={value.from}
            max={value.to || undefined}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
          />
        </label>
        <label>
          Hasta
          <input
            type="date"
            value={value.to}
            min={value.from || undefined}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
          />
        </label>
        <details
          ref={calendarRef}
          className="seller-calendar-popover"
          onKeyDown={(event) => {
            if (event.key === "Escape" && calendarRef.current) {
              calendarRef.current.open = false;
              calendarRef.current.querySelector("summary")?.focus();
            }
          }}
        >
          <summary>
            <CalendarDays size={18} />
            Elegir en calendario
          </summary>
          <DatePicker.Root
            className="seller-calendar"
            inline
            selectionMode="range"
            locale="es-MX"
            startOfWeek={1}
            timeZone="America/Mexico_City"
            value={dates}
            onValueChange={(details) => {
              onChange({
                from: details.value[0]?.toString() ?? "",
                to: details.value[1]?.toString() ?? "",
              });
              if (details.value.length === 2 && calendarRef.current) {
                calendarRef.current.open = false;
                calendarRef.current.querySelector("summary")?.focus();
              }
            }}
          >
            <DatePicker.Label>Rango de fechas de operación</DatePicker.Label>
            <DatePicker.View view="day">
              <DatePicker.Context>
                {(calendar) => (
                  <>
                    <DatePicker.ViewControl>
                      <DatePicker.PrevTrigger aria-label="Mes anterior">
                        <ChevronLeft size={18} />
                      </DatePicker.PrevTrigger>
                      <DatePicker.MonthSelect aria-label="Mes" />
                      <DatePicker.YearSelect aria-label="Año" />
                      <DatePicker.NextTrigger aria-label="Mes siguiente">
                        <ChevronRight size={18} />
                      </DatePicker.NextTrigger>
                    </DatePicker.ViewControl>
                    <DatePicker.Table>
                      <DatePicker.TableHead>
                        <DatePicker.TableRow>
                          {calendar.weekDays.map((day, i) => (
                            <DatePicker.TableHeader key={i}>
                              {day.short}
                            </DatePicker.TableHeader>
                          ))}
                        </DatePicker.TableRow>
                      </DatePicker.TableHead>
                      <DatePicker.TableBody>
                        {calendar.weeks.map((week, i) => (
                          <DatePicker.TableRow key={i}>
                            {week.map((day, j) => (
                              <DatePicker.TableCell key={j} value={day}>
                                <DatePicker.TableCellTrigger>
                                  {day.day}
                                </DatePicker.TableCellTrigger>
                              </DatePicker.TableCell>
                            ))}
                          </DatePicker.TableRow>
                        ))}
                      </DatePicker.TableBody>
                    </DatePicker.Table>
                  </>
                )}
              </DatePicker.Context>
            </DatePicker.View>
          </DatePicker.Root>
        </details>
      </div>
      {!validRange && (
        <p role="alert" className="seller-error">
          La fecha inicial no puede ser posterior a la final.
        </p>
      )}
      <small>
        Fecha de creación de la operación · Ciudad de México · Extremos
        incluidos.
      </small>
    </div>
  );
}
