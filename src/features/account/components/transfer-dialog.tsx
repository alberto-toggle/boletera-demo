"use client";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountDialog } from "./account-dialog";
import { canTransfer, requestTransfer, type AccountOrder } from "../model";
import { updateAccount, useAccount } from "../store";
import { useAccountClock } from "../use-account-clock";
import { companion } from "../fixtures";
export function TransferDialog({
  order,
  onClose,
  onDone,
}: {
  order: AccountOrder;
  onClose: () => void;
  onDone: () => void;
}) {
  const { state } = useAccount();
  const id = useId();
  const clock = useAccountClock();
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState(false);
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!selected.length) {
      setError("Selecciona al menos un boleto.");
      return;
    }
    const now = Date.now();
    const transfer = {
      id: `TRANSFER-${crypto.randomUUID()}`,
      orderId: order.id,
      ticketIds: selected,
      from: state.session ?? "",
      to: email,
      recipientName: name,
      status: "pending" as const,
      createdAt: new Date(now).toISOString(),
    };
    try {
      if (!review) {
        requestTransfer(state, transfer, now);
        setReview(true);
      } else {
        updateAccount((current) => requestTransfer(current, transfer, now));
        onDone();
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo transferir. Intenta de nuevo.",
      );
    }
  }
  return (
    <AccountDialog
      title={review ? "Confirma la transferencia" : "Transferir boletos"}
      onClose={onClose}
    >
      <form className="transfer-form" onSubmit={submit}>
        <p>{order.event.title}</p>
        {review ? (
          <>
            <p>
              Enviarás{" "}
              <strong>
                {selected.length} {selected.length === 1 ? "boleto" : "boletos"}
              </strong>{" "}
              a <strong>{name}</strong>.
            </p>
            <p>{email}</p>
            <ul>
              {order.tickets
                .filter((t) => selected.includes(t.id))
                .map((t) => (
                  <li key={t.id}>{t.seatLabel}</li>
                ))}
            </ul>
            <p className="account-disclaimer">
              Cuando acepte, los accesos anteriores quedarán invalidados,
              incluidos los PDFs ya descargados. Puedes cancelar mientras siga
              pendiente.
            </p>
          </>
        ) : (
          <>
            <fieldset>
              <legend>Elige los boletos que quieres compartir</legend>
              {order.tickets
                .filter((t) => canTransfer(state, order, t, clock))
                .map((t) => (
                  <label className="transfer-seat" key={t.id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(t.id)}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? [...selected, t.id]
                            : selected.filter((x) => x !== t.id),
                        )
                      }
                    />
                    {t.seatLabel}
                  </label>
                ))}
            </fieldset>
            <div>
              <Label htmlFor={`${id}-name`}>Nombre del destinatario</Label>
              <Input
                id={`${id}-name`}
                required
                minLength={3}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`${id}-email`}>Correo del destinatario</Label>
              <Input
                id={`${id}-email`}
                type="email"
                required
                maxLength={120}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {state.session !== companion.email && (
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  setName(companion.name);
                  setEmail(companion.email);
                }}
              >
                Usar a Sofía como destinataria de prueba
              </Button>
            )}
          </>
        )}
        {error && <p role="alert">{error}</p>}
        <div className="account-actions">
          {review && (
            <Button
              variant="outline"
              type="button"
              onClick={() => setReview(false)}
            >
              <ArrowLeft size={16} />
              Editar
            </Button>
          )}
          <Button className="demo-button" type="submit">
            {review ? "Confirmar transferencia" : "Revisar transferencia"}
            <ArrowRight size={17} />
          </Button>
        </div>
        <small className="account-disclaimer">
          Simulación: no se enviarán correos ni boletos reales.
        </small>
      </form>
    </AccountDialog>
  );
}
