"use client";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { resetDemoData } from "./reset-data";

export function ResetDemo() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const opener = trigger.current;
    element?.showModal();
    return () => {
      element?.close();
      opener?.focus();
    };
  }, [open]);
  return (
    <>
      <button
        className="hub-reset"
        ref={trigger}
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        Restablecer demo <RotateCcw size={13} aria-hidden="true" />
      </button>
      {open && (
        <dialog
          className="demo-reset-dialog"
          ref={dialog}
          aria-labelledby="reset-demo-title"
          onCancel={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <button
            type="button"
            className="demo-reset-close"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
          <h2 id="reset-demo-title">¿Empezar de nuevo?</h2>
          <p>
            Se borrarán las compras, ventas, cuentas creadas y preferencias de
            esta demo en este navegador. Se cerrarán las sesiones y se
            restaurarán las cuentas y boletos de ejemplo de Alex y Sofía.
          </p>
          <p>
            También se reiniciarán las otras pestañas abiertas de la demo. Esta
            acción no se puede deshacer.
          </p>
          {error && <p role="alert">{error}</p>}
          <div className="demo-reset-actions">
            <button type="button" autoFocus onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  resetDemoData();
                  window.location.reload();
                } catch {
                  setError(
                    "No se pudieron borrar todos los datos. Revisa los permisos de almacenamiento del navegador e inténtalo de nuevo.",
                  );
                }
              }}
            >
              Restablecer demo
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
