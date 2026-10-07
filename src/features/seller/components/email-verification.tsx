"use client";
import { DemoDialogTools } from "@/features/demo-tools/demo-tools";
import { useEffect, useId, useRef, useState } from "react";
import { MailCheck, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
export function EmailVerification({
  email,
  accountName,
  verified,
  onSend,
  onVerify,
  onCorrect,
}: {
  email: string;
  accountName?: string;
  verified: boolean;
  onSend: () => string | null;
  onVerify: (code: string) => string | null;
  onCorrect?: () => void;
}) {
  const [open, setOpen] = useState(!!accountName && !verified);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open || verified) return;
    const dialog = ref.current;
    const opener = document.activeElement;
    const fallback = trigger.current;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
      else fallback?.focus();
    };
  }, [open, verified]);
  function verify() {
    if (code.length !== 6) return;
    const error = onVerify(code);
    setMessage(error ?? "");
    if (!error) setOpen(false);
  }
  if (verified)
    return (
      <p className="seller-notice" role="status">
        <MailCheck size={20} />
        <span>
          Correo verificado · {email}
          {accountName && (
            <small className="seller-verified-account">
              Cuenta vinculada: {accountName}
            </small>
          )}
        </span>
      </p>
    );
  return (
    <div className="seller-email-verification">
      <strong>
        {accountName
          ? "Verifica la cuenta del comprador"
          : "Verifica el correo del comprador"}
      </strong>
      <p>
        Confirma los datos y el código con el comprador antes de pasar al cobro.
      </p>
      <Button
        ref={trigger}
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Verificar correo
      </Button>
      {open && (
        <dialog
          ref={ref}
          className="seller-information-dialog seller-verification-dialog"
          aria-labelledby={titleId}
          onCancel={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          <header>
            <div>
              <p className="seller-eyebrow">
                {accountName ? "CONFIRMAR CUENTA" : "CONFIRMAR CORREO"}
              </p>
              <h2 id={titleId}>Verifica con el comprador</h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Cerrar verificación"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </Button>
          </header>
          <div className="seller-information-scroll">
            <div className="seller-verification-recipient">
              {accountName && <strong>{accountName}</strong>}
              <p>{email}</p>
            </div>
            <p>
              {accountName
                ? "Confirma que esta es su cuenta. Los boletos quedarán asociados a ella al completar la venta."
                : "Confirma que el correo es correcto para entregar una copia de sus boletos."}
            </p>
            {onCorrect && (
              <button
                type="button"
                className="seller-text-button"
                onClick={() => {
                  setOpen(false);
                  onCorrect();
                }}
              >
                {accountName ? "Cambiar cuenta" : "Corregir correo"}
              </button>
            )}
            <Button
              type="button"
              className={sent ? "seller-secondary" : "seller-primary"}
              onClick={() => {
                const error = onSend();
                setMessage(
                  error ??
                    "Código de prueba enviado. No se envía un correo real.",
                );
                if (!error) setSent(true);
              }}
            >
              <Send size={16} />
              {sent ? "Reenviar código" : "Confirmar y enviar código"}
            </Button>
            {sent && (
              <>
                <p data-demo className="seller-muted">
                  Código demo: <strong>123456</strong> · Válido por 5 minutos.
                </p>
                <label>
                  Código de verificación
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        verify();
                      }
                    }}
                  />
                </label>
                <Button
                  type="button"
                  className="seller-primary"
                  disabled={code.length !== 6}
                  onClick={verify}
                >
                  Confirmar código
                </Button>
              </>
            )}
            <p role="status">{message}</p>
            <small>
              El tiempo de apartado sigue corriendo durante la verificación.
            </small>
          </div>
          <DemoDialogTools />
        </dialog>
      )}
    </div>
  );
}
