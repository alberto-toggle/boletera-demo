"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PaletteSelector } from "@/features/immersive/components/palette-switcher";
import { AppearanceToggle } from "@/features/demo-appearance/appearance-toggle";
import { DEMO_RESET_KEY, reconcileDemoReset } from "./reset-data";
import { Check, FlaskConical, X } from "lucide-react";

const key = "boletera-demo-tools-visible";
const changed = "boletera-demo-tools-change";
let memory = false;
function snapshot() {
  try {
    const value = localStorage.getItem(key);
    return value === null ? memory : value === "true";
  } catch {
    return memory;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changed, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changed, callback);
  };
}
export function DemoVisibilityToggle() {
  const visible = useSyncExternalStore(subscribe, snapshot, () => false);
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={visible}
      className="demo-tools-toggle"
      onClick={() => {
        memory = !visible;
        try {
          localStorage.setItem(key, String(memory));
        } catch {
          /* Keep preference for this tab if storage is unavailable. */
        }
        window.dispatchEvent(new Event(changed));
      }}
    >
      <span className="demo-tools-check" aria-hidden="true">
        {visible && <Check size={14} strokeWidth={3} />}
      </span>
      Mostrar controles y ayudas de demo
    </button>
  );
}
export function DemoDialogTools() {
  return (
    <details className="demo-dialog-tools">
      <summary>
        <FlaskConical size={14} aria-hidden="true" />
        Herramientas de demo
      </summary>
      <DemoVisibilityToggle />
    </details>
  );
}

const proposals = [
  ["institucional", "Institucional"],
  ["gala", "Gala"],
  ["editorial", "Editorial"],
  ["inmersiva", "Inmersiva"],
] as const;

export function DemoTools() {
  const pathname = usePathname();
  useEffect(() => {
    if (reconcileDemoReset()) {
      window.location.reload();
      return;
    }
    const onReset = (event: StorageEvent) => {
      if (event.key === DEMO_RESET_KEY && event.newValue) {
        reconcileDemoReset();
        window.location.reload();
      }
    };
    window.addEventListener("storage", onReset);
    return () => window.removeEventListener("storage", onReset);
  }, []);

  const visible = useSyncExternalStore(subscribe, snapshot, () => false);
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const enabled =
    pathname.startsWith("/demo-") ||
    pathname.startsWith("/operacion/vendedor") ||
    pathname.startsWith("/admin");
  useEffect(() => {
    document.documentElement.dataset.demoTools = visible ? "visible" : "hidden";
    return () => {
      delete document.documentElement.dataset.demoTools;
    };
  }, [visible]);
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
  if (!enabled) return null;
  return (
    <div
      className="demo-tools-widget"
      ref={container}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        className="demo-tools-trigger"
        type="button"
        ref={trigger}
        aria-label={
          open ? "Cerrar herramientas de demo" : "Abrir herramientas de demo"
        }
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <FlaskConical size={20} />}
        <span>Demo</span>
      </button>
      <section
        className="demo-tools-panel"
        id={id}
        hidden={!open}
        aria-label="Herramientas de demo"
      >
        <h2>
          <FlaskConical size={18} />
          Herramientas de demo
        </h2>
        <p>Solo para explorar esta propuesta.</p>
        <DemoVisibilityToggle />
        {proposals.some(
          ([slug]) =>
            pathname === `/demo-${slug}` ||
            pathname.startsWith(`/demo-${slug}/`),
        ) && <AppearanceToggle />}
        {(pathname === "/demo-inmersiva" ||
          pathname.startsWith("/demo-inmersiva/")) && (
          <PaletteSelector compact />
        )}
        <p>
          {visible
            ? "Las ayudas se distinguen por su etiqueta DEMO y borde discontinuo."
            : "Vista de presentación: controles y ayudas ocultos."}
        </p>
        <nav aria-label="Propuestas y operación">
          {proposals.map(([slug, label]) => (
            <Link
              key={slug}
              href={`/demo-${slug}`}
              aria-current={
                pathname.startsWith(`/demo-${slug}`) ? "page" : undefined
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/operacion/vendedor" onClick={() => setOpen(false)}>
            Taquilla
          </Link>
          <Link href="/" onClick={() => setOpen(false)}>
            Ir al inicio
          </Link>
        </nav>
        <small>Demostración · Sin cobros reales</small>
      </section>
    </div>
  );
}
