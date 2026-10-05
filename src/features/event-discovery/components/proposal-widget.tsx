"use client";

import Link from "next/link";
import { Check, PanelsTopLeft, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { DemoDirection } from "../model";

export function ProposalWidget({
  active,
  options,
}: {
  active: DemoDirection;
  options: readonly { id: DemoDirection; label: string; number: string }[];
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      )
        setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div
      className="proposal-widget"
      ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        className="proposal-widget-trigger"
        ref={trigger}
        type="button"
        aria-label={
          open ? "Cerrar versiones de la demo" : "Cambiar versión de la demo"
        }
        title="Versiones de la demo"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X size={21} aria-hidden="true" />
        ) : (
          <PanelsTopLeft size={21} aria-hidden="true" />
        )}
      </button>
      <nav
        id={id}
        hidden={!open}
        className="proposal-widget-panel"
        aria-label="Versiones de la demo"
      >
        <p>Versiones de la demo</p>
        {options.map((option) => (
          <Link
            key={option.id}
            href={`/demo-${option.id}`}
            aria-current={option.id === active ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            <span className="proposal-widget-number">{option.number}</span>
            {option.label}
            {option.id === active && <Check size={16} aria-hidden="true" />}
          </Link>
        ))}
        <Link href="/" className="proposal-widget-all">
          Ver todas las propuestas
        </Link>
      </nav>
    </div>
  );
}
